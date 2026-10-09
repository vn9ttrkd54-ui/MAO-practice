// Actual moderation components; isolated mock transport, no real accounts.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join,resolve } from "node:path";
import { createServer } from "node:http";
import { chromium } from "@playwright/test";
const require=createRequire(import.meta.url),webpack=require("next/dist/compiled/webpack/webpack");
const root=resolve(import.meta.dirname,".."),dir=await mkdtemp(join(tmpdir(),"md-moderation-ui-"));
const fixture=name=>resolve(import.meta.dirname,"browserFixtures",name);
const compiler=webpack.webpack({mode:"development",entry:fixture("accountModeration.tsx"),output:{path:dir,filename:"client.js"},devtool:false,
  resolve:{extensions:[".tsx",".ts",".js"],alias:{"@":root}},
  module:{rules:[{test:/\.tsx?$/,exclude:/node_modules/,use:fixture("loader.cjs")} ]}});
await new Promise((resolve,reject)=>compiler.run((error,stats)=>error||stats.hasErrors()?reject(error??new Error(stats.toString())):compiler.close(resolve)));
const bundle=await readFile(join(dir,"client.js"));
const cssDir=join(root,".next/static/css"),css=(await Promise.all((await readdir(cssDir)).filter(n=>n.endsWith(".css")).map(n=>readFile(join(cssDir,n),"utf8")))).join("\n");
const server=createServer((req,res)=>{
  res.setHeader("Content-Type",req.url==="/client.js"?"text/javascript":"text/html");
  res.end(req.url==="/client.js"?bundle:req.url.startsWith("/admin/")?"<h1>Updated account</h1>":`<style>${css}</style><div id="root"></div><script src="/client.js"></script>`);
});
await new Promise((resolve,reject)=>{server.on("error",reject);server.listen(0,"127.0.0.1",resolve);});
let browser;
try {
  browser=await chromium.launch({headless:true});
  const url=`http://127.0.0.1:${server.address().port}`,target="00000000-0000-4000-8000-000000000002";
  for(const width of [1280,390]) for(const mode of ["admin","owner","protected","pending","suspended","google","rename"]) {
    const page=await browser.newPage({viewport:{width,height:1000}}),errors=[],requests=[];
    page.on("pageerror",e=>errors.push(e.message));
    let attempts=0;
    await page.route("**/*",async route=>{
      if(!route.request().url().startsWith(url)) return route.abort();
      if(!route.request().url().includes("/api/")) return route.continue();
      const body=route.request().postDataJSON();requests.push(body);
      if(route.request().url().endsWith("/api/auth/google")) return route.fulfill({status:503,json:{error:"Please retry verification."}});
      if(mode==="rename") {
        attempts++;
        return route.fulfill({status:attempts===1?409:200,json:attempts===1?{error:"That username is taken or reserved."}:{success:true,username:body.username,signInAgain:false}});
      }
      if(mode==="owner") return route.fulfill({status:409,json:{error:"This account changed. Refresh the page and review it again."}});
      return route.fulfill({status:200,json:{success:true}});
    });
    await page.goto(`${url}/?mode=${mode}`);
    await page.getByRole("heading",{level:1}).waitFor();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${mode} overflow at ${width}`);
    if(mode==="rename") {
      await page.getByLabel("New username").fill("alligatorraper");
      await page.getByRole("button",{name:"Save new username"}).click();
      await page.getByRole("alert").waitFor();assert.equal(requests.length,0);
      await page.getByLabel("New username").fill("ordinary_name");
      await page.getByRole("button",{name:"Save new username"}).click();
      await page.getByText("That username is taken or reserved.").waitFor();
      await page.getByLabel("New username").fill("new_allowed_name");
      await page.getByRole("button",{name:"Save new username"}).click();
      await page.getByRole("status").waitFor();
      assert.match(await page.getByRole("status").innerText(),/new_allowed_name.*Use this name next time.*password and progress/s);
      assert.equal(await page.getByRole("link",{name:"Continue",exact:true}).getAttribute("href"),"/dashboard");
    } else {
      assert.equal(await page.locator("script").count(),1,"audit text is escaped, not interpreted as markup");
      await page.getByText("Actor: Deleted moderator",{exact:true}).waitFor();
      if(mode==="protected") {assert.equal(await page.locator("form").count(),0);assert.equal(requests.length,0);}
      else {
        assert.equal(await page.locator('option[value="delete"]').count(),mode==="owner"?1:0);
        if(mode==="pending") assert.equal(await page.locator('option[value="require_name_change"]').count(),0);
        if(mode==="suspended") assert.equal(await page.getByLabel("Action",{exact:true}).inputValue(),"restore");
        if(mode==="google") {
          assert.equal(await page.locator('input[type="password"]').count(),0);
          await page.getByRole("button",{name:"Verify with Google"}).click();
          await page.getByRole("alert").waitFor();
          assert.deepEqual(requests[0],{mode:"verify-moderation",targetId:target});
        } else {
          if(mode==="owner") {
            await page.getByLabel("Action",{exact:true}).selectOption("delete");
            await page.getByText(/A limited private retry receipt expires after 24 hours/).waitFor();
            assert.equal(await page.getByText(/A private moderation audit is retained/).count(),0);
          }
          const action=await page.getByLabel("Action",{exact:true}).inputValue();
          const button=page.locator('button:not([type="button"])');
          assert.equal(await button.isDisabled(),true);
          await page.getByLabel("Reason (private audit record)").fill("Testing with an ordinary safe name");
          assert.equal(await page.getByLabel(/^Type /).count(),0);
          await button.click();
          assert.equal(requests.length,0,"password remains required without typed confirmation");
          await page.getByLabel("Your current password").fill("fixture-password");
          assert.equal(await button.isDisabled(),false);
          await page.screenshot({path:join(dir,`${mode}-${width}.png`),fullPage:true});
          await button.click();
          if(mode==="owner") {
            await page.getByRole("alert").waitFor();
            assert.equal(await page.getByLabel("Your current password").inputValue(),"");
            assert.match(await page.getByRole("alert").innerText(),/account changed/);
          } else await page.getByRole("heading",{name:"Updated account"}).waitFor();
          assert.equal(requests[0].version,7);assert.equal(requests[0].action,action);
          assert.equal(Object.hasOwn(requests[0],"confirmation"),false);
          assert.match(requests[0].requestId,/^[0-9a-f-]{36}$/);
          assert.equal(requests.length,1);
        }
      }
    }
    assert.deepEqual(errors,[]);
    if(["rename","protected","google"].includes(mode)) await page.screenshot({path:join(dir,`${mode}-${width}.png`),fullPage:true});
    await page.close();
  }
  console.log(`PASS: ordinary-name flagging, admin/owner/protected controls, suspend/restore states, Google verification, escaped audit, required rename and collision recovery at desktop/mobile. Screenshots: ${dir}`);
} finally { if(browser) await browser.close();await new Promise(resolve=>server.close(resolve)); }
