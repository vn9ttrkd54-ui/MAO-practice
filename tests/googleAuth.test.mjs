import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import * as crypto from "node:crypto";
import test from "node:test";
import ts from "typescript";
import rules from "../lib/auth/publicNameRules.json" with { type: "json" };

async function load(path,dependencies={},globals={}) {
  const source=await readFile(new URL(`../${path}`,import.meta.url),"utf8");
  const output=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
  const exports={};
  runInNewContext(output,{exports,Buffer,Date,URL,TextDecoder,process:{env:{SUPABASE_SECRET_KEY:"isolated-google-test-secret"}},...globals,require(name){
    assert.ok(Object.hasOwn(dependencies,name),`Unexpected dependency ${name} in ${path}`);return dependencies[name];
  }});
  return exports;
}
const security=await load("lib/security/request.ts",{"server-only":{}});
const flow=await load("lib/auth/googleFlow.ts",{"server-only":{},"node:crypto":crypto});
const names=await load("lib/auth/publicNames.ts",{"./publicNameRules.json":{default:rules}});
const policy=await load("lib/auth/passwordPolicy.ts");
const USER="00000000-0000-4000-8000-000000000001";
const OTHER="00000000-0000-4000-8000-000000000002";
const SESSION="00000000-0000-4000-8000-000000000003";

async function invoke(path,{method="POST",body={},query="",...options}={}) {
  const effects=[];
  const user=options.signedOut?null:{id:options.userId??USER,email:"private@example.test",app_metadata:options.metadata??{},identities:options.noGoogle?[]:[{provider:"google"}]};
  const cookieValues=new Map(Object.entries(options.cookies??{}));
  const cookieStore={get:name=>cookieValues.has(name)?{value:cookieValues.get(name)}:undefined,
    set:(name,value,settings)=>{cookieValues.set(name,value);effects.push({kind:"cookie",name,settings});},
    delete:name=>cookieValues.delete(name)};
  const client={auth:{
    getUser:async()=>({data:{user}}),
    getClaims:async()=>({data:{claims:{session_id:options.sessionId??SESSION}}}),
    signInWithPassword:async value=>{effects.push({kind:"password",value});return {error:options.passwordError?{message:"private detail"}:null};},
    signInWithOAuth:async value=>{effects.push({kind:"oauth",value});return {data:{url:"https://fixture.supabase.co/auth/v1/authorize"},error:options.providerError?{message:"private detail"}:null};},
    linkIdentity:async value=>{effects.push({kind:"link",value});return {data:{url:"https://fixture.supabase.co/auth/v1/authorize"},error:options.providerError?{message:"private detail"}:null};},
    exchangeCodeForSession:async code=>{effects.push({kind:"exchange",code});return {data:{session:options.exchangeError?null:{provider_token:options.noProviderToken?undefined:"test-provider-token"}},error:options.exchangeError?{message:"private detail"}:null};},
    refreshSession:async()=>{effects.push({kind:"refresh"});return {error:options.refreshError?{}:null};},
    signOut:async()=>{effects.push({kind:"signout"});return {error:null};},
    updateUser:async value=>{effects.push({kind:"update",value});return {data:{user},error:null};},
  }};
  const admin={rpc:async(name,value)=>{effects.push({kind:"rpc",name,value});return {data:options.proofDenied?false:true,error:options.rpcError??null};},
    auth:{admin:{deleteUser:async id=>{effects.push({kind:"delete",id});return {error:null};}}}};
  const handlers=await load(path,{
    "next/server":{NextResponse:{json:(data,init)=>Response.json(data,init),redirect:url=>Response.redirect(url)}},
    "next/headers":{cookies:async()=>cookieStore},"node:crypto":crypto,
    "@/lib/supabase/server":{createClient:async()=>client},"@/lib/supabase/admin":{createAdminClient:()=>admin},
    "@/lib/security/request":security,"@/lib/auth/googleFlow":flow,"@/lib/auth/publicNames":names,
    "@/lib/auth/passwordPolicy":policy,"@/lib/legal":{LEGAL_VERSION:"2026-09-07"},
  });
  const request=new Request(`https://site.test/fixture${query}`,{method,headers:{Origin:options.origin??"https://site.test"},...(method==="GET"?{}:{body:typeof body==="string"?body:JSON.stringify(body)})});
  const response=await handlers[method](request);
  return {status:response.status,location:response.headers.get("location"),body:response.status===200||response.status>=400?await response.json():null,effects,cookieValues};
}
const init="app/api/auth/google/route.ts",callback="app/auth/callback/route.ts",setup="app/api/auth/setup/route.ts",account="app/api/account/route.ts";

