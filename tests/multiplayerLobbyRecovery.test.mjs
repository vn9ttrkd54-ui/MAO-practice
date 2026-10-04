import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";
const require=createRequire(import.meta.url);
const userId="11111111-1111-4111-8111-111111111111",roomId="22222222-2222-4222-8222-222222222222";
function compile(file,dependencies) {
  const exports={};
  vm.runInNewContext(ts.transpileModule(readFileSync(new URL(file,import.meta.url),"utf8"),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},
  }).outputText,{exports,require:name=>name in dependencies?dependencies[name]:require(name)});
  return exports;
}
function service({signedIn=true,rpcData="closed",rpcError=null,readError=false}={}) {
  const calls=[],rooms=[
    {id:"private-disconnected",visibility:"private",status:"waiting",connected:false,is_host:true},
    {id:"private-stale",visibility:"private",status:"countdown",connected:true,is_host:false},
    {id:"public-disconnected",visibility:"public",status:"waiting",connected:false,is_host:true},
    {id:"public-stale",visibility:"public",status:"waiting",connected:true,is_host:false},
    {id:"active-game",visibility:"private",status:"in-progress",connected:false,is_host:true},
  ].map(r=>({...r,created_at:new Date().toISOString(),started_at:r.status==="in-progress"?new Date().toISOString():null,
    question_count:5,seconds_per_question:90,current_question_number:0,division:"Mu",mode:"unranked",state_version:1}));
  const admin={
    from(table){let columns="";const filters=[];
      const q={select(value){columns=value;return q;},eq(k,v){filters.push([k,v]);return q;},is(k,v){filters.push([k,v]);return q;},in(){return q;},order(){return q;},
        then(resolve,reject){calls.push({table,columns,filters});
          const data=table==="multiplayer_rooms"?rooms:columns==="id"?[]:rooms.map(r=>({room_id:r.id,is_host:r.is_host,connected:r.connected,updated_at:"2020-01-01T00:00:00Z"}));
          return Promise.resolve({data,count:2,error:readError?{message:"offline"}:null}).then(resolve,reject);
        }};return q;
    },
    async rpc(name,args){calls.push({name,args});return {data:rpcData,error:rpcError};},
  };
  const api=compile("../lib/services/multiplayerService.ts",{
    "server-only":{},"@/lib/auth/publicNames":{},"next/headers":{},"@/data/questions":{questions:[]},
    "@/lib/security/request":{RequestBodyError:class extends Error{constructor(message,status){super(message);this.status=status;}}},
    "@/lib/supabase/admin":{createAdminClient:()=>admin},
    "@/lib/supabase/server":{createClient:async()=>({auth:{getUser:async()=>({data:{user:signedIn?{id:userId}:null}})}})},
  });
  return {api,calls};
}
test("disconnected/stale private memberships stay visible, public presence filtering stays intact",async()=>{
  const f=service(),rooms=await f.api.listMyActiveMultiplayerRooms();
  assert.deepEqual(Array.from(rooms,r=>r.id),["private-disconnected","private-stale","active-game"]);
  assert.equal(rooms[0].isHost,true);assert.equal(rooms[1].isHost,false);
  assert.deepEqual(f.calls[0].filters,[["user_id",userId],["left_at",null]]);
});
test("anonymous directories never read account memberships and failures never look like no rooms",async()=>{
  const anon=service({signedIn:false});assert.equal((await anon.api.listMyActiveMultiplayerRooms()).length,0);assert.equal(anon.calls.length,0);
  await assert.rejects(service({readError:true}).api.listMyActiveMultiplayerRooms(),/Unable to load active games/);
});
test("directory close derives identity from the session and validates the target",async()=>{
  const f=service();assert.equal(await f.api.closeOwnedPrivateLobby(roomId),"closed");
  assert.equal(f.calls[0].name,"close_owned_private_multiplayer_lobby");
  assert.equal(f.calls[0].args.p_user_id,userId);assert.equal(f.calls[0].args.p_room_id,roomId);
  const bad=service();await assert.rejects(bad.api.closeOwnedPrivateLobby("not-a-room"),/Invalid room/);assert.equal(bad.calls.length,0);
  const anon=service({signedIn:false});await assert.rejects(anon.api.closeOwnedPrivateLobby(roomId),/Sign in/);assert.equal(anon.calls.length,0);
});
test("close preserves started response and fails loudly on denied, ambiguous or failed writes",async()=>{
  assert.equal(await service({rpcData:"started"}).api.closeOwnedPrivateLobby(roomId),"started");
  await assert.rejects(service({rpcError:{code:"P0001",message:"Only the host"}}).api.closeOwnedPrivateLobby(roomId),/Only the host/);
  for(const options of [{rpcData:null},{rpcData:"unknown"},{rpcError:{code:"XX000"}}])
    await assert.rejects(service(options).api.closeOwnedPrivateLobby(roomId),/not confirmed/);
});
function actions({status="closed",fail=false}={}) {
  const calls=[];
  const api=compile("../app/multiplayer/actions.ts",{
    "next/navigation":{redirect:url=>{calls.push(["redirect",url]);throw new Error(`REDIRECT ${url}`);}},
    "next/cache":{revalidatePath:path=>calls.push(["refresh",path])},
    "@/lib/services/multiplayerService":{
      closeOwnedPrivateLobby:async id=>{calls.push(["close",id]);if(fail)throw new Error("Close not confirmed");return status;},
      createPrivateRoom:async()=>({id:roomId}),
    },
  });return {api,calls};
}
test("close action requires explicit confirmation, invalidates both pages, and redirects after success",async()=>{
  const f=actions(),form=new FormData();form.set("roomId",roomId);form.set("userId","attacker");
  await assert.rejects(f.api.closePrivateLobbyAction(form),/REDIRECT/);assert.equal(f.calls.some(c=>c[0]==="close"),false);
  f.calls.length=0;form.set("confirmation","close");
  await assert.rejects(f.api.closePrivateLobbyAction(form),/REDIRECT/);
  assert.deepEqual(f.calls,[["close",roomId],["refresh","/multiplayer"],["refresh","/multiplayer/create"],["redirect",`/multiplayer?closed=${roomId}`]]);
});
test("close action never claims success after a start race or network/database failure",async()=>{
  for(const options of [{status:"started"},{fail:true}]) {
    const f=actions(options),form=new FormData();form.set("roomId",roomId);form.set("confirmation","close");
    await assert.rejects(f.api.closePrivateLobbyAction(form),/REDIRECT/);
    assert.ok(f.calls.at(-1)[1].startsWith("/multiplayer?error="));
    assert.equal(f.calls.some(c=>c[0]==="refresh"),false);
  }
});
test("creating a room invalidates cached directory and create page before navigation",async()=>{
  const f=actions();await assert.rejects(f.api.createPrivateRoomAction(new FormData()),/REDIRECT/);
  assert.deepEqual(f.calls,[["refresh","/multiplayer"],["refresh","/multiplayer/create"],["redirect",`/multiplayer/room/${roomId}`]]);
});
