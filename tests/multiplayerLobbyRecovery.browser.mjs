// Actual recovery component + generated CSS; mock action, no hosted database.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { chromium, expect } from "@playwright/test";
const require=createRequire(import.meta.url);
const dir=await mkdtemp(join(tmpdir(),"multiplayer-recovery-"));
const root=resolve(import.meta.dirname,"..");
const fixture=name=>resolve(import.meta.dirname,"browserFixtures",name);
const compiler=require("next/dist/compiled/webpack/webpack").webpack({mode:"development",entry:fixture("lobbyRecovery.tsx"),
  output:{path:dir,filename:"client.js"},devtool:false,
  resolve:{extensions:[".tsx",".ts",".js"],alias:{"next/link":fixture("link.tsx"),
    "@/app/multiplayer/actions":fixture("lobbyRecoveryActions.ts"),"@":root}},
  module:{rules:[{test:/\.tsx?$/,exclude:/node_modules/,use:fixture("loader.cjs")}]} });
await new Promise((resolve,reject)=>compiler.run((error,stats)=>error||stats.hasErrors()
  ?reject(error??new Error(stats.toString())):compiler.close(resolve)));
const bundle=await readFile(join(dir,"client.js"));
const cssRoot=join(root,".next/static");
const css=(await Promise.all((await readdir(cssRoot,{recursive:true})).filter(f=>f.endsWith(".css")).map(f=>readFile(join(cssRoot,f),"utf8")))).join("\n");
const server=createServer((req,res)=>{
  const script=req.url==="/client.js";res.setHeader("Content-Type",script?"text/javascript":"text/html");
  res.end(script?bundle:`<meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style><div id="root"></div><script src="/client.js"></script>`);
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
let browser;
try {
  browser=await chromium.launch({headless:true});const errors=[];
  const base={id:"host-room",code:"ABCD2345",visibility:"private",status:"waiting",isHost:true,
    settings:{division:"Mu",questionCount:5,secondsPerQuestion:90,mode:"unranked",difficultyBand:"2-4"}};
  const rooms=[base,{...base,id:"member-room",code:"EFGH6789",isHost:false,status:"countdown"},
    {...base,id:"running-room",code:"RUNNING1",status:"in-progress"},
    {...base,id:"closed-room",code:"CLOSED01",status:"cancelled"},
    {...base,id:"public-room",code:null,visibility:"public"}];
  for(const width of [1280,390]) {
    const page=await browser.newPage({viewport:{width,height:900}});page.on("pageerror",e=>errors.push(e.message));
    await page.addInitScript(rooms=>{window.recoveryRooms=rooms;window.closeCalls=[];},rooms);
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    const host=page.getByRole("article").filter({hasText:"ABCD2345"});
    await expect(page.getByRole("article")).toHaveCount(2);
    await expect(page.getByText("Going back does not close a room.", { exact: false })).toHaveCount(0);
    await expect(host.getByRole("link",{name:"Return to Room"})).toHaveAttribute("href","/multiplayer/room/host-room");
    await expect(page.getByRole("button",{name:"Close Room",exact:true})).toHaveCount(1);
    await host.getByRole("button",{name:"Close Room",exact:true}).click();
    await expect(page.getByRole("group",{name:"Confirm closing ABCD2345"})).toBeVisible();
    assert.deepEqual(await page.evaluate(()=>window.closeCalls),[]);
    await host.getByRole("button",{name:"Keep Room"}).click();
    await expect(page.getByRole("group")).toHaveCount(0);
    assert.deepEqual(await page.evaluate(()=>window.closeCalls),[]);
    await page.screenshot({path:join(dir,`recovery-${width}.png`),fullPage:true});
    await host.getByRole("button",{name:"Close Room",exact:true}).click();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.screenshot({path:join(dir,`confirm-${width}.png`),fullPage:true});
    await host.getByRole("button",{name:"Confirm Close Room"}).click();
    await expect(host.getByRole("button",{name:"Closing room…"})).toBeDisabled();
    await expect(page.getByRole("status")).toBeVisible();
    assert.deepEqual(await page.evaluate(()=>window.closeCalls),[{roomId:"host-room",confirmation:"close"}]);
    await page.evaluate(()=>window.finishClose());
    await expect(page.getByRole("status")).toHaveCount(0);await page.close();
  }
  const empty=await browser.newPage();await empty.addInitScript(()=>{window.recoveryRooms=[];});
  await empty.goto(`http://127.0.0.1:${server.address().port}/`);
  await expect(empty.getByRole("heading",{name:"Multiplayer",exact:true})).toBeVisible();
  await expect(empty.getByRole("region",{name:"Your unfinished private rooms"})).toHaveCount(0);await empty.close();
  assert.deepEqual(errors,[]);
  console.log("PASS private room recovery, host-only Close, explicit confirmation/cancel, pending guard and mobile layout. Mock action; hosted Back navigation still requires smoke test.");
  console.log(`Screenshots: ${dir}`);
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