test("signed intentions expire, cannot be edited, and cannot cross signing keys",async()=>{
  let now=Date.now();
  const timed=await load("lib/auth/googleFlow.ts",{"server-only":{},"node:crypto":crypto},{Date:{now:()=>now}});
  const token=timed.createGoogleIntent("link",USER);
  assert.equal(timed.readGoogleIntent(token).userId,USER);
  for(const bad of [undefined,"",token+".",token+"x",token.replace(/.$/,"z"),"a."+"0".repeat(64)]) assert.equal(timed.readGoogleIntent(bad),null);
  const otherKey=await load("lib/auth/googleFlow.ts",{"server-only":{},"node:crypto":crypto},{process:{env:{SUPABASE_SECRET_KEY:"other-key"}}});
  assert.equal(otherKey.readGoogleIntent(token),null);
  now+=600_000;assert.equal(timed.readGoogleIntent(token),null);
});
test("OAuth rejects cross-origin, malformed actions and unsigned account linking",async()=>{
  assert.equal((await invoke(init,{origin:"https://evil.test",body:{mode:"signin"}})).status,403);
  for(const mode of [null,[],["signin"],{},1,"bad"]) {
    const result=await invoke(init,{body:{mode}});assert.equal(result.status,400);assert.deepEqual(result.effects,[]);
  }
  assert.equal((await invoke(init,{signedOut:true,body:{mode:"link"}})).status,401);
  assert.equal((await invoke(init,{signedOut:true,body:{mode:"verify-delete"}})).status,401);
  assert.equal((await invoke(init,{body:{mode:"signin"}})).status,400);
});
test("Google initiation fixes the callback and issues a signed HTTP-only intent",async()=>{
  const result=await invoke(init,{signedOut:true,body:{mode:"signin",redirectTo:"https://evil.test"}});
  assert.equal(result.status,200);
  const oauth=result.effects.find(e=>e.kind==="oauth").value;
  assert.equal(oauth.provider,"google");assert.equal(oauth.options.redirectTo,"https://site.test/auth/callback");
  assert.equal(flow.readGoogleIntent(result.cookieValues.get(flow.GOOGLE_INTENT_COOKIE)).mode,"signin");
  const cookie=result.effects.find(e=>e.kind==="cookie");assert.equal(cookie.settings.httpOnly,true);assert.equal(cookie.settings.sameSite,"lax");
});
test("linking requires the current password, preserves identity and exposes no provider error",async()=>{
  for(const opts of [{},{passwordError:true}]) {
    const result=await invoke(init,{...opts,body:{mode:"link",...(opts.passwordError?{currentPassword:"bad"}:{})}});
    assert.ok(result.status>=400);assert.equal(result.effects.some(e=>e.kind==="link"),false);
  }
  const result=await invoke(init,{body:{mode:"link",currentPassword:"correct"}});
  assert.equal(result.status,200);assert.deepEqual(result.effects.slice(0,2).map(e=>e.kind),["password","link"]);
  assert.equal(flow.readGoogleIntent(result.cookieValues.get(flow.GOOGLE_INTENT_COOKIE)).userId,USER);
  const failed=await invoke(init,{signedOut:true,providerError:true,body:{mode:"signin"}});
  assert.equal(failed.status,503);assert.doesNotMatch(failed.body.error,/private detail/);
});
test("callback fails closed before exchange on missing/tampered/expired intent or provider denial",async()=>{
  for(const cookies of [{},{[flow.GOOGLE_INTENT_COOKIE]:"invalid"}]) {
    const result=await invoke(callback,{method:"GET",query:"?code=code",cookies});
    assert.equal(result.location,"https://site.test/login?google=error");assert.deepEqual(result.effects,[]);
  }
  const denied=await invoke(callback,{method:"GET",query:"?error=access_denied",cookies:{[flow.GOOGLE_INTENT_COOKIE]:flow.createGoogleIntent("signin",null)}});
  assert.deepEqual(denied.effects,[]);
});
test("new Google users must finish setup, while returning users use fixed destinations",async()=>{
  const cookies={[flow.GOOGLE_INTENT_COOKIE]:flow.createGoogleIntent("signin",null)};
  const fresh=await invoke(callback,{method:"GET",query:"?code=code&next=https://evil.test",cookies,metadata:{needs_username:true}});
  assert.equal(fresh.location,"https://site.test/auth/setup");assert.ok(fresh.effects.some(e=>e.kind==="refresh"));
  const returning=await invoke(callback,{method:"GET",query:"?code=code&next=//evil.test",cookies});
  assert.equal(returning.location,"https://site.test/dashboard");
  const noGoogle=await invoke(callback,{method:"GET",query:"?code=code",cookies,noGoogle:true});
  assert.equal(noGoogle.location,"https://site.test/login?google=error");
});
test("wrong Google identity can never mint a deletion proof or authorize linking",async()=>{
  for(const mode of ["link","verify-delete"]) {
    const result=await invoke(callback,{method:"GET",query:"?code=code",cookies:{[flow.GOOGLE_INTENT_COOKIE]:flow.createGoogleIntent(mode,USER)},userId:OTHER});
    assert.equal(result.location,"https://site.test/login?google=wrong-account");
    assert.ok(result.effects.some(e=>e.kind==="signout"));assert.equal(result.effects.some(e=>e.kind==="rpc"),false);
  }
});
test("Google deletion proof is minted only after a new same-account PKCE callback",async()=>{
  const result=await invoke(callback,{method:"GET",query:"?code=code",cookies:{[flow.GOOGLE_INTENT_COOKIE]:flow.createGoogleIntent("verify-delete",USER)}});
  assert.equal(result.location,"https://site.test/account?google=verified");
  const proof=result.effects.find(e=>e.kind==="rpc");
  assert.equal(proof.name,"issue_google_delete_verification");assert.equal(proof.value.p_user_id,USER);assert.equal(proof.value.p_session_id,SESSION);
  assert.equal(proof.value.p_token_hash,crypto.createHash("sha256").update(result.cookieValues.get(flow.GOOGLE_DELETE_COOKIE)).digest("hex"));
  const nonOauth=await invoke(callback,{method:"GET",query:"?code=code",noProviderToken:true,cookies:{[flow.GOOGLE_INTENT_COOKIE]:flow.createGoogleIntent("verify-delete",USER)}});
  assert.equal(nonOauth.effects.some(e=>e.kind==="rpc"),false);
});
test("setup requires literal legal agreement and ignores a forged target identity",async()=>{
  for(const acceptedLegal of [false,undefined,"true",1,{}]) {
    const result=await invoke(setup,{body:{username:"math_student",acceptedLegal},metadata:{needs_username:true}});
    assert.equal(result.status,400);assert.deepEqual(result.effects,[]);
  }
  assert.equal((await invoke(setup,{signedOut:true,body:{username:"math_student",acceptedLegal:true}})).status,401);
  assert.equal((await invoke(setup,{body:{username:"math_student",acceptedLegal:true}})).status,409);
  const result=await invoke(setup,{metadata:{needs_username:true},body:{username:" Math_Student ",acceptedLegal:true,userId:OTHER}});
  assert.equal(result.status,200);const rpc=result.effects.find(e=>e.kind==="rpc");
  assert.equal(rpc.value.p_user_id,USER);assert.equal(rpc.value.p_username,"math_student");assert.equal(rpc.value.p_legal_version,"2026-09-07");
});
test("name moderation and database conflicts remain useful and generic in setup/rename",async()=>{
  for(const [path,method,body] of [[setup,"POST",{username:"f_u_c_k",acceptedLegal:true}],[account,"PATCH",{action:"username",username:"b1tch"}]]) {
    const result=await invoke(path,{method,body,metadata:{needs_username:path===setup}});
    assert.equal(result.status,400);assert.equal(result.body.error,names.PUBLIC_NAME_ERROR);assert.deepEqual(result.effects,[]);
  }
  const collision=await invoke(setup,{metadata:{needs_username:true},body:{username:"taken_name",acceptedLegal:true},rpcError:{code:"23505",message:"private detail"}});
  assert.equal(collision.status,409);assert.equal(collision.effects.some(e=>e.kind==="refresh"),false);
});
test("Google-only accounts reject site-password operations and require a consumed delete proof",async()=>{
  const metadata={password_login_enabled:false};
  for(const action of ["password","email"]) assert.equal((await invoke(account,{method:"PATCH",metadata,body:{action,password:"new-password",currentPassword:"anything",email:"new@example.test"}})).status,400);
  const absent=await invoke(account,{method:"DELETE",metadata,body:{confirmation:"DELETE"}});assert.equal(absent.status,401);assert.deepEqual(absent.effects,[]);
  const opts={method:"DELETE",metadata,body:{confirmation:"DELETE",userId:OTHER},cookies:{[flow.GOOGLE_DELETE_COOKIE]:"a".repeat(64)}};
  const replay=await invoke(account,{...opts,proofDenied:true});assert.equal(replay.status,401);assert.equal(replay.effects.some(e=>e.kind==="delete"),false);
  const result=await invoke(account,opts);assert.equal(result.status,200);
  assert.deepEqual(result.effects.map(e=>e.kind),["rpc","delete","signout"]);
  assert.equal(result.effects[0].value.p_user_id,USER);assert.equal(result.effects[1].id,USER);
});

