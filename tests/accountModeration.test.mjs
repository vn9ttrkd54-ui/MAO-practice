import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import * as crypto from "node:crypto";
import ts from "typescript";
import rules from "../lib/auth/publicNameRules.json" with { type: "json" };

async function load(path, dependencies={}, globals={}) {
  const source=await readFile(new URL(`../${path}`,import.meta.url),"utf8");
  const output=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
  const exports={};
  runInNewContext(output,{exports,URL,TextDecoder,AbortSignal,Buffer,process:{env:{NEXT_PUBLIC_SUPABASE_URL:"https://fixture.supabase.co",NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:"public-fixture-key"}},...globals,
    require(name){assert.ok(Object.hasOwn(dependencies,name),`Unexpected dependency ${name} in ${path}`);return dependencies[name];}});
  return exports;
}
const constants=await load("lib/auth/moderation.ts");
const access=await load("lib/auth/accountAccess.ts");
const security=await load("lib/security/request.ts",{"server-only":{}});
const names=await load("lib/auth/publicNames.ts",{"./publicNameRules.json":{default:rules}});
const id=n=>`00000000-0000-4000-8000-${String(n).padStart(12,"0")}`;
const ACTOR=id(1),TARGET=id(2),SESSION=id(3);
const base={action:"require_name_change",reason:"Reviewed an inappropriate name",confirmation:`CONFIRM ${TARGET}`,version:0,requestId:id(4),currentPassword:"correct-password"};

async function invoke(options={}) {
  const effects=[];
  const cookies=new Map(Object.entries(options.cookies??{}));
  const actor={user:{id:ACTOR,email:"private-admin@example.test",app_metadata:options.google?{password_login_enabled:false}:{}},role:options.role??"admin",
    client:{auth:{getClaims:async()=>({data:{claims:{session_id:SESSION}}})}},
    admin:{
      from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:options.missingTarget?null:{role:options.targetRole??"user"},error:options.targetError?{message:"private SQL"}:null})})})}),
      rpc:async(name,params)=>{effects.push({name,params});return {data:name==="consume_login_attempt"?!options.limited:name==="consume_moderation_verification"?!options.proofDenied:{success:true},error:name==="moderate_account"?options.databaseError??null:name==="consume_login_attempt"&&options.limiterError?{message:"private SQL"}:null};},
    }};
  const api=await load("app/api/admin/users/[id]/moderation/route.ts",{
    "node:crypto":crypto,"next/server":{NextResponse:{json:(body,init)=>Response.json(body,init)}},
    "next/headers":{cookies:async()=>({get:key=>cookies.has(key)?{value:cookies.get(key)}:undefined,delete:key=>cookies.delete(key)})},
    "@supabase/supabase-js":{createClient:(url,key,config)=>{
      effects.push({name:"verifier",url,key,config});
      return {auth:{signInWithPassword:async params=>{effects.push({name:"password",params});return {data:{user:{id:options.wrongIdentity?id(9):ACTOR},session:options.badPassword?null:{}},error:options.badPassword?{message:"private provider detail"}:null};},signOut:async params=>{effects.push({name:"signout",params});return {error:null};}}};
    }},
    "@/lib/services/accountModerationService":{moderationActor:async()=>options.denied?null:actor},
    "@/lib/security/request":security,"@/lib/auth/moderation":constants,
    "@/lib/auth/googleFlow":{GOOGLE_MODERATION_COOKIE:"md_google_moderation"},
  });
  const body=options.raw??JSON.stringify({...base,...options.body});
  const request=new Request("https://site.test/api/admin/users/target/moderation",{method:"POST",headers:{Origin:options.origin??"https://site.test","Content-Type":"application/json"},body});
  const response=await api.POST(request,{params:Promise.resolve({id:options.target??TARGET})});
  return {response,body:await response.json(),effects,cookies};
}

