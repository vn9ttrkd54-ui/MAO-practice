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
  resolve:{extensions:[".tsx",".ts",".js"],alias:{"next/navigation":fixture("router.ts"),"next/link":fixture("link.tsx"),"next/image":fixture("googleImage.tsx"),"@":root}},
  module:{rules:[{test:/\.tsx?$/,exclude:/node_modules/,use:fixture("loader.cjs")},{test:/\.css$/,use:fixture("css.cjs")} ]}});
await new Promise((resolve,reject)=>compiler.run((error,stats)=>error||stats.hasErrors()?reject(error??new Error(stats.toString())):compiler.close(resolve)));
const bundle=await readFile(join(dir,"client.js"));
const googleIcon=await readFile(join(root,"public/google-g.png"));
const cssDir=join(root,".next/static/css"),css=(await Promise.all((await readdir(cssDir)).filter(n=>n.endsWith(".css")).map(n=>readFile(join(cssDir,n),"utf8")))).join("\n");
const server=createServer((req,res)=>{
  if(req.url==="/google-g.png") {
    res.setHeader("Content-Type","image/png");
    res.end(googleIcon);
    return;
  }
  if(req.url==="/dashboard") {
    res.setHeader("Content-Type","text/html");
    res.setHeader("Cache-Control","no-store");
    const completed=req.headers.cookie?.split("; ").includes("google-setup-complete=1");
    res.end(`<h1>${completed?"Your dashboard":"Setup is required"}</h1>`);
    return;
  }
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
      const page=await browser.newPage({viewport:{width,height:1000}}),errors=[],requests=[],dashboardNavigations=[];
      let setupAttempts=0,finishGoogleRequest;
      const googleResponseReady=new Promise(resolve=>{finishGoogleRequest=resolve;});
      page.on("pageerror",e=>errors.push(e.message));
      page.on("request",request=>{
        if(request.isNavigationRequest()&&request.url()===`${url}/dashboard`) dashboardNavigations.push(request.url());
      });
      await page.route("**/*",async route=>{
        if(!route.request().url().startsWith(url)) return route.abort();
        if(!route.request().url().includes("/api/")) return route.continue();
        requests.push(route.request().postDataJSON());
        if(route.request().url().endsWith("/api/auth/setup")) {
          setupAttempts++;
          if(setupAttempts===1) return route.fulfill({status:409,json:{error:"That username is already taken."}});
          return route.fulfill({status:200,headers:{"Set-Cookie":"google-setup-complete=1; Path=/; SameSite=Lax"},json:{success:true}});
        }
        if(route.request().url().endsWith("/google")) await googleResponseReady;
        return route.fulfill({status:route.request().url().endsWith("/google")?503:200,json:route.request().url().endsWith("/google")?{error:"Google sign-in is not available right now."}:{success:true}});
      });
      await page.goto(`${url}/?mode=${mode}`);
      await page.getByRole("heading",{level:1}).waitFor();
      const googleButton=page.getByRole("button",{name:/^(Continue with Google|Connect Google|Verify with Google)$/});
      if(await googleButton.count()) {
        const icon=googleButton.locator("img");
        await icon.evaluate(img=>img.decode());
        assert.equal(await icon.getAttribute("alt"),"");
        const iconSize=await icon.boundingBox();
        assert.equal(iconSize.width,20);assert.equal(iconSize.height,20);
        await page.screenshot({path:join(dir,`${mode}-ready-${width}.png`),fullPage:true});
      }
      async function clickGoogleButton() {
        const before=await googleButton.boundingBox();
        await googleButton.click();
        const opening=page.getByRole("button",{name:"Opening Google..."});
        await opening.waitFor();
        assert.equal(await opening.isDisabled(),true);
        assert.equal(await opening.getAttribute("aria-busy"),"true");
        const during=await opening.boundingBox();
        assert.equal(during.width,before.width);assert.equal(during.height,before.height);
        assert.equal(await opening.locator("img").isVisible(),true);
        finishGoogleRequest();
        await page.getByRole("alert").waitFor();
        assert.equal(await googleButton.isEnabled(),true);
        assert.equal(await googleButton.getAttribute("aria-busy"),"false");
      }
      if(mode==="login"||mode==="signup") {
        // Empty username/password fields must not stop the Google button.
        await googleButton.focus();
        assert.equal(await googleButton.evaluate(el=>el===document.activeElement),true);
        await clickGoogleButton();
        assert.equal(requests[0].mode,"signin");
      }
      if(mode==="setup") {
        await page.getByLabel("Public username").fill("f_u_c_k");
        await page.getByRole("checkbox").check();
        await page.getByRole("button",{name:"Finish setup"}).click();
        await page.getByRole("alert").waitFor();assert.equal(requests.length,0);
        await page.getByLabel("Public username").fill("math_student");
        await page.getByRole("button",{name:"Finish setup"}).click();
        await page.getByRole("alert").waitFor();
        assert.equal(await page.getByRole("alert").innerText(),"That username is already taken.");
        assert.equal(page.url(),`${url}/?mode=setup`);
        assert.equal(await page.getByRole("button",{name:"Finish setup"}).isEnabled(),true);
        assert.equal(dashboardNavigations.length,0);
        await page.screenshot({path:join(dir,`setup-${width}.png`),fullPage:true});
        await page.getByLabel("Public username").fill("available_student");
        await page.getByRole("button",{name:"Finish setup"}).click();
        await page.waitForURL(`${url}/dashboard`,{timeout:5000});
        await page.getByRole("heading",{name:"Your dashboard"}).waitFor();
        assert.deepEqual(requests[0],{username:"math_student",acceptedLegal:true});
        assert.deepEqual(requests[1],{username:"available_student",acceptedLegal:true});
        assert.equal(dashboardNavigations.length,1,"Setup must use one fresh document request with the saved cookies");
      }
      if(mode==="account-password") {
        assert.equal(await page.getByRole("button",{name:"Connect Google"}).isDisabled(),true);
        await page.locator("#link-password").fill("current password");
        await clickGoogleButton();
        assert.deepEqual(requests[0],{mode:"link",currentPassword:"current password"});
        assert.equal(await page.getByRole("button",{name:"Change password"}).count(),1);
      }
      if(mode==="account-google"||mode==="account-verified") {
        assert.equal(await page.getByRole("button",{name:"Change password"}).count(),0);
        assert.equal(await page.locator('input[type="password"]').count(),0);
        await page.getByLabel("Type DELETE to confirm").fill("DELETE");
        assert.equal(await page.getByRole("button",{name:"Permanently delete account"}).isDisabled(),mode!=="account-verified");
        await clickGoogleButton();
        assert.equal(requests[0].mode,"verify-delete");
      }
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${mode} overflows at ${width}`);
      for(const button of await page.getByRole("button").all()) assert.equal(await button.evaluate(el=>el.scrollWidth>el.clientWidth),false);
      assert.deepEqual(errors,[]);
      await page.screenshot({path:join(dir,`${mode==="setup"?"setup-complete":mode}-${width}.png`),fullPage:true});
      await page.close();
    }
    const failedSetup=await browser.newPage({viewport:{width,height:1000}});
    const setupUrl=`${url}/?mode=setup`;
    let failedRequests=0;
    await failedSetup.route("**/api/auth/setup",route=>{
      failedRequests++;
      return route.fulfill({status:503,json:{error:"Your username was saved. Sign in again to continue."}});
    });
    await failedSetup.goto(setupUrl);
    await failedSetup.getByLabel("Public username").fill("math_student");
    await failedSetup.getByRole("checkbox").check();
    await failedSetup.getByRole("button",{name:"Finish setup"}).click();
    await failedSetup.getByRole("alert").waitFor();
    assert.equal(await failedSetup.getByRole("alert").innerText(),"Your username was saved. Sign in again to continue.");
    assert.equal(failedSetup.url(),setupUrl,"A failed session refresh must not open the dashboard");
    assert.equal(await failedSetup.getByRole("button",{name:"Finish setup"}).isEnabled(),true);
    assert.equal(failedRequests,1);
    await failedSetup.close();
  }
  console.log(`PASS: six auth/account states, official Google icon, stable loading buttons, Google button actions, profanity blocking, legal setup, cookie-aware full-page setup completion, failed setup recovery and no overflow at desktop/mobile. Screenshots: ${dir}`);
} finally { if(browser) await browser.close();await new Promise(resolve=>server.close(resolve)); }