test("onboarding guard protects pages/APIs without an extra database read on completed accounts",async()=>{
  async function check(path,metadata,actualMetadata=metadata,refreshError=false) {
    let authoritativeReads=0;
    const response=(kind,value)=>({kind,value,cookies:{getAll:()=>[],set:()=>{}}});
    const proxy=await load("lib/supabase/proxy.ts",{
      "@supabase/ssr":{createServerClient:()=>({auth:{getClaims:async()=>({data:{claims:{app_metadata:metadata}}}),getUser:async()=>{authoritativeReads++;return {data:{user:{app_metadata:actualMetadata}}};},refreshSession:async()=>({error:refreshError?{}:null}),signOut:async()=>({error:null})}})},
      "next/server":{NextResponse:{next:()=>response("next"),json:(value)=>response("json",value),redirect:(value)=>response("redirect",value.href)}},
    });
    const result=await proxy.updateSession({nextUrl:{pathname:path},url:`https://site.test${path}`,cookies:{getAll:()=>[],set:()=>{}}});
    return {result,authoritativeReads};
  }
  for(const path of ["/dashboard","/multiplayer","/api/practice/attempt","/api/account"]) {
    const blocked=await check(path,{provider:"google",needs_username:true});
    assert.equal(blocked.result.kind,path.startsWith("/api/")?"json":"redirect");assert.equal(blocked.authoritativeReads,1);
  }
  for(const path of ["/auth/setup","/api/auth/setup","/auth/callback","/privacy","/terms"]) assert.equal((await check(path,{needs_username:true})).result.kind,"next");
  const complete=await check("/dashboard",{provider:"google",needs_username:false});
  assert.equal(complete.result.kind,"next");assert.equal(complete.authoritativeReads,0);
  const firstToken=await check("/dashboard",{provider:"google"},{needs_username:true});
  assert.equal(firstToken.result.kind,"redirect");assert.equal(firstToken.authoritativeReads,1);
  const completedWithStaleToken=await check("/dashboard",{provider:"google",needs_username:true},{needs_username:false});
  assert.equal(completedWithStaleToken.result.kind,"next");
  const failedRefresh=await check("/dashboard",{provider:"google",needs_username:true},{needs_username:false},true);
  assert.equal(failedRefresh.result.value,"https://site.test/login");
});