test("moderation rejects cross-origin, oversized/malformed bodies and unconfirmed actions before effects",async()=>{
  for(const options of [{origin:"https://evil.test"},{raw:"{"},{raw:"x".repeat(9000)},{body:{action:"promote"}},{body:{confirmation:"DELETE"}},{body:{version:-1}},{body:{requestId:"bad"}},{body:{reason:""}}]) {
    const result=await invoke(options);assert.ok(result.response.status>=400);assert.deepEqual(result.effects,[]);
  }
});
test("server denies regular users, self, protected targets and administrator deletion",async()=>{
  for(const options of [{denied:true},{target:ACTOR,body:{confirmation:`CONFIRM ${ACTOR}`}},{targetRole:"admin"},{targetRole:"owner"},{body:{action:"delete",confirmation:`DELETE ${TARGET}`}}]) {
    const result=await invoke(options);assert.equal(result.response.status,403);assert.deepEqual(result.effects,[]);
  }
});
test("fresh actor password and identity are required; limiter failures fail closed",async()=>{
  for(const options of [{badPassword:true},{wrongIdentity:true},{limited:true},{limiterError:true},{body:{currentPassword:""}}]) {
    const result=await invoke(options);assert.ok(result.response.status>=400);assert.equal(result.effects.some(e=>e.name==="moderate_account"),false);assert.doesNotMatch(JSON.stringify(result.body),/private|correct-password/);
  }
});
test("successful action uses verified actor, bounded reason/version, private fresh session and no-store response",async()=>{
  const result=await invoke({body:{actorId:id(9),role:"owner",userId:id(8)}});
  assert.equal(result.response.status,200);assert.equal(result.response.headers.get("Cache-Control"),"no-store");
  const effect=result.effects.find(e=>e.name==="moderate_account");
  assert.equal(effect.params.p_actor_id,ACTOR);assert.equal(effect.params.p_target_id,TARGET);assert.equal(effect.params.p_expected_version,0);
  assert.equal(effect.params.p_request_id,base.requestId);
  const verifier=result.effects.find(e=>e.name==="verifier");
  assert.equal(verifier.key,"public-fixture-key");assert.equal(verifier.config.auth.persistSession,false);
  assert.equal(result.effects.find(e=>e.name==="signout").params.scope,"local");
  assert.deepEqual(result.body,{success:true});
  const owner=await invoke({role:"owner",body:{action:"delete",confirmation:`DELETE ${TARGET}`}});
  assert.equal(owner.response.status,200);assert.equal(owner.effects.find(e=>e.name==="moderate_account").params.p_action,"delete");
});
test("Google proof is actor/session-bound, hashed, consumed once, and cannot use deletion proof cookie",async()=>{
  const token="a".repeat(64);
  for(const options of [{},{cookies:{md_google_delete:token}},{cookies:{md_google_moderation:token},proofDenied:true}]) {
    const result=await invoke({google:true,...options});assert.equal(result.response.status,401);assert.equal(result.effects.some(e=>e.name==="moderate_account"),false);
  }
  const result=await invoke({google:true,cookies:{md_google_moderation:token}});
  assert.equal(result.response.status,200);
  const proof=result.effects.find(e=>e.name==="consume_moderation_verification");
  assert.equal(proof.params.p_user_id,ACTOR);assert.equal(proof.params.p_session_id,SESSION);assert.equal(proof.params.p_token_hash,crypto.createHash("sha256").update(token).digest("hex"));
  assert.equal(result.cookies.has("md_google_moderation"),false);
  assert.equal(result.effects.some(e=>e.name==="password"),false);
});
test("stale versions and changed permissions are useful errors without raw database leakage",async()=>{
  for(const [code,status] of [["40001",409],["42501",403],["P0001",429],["23503",503]]) {
    const result=await invoke({databaseError:{code,message:"private SQL credentials"}});
    assert.equal(result.response.status,status);assert.equal(result.body.success,undefined);assert.doesNotMatch(result.body.error,/private SQL/);
  }
});
test("shared server Auth guard blocks restricted accounts before service-role work, without an extra read",async()=>{
  for(const metadata of [{},{requires_name_change:true},{account_suspended:true},{requires_name_change:false,user_metadata:{account_suspended:true}}]) {
    let reads=0;
    const {createClient}=await load("lib/supabase/server.ts",{
      "@supabase/ssr":{createServerClient:()=>({auth:{getUser:async()=>{reads++;return {data:{user:{id:ACTOR,app_metadata:metadata}},error:null};}}})},
      "next/headers":{cookies:async()=>({getAll:()=>[],set:()=>{}})},
      "next/navigation":{redirect:path=>{throw new Error(`redirect:${path}`);}},
      "@/lib/auth/accountAccess":access,"./cookieOptions":{authCookieOptions:{}},
    });
    const client=await createClient();
    if(metadata.requires_name_change||metadata.account_suspended) await assert.rejects(client.auth.getUser(),/redirect:\/auth\/resolve/);
    else assert.equal((await client.auth.getUser()).data.user.id,ACTOR);
    assert.equal(reads,1);
    assert.equal((await (await createClient(undefined,{allowRestricted:true})).auth.getUser()).data.user.id,ACTOR);
    assert.equal(reads,2);
  }
});
test("moderation actor checks current authenticated identity and database role, not user-editable metadata",async()=>{
  for(const options of [{role:"user"},{role:"admin"},{role:"owner"},{role:"admin",suspended:true},{role:"owner",error:true}]) {
    const {moderationActor}=await load("lib/services/accountModerationService.ts",{
      "server-only":{},"@/lib/auth/accountAccess":access,
      "@/lib/auth/roles":await load("lib/auth/roles.ts"),
      "@/lib/supabase/server":{createClient:async()=>({auth:{getUser:async()=>({data:{user:{id:ACTOR,app_metadata:{account_suspended:options.suspended},user_metadata:{role:"owner"}}},error:options.error?{}:null})}})},
      "@/lib/supabase/admin":{createAdminClient:()=>({from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:{role:options.role},error:null})})})})})},
    });
    assert.equal(Boolean(await moderationActor()),options.role!=="user"&&!options.suspended&&!options.error);
  }
});

