// Actual components with mocked APIs and no provider or database writes.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join,resolve } from "node:path";
import { createServer } from "node:http";
import { chromium } from "@playwright/test";

const require=createRequire(import.meta.url),webpack=require("next/dist/compiled/webpack/webpack");
const root=resolve(import.meta.dirname,".."),dir=await mkdtemp(join(tmpdir(),"md-google-ui-"));
const fixture=name=>resolve(import.meta.dirname,"browserFixtures",name);
const compiler=webpack.webpack({mode:"development",entry:fixture("googleAuth.tsx"),output:{path:dir,filename:"client.js"},devtool:false,
  resolve:{extensions:[".tsx",".ts",".js"],alias:{"next/navigation":fixture("router.ts"),"next/link":fixture("link.tsx"),"@":root}},
  module:{rules:[{test:/\.tsx?$/,exclude:/node_modules/,use:fixture("loader.cjs")},{test:/\.css$/,use:fixture("css.cjs")} ]}});
await new Promise((resolve,reject)=>compiler.run((error,stats)=>error||stats.hasErrors()?reject(error??new Error(stats.toString())):compiler.close(resolve)));
const bundle=await readFile(join(dir,"client.js"));
const cssDir=join(root,".next/static/css"),css=(await Promise.all((await readdir(cssDir)).filter(n=>n.endsWith(".css")).map(n=>readFile(join(cssDir,n),"utf8")))).join("\n");
const server=createServer((req,res)=>{
  res.setHeader("Content-Type",req.url==="/client.js"?"text/javascript":"text/html");
  res.end(req.url==="/client.js"?bundle:`<style>${css}</style><div id="root"></div><script src="/client.js"></script>`);
});
await new Promise((resolve,reject)=>{server.on("error",reject);server.listen(0,"127.0.0.1",resolve);});
let browser;
try {
  browser=await chromium.launch({headless:true});
  const url=`http://127.0.0.1:${server.address().port}`;
  for(const width of [1280,390]) {
    for(const mode of ["login","signup","setup","account-password","account-google","account-verified"]) {
      const page=await browser.newPage({viewport:{width,height:1000}}),errors=[],requests=[];
      page.on("pageerror",e=>errors.push(e.message));
      await page.route("**/*",route=>{
        if(!route.request().url().startsWith(url)) return route.abort();
        if(!route.request().url().includes("/api/")) return route.continue();
        requests.push(route.request().postDataJSON());
        return route.fulfill({status:route.request().url().endsWith("/google")?503:200,json:route.request().url().endsWith("/google")?{error:"Google sign-in is not available right now."}:{success:true}});
      });
      await page.goto(`${url}/?mode=${mode}`);
      await page.getByRole("heading",{level:1}).waitFor();
      if(mode==="login"||mode==="signup") {
        // Empty username/password fields must not stop the Google button.
        await page.getByRole("button",{name:"Continue with Google"}).click();
        await page.getByRole("alert").waitFor();
        assert.equal(requests[0].mode,"signin");
      }
      if(mode==="setup") {
        await page.getByLabel("Public username").fill("f_u_c_k");
        await page.getByRole("checkbox").check();
        await page.getByRole("button",{name:"Finish setup"}).click();
        await page.getByRole("alert").waitFor();assert.equal(requests.length,0);
        await page.getByLabel("Public username").fill("math_student");
        await page.getByRole("button",{name:"Finish setup"}).click();
        await page.waitForFunction(()=>document.body.dataset.destination==="/dashboard");
        assert.deepEqual(requests[0],{username:"math_student",acceptedLegal:true});
      }
      if(mode==="account-password") {
        assert.equal(await page.getByRole("button",{name:"Connect Google"}).isDisabled(),true);
        await page.locator("#link-password").fill("current password");
        await page.getByRole("button",{name:"Connect Google"}).click();
        await page.getByRole("alert").waitFor();
        assert.deepEqual(requests[0],{mode:"link",currentPassword:"current password"});
        assert.equal(await page.getByRole("button",{name:"Change password"}).count(),1);
      }
      if(mode==="account-google"||mode==="account-verified") {
        assert.equal(await page.getByRole("button",{name:"Change password"}).count(),0);
        assert.equal(await page.locator('input[type="password"]').count(),0);
        await page.getByLabel("Type DELETE to confirm").fill("DELETE");
        assert.equal(await page.getByRole("button",{name:"Permanently delete account"}).isDisabled(),mode!=="account-verified");
      }
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${mode} overflows at ${width}`);
      for(const button of await page.getByRole("button").all()) assert.equal(await button.evaluate(el=>el.scrollWidth>el.clientWidth),false);
      assert.deepEqual(errors,[]);
      await page.screenshot({path:join(dir,`${mode}-${width}.png`),fullPage:true});
      await page.close();
    }
  }
  console.log(`PASS: six auth/account states, Google button actions, profanity blocking, legal setup and no overflow at desktop/mobile. Screenshots: ${dir}`);
} finally { if(browser) await browser.close();await new Promise(resolve=>server.close(resolve)); }