test("required rename is self-only, validates names, rejects suspension and reports committed save despite refresh failure",async()=>{
  for(const options of [{},{suspended:true},{signedOut:true},{username:"alligatorraper"},{conflict:true},{refreshError:true}]) {
    const effects=[];
    const api=await load("app/api/account/moderation/route.ts",{
      "next/server":{NextResponse:{json:(body,init)=>Response.json(body,init)}},
      "@/lib/auth/accountAccess":access,"@/lib/auth/publicNames":names,"@/lib/security/request":security,
      "@/lib/supabase/server":{createClient:async()=>({auth:{getUser:async()=>({data:{user:options.signedOut?null:{id:ACTOR,app_metadata:{requires_name_change:true,account_suspended:options.suspended}}}}),refreshSession:async()=>({error:options.refreshError?{}:null})}})},
      "@/lib/supabase/admin":{createAdminClient:()=>({rpc:async(name,params)=>{effects.push({name,params});return {data:true,error:name==="set_account_username"&&options.conflict?{code:"23505",message:"private"}:null};}})},
    });
    const response=await api.POST(new Request("https://site.test/api/account/moderation",{method:"POST",headers:{Origin:"https://site.test","Content-Type":"application/json"},body:JSON.stringify({username:options.username??"safe_new_name",userId:TARGET})}));
    const body=await response.json();
    if(options.suspended||options.signedOut||options.username) { assert.ok(response.status>=400);assert.equal(effects.length,0); }
    else {
      assert.equal(effects.find(e=>e.name==="set_account_username").params.p_user_id,ACTOR);
      if(options.conflict) {assert.equal(response.status,409);assert.equal(body.success,undefined);}
      else {assert.equal(body.success,true);assert.equal(body.username,"safe_new_name");assert.equal(body.signInAgain,Boolean(options.refreshError));}
    }
  }
});

test("old moderated login is resolved privately; public result contains no alias, email or identifier",async()=>{
  for(const aliasExists of [true,false]) {
    let signedIn=0;
    const api=await load("app/api/auth/login/route.ts",{
      "next/server":{NextResponse:{json:(body,init)=>Response.json(body,init)}},"@/lib/security/request":security,
      "@/lib/supabase/server":{createClient:async()=>({auth:{signInWithPassword:async({email,password})=>{signedIn++;assert.equal(email,"private@example.test");assert.equal(password,"provided");return {error:null};}}})},
      "@/lib/supabase/admin":{createAdminClient:()=>({
        from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:null,error:null})})})}),
        rpc:async name=>({data:name==="resolve_login_username"?(aliasExists?ACTOR:null):true,error:null}),
        auth:{admin:{getUserById:async uid=>{assert.equal(uid,ACTOR);return {data:{user:{email:"private@example.test"}},error:null};}}},
      })},
    },{crypto:crypto.webcrypto,TextEncoder});
    const response=await api.POST(new Request("https://site.test/api/auth/login",{method:"POST",headers:{Origin:"https://site.test"},body:JSON.stringify({username:"old_name",password:"provided"})}));
    assert.equal(response.status,aliasExists?200:401);assert.equal(signedIn,aliasExists?1:0);
    assert.doesNotMatch(await response.text(),/private@example|old_name|00000000/);
  }
});
