import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {createRequire} from "node:module";
import {runInNewContext} from "node:vm";
import test from "node:test";
import ts from "typescript";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import katex from "katex";
import {muQuestions} from "../data/questions/mu.ts";
import {alphaQuestions} from "../data/questions/alpha.ts";
import {thetaQuestions} from "../data/questions/theta.ts";
import {muNationalReferences} from "../data/question-references/muNationals.ts";

const batch=muQuestions.filter(q=>q.source?.competition==="2025 March Regional");
const get=n=>batch.find(q=>q.source.questionNumber===n);
const near=(a,b,tolerance=1e-8)=>assert.ok(Math.abs(a-b)<tolerance,a+" vs "+b);
const derivative=(f,x,h=1e-6)=>(f(x+h)-f(x-h))/(2*h);
const simpson=(f,a,b,n=40000)=>{
  const h=(b-a)/n;let sum=f(a)+f(b);
  for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+i*h);
  return sum*h/3;
};
const vector=name=>readFileSync(new URL("../public/questions/"+name,import.meta.url),"utf8");

test("March excludes the documented throw-out while retaining all 29 other source answers and original credits",()=>{
  assert.equal(batch.length,29);
  assert.equal(get(2),undefined);
  assert.equal(muQuestions.some(q=>q.id===10476),false);
  const key=["DCCBB","DECBB","AAACC","BABAC","AEBDC","CDBBD"].join("");
  for(const [i,q] of batch.entries()){
    const original=i===0?1:i+2;
    assert.equal(q.id,10474+original);
    assert.equal(q.number,353+i);
    assert.deepEqual(q.source,{competition:"2025 March Regional",event:"Calculus Individual",questionNumber:original});
    assert.equal(q.answer,key[original-1]);
    assert.equal(q.choices.length,5);assert.equal(q.choices[4],"NOTA");
  }
  assert.equal(get(13).choices[1],String.raw`\(c-2b\)`);
  assert.deepEqual(muQuestions.map(q=>q.number),Array.from({length:muQuestions.length},(_,i)=>i+1));
  assert.equal(new Set(muQuestions.map(q=>q.id)).size,muQuestions.length);
});

test("all 352 previously approved records remain byte-for-byte equivalent as structured records",()=>{
  const old=muQuestions.filter(q=>q.id<10475);
  assert.equal(old.length,352);
  assert.equal(createHash("sha256").update(JSON.stringify(old)).digest("hex"),"8e5e94c519bc6fc7059407de56d8fa3ac1f9c0c34e19836f5ca24d8d7694fdda");
});

test("topics and methods reuse established labels and calibrated difficulty ratings",()=>{
  const benchmarks=[...muQuestions.filter(q=>q.id<10475),...alphaQuestions,...thetaQuestions,...muNationalReferences];
  const topics=new Set(benchmarks.map(q=>q.topic)),methods=new Set(benchmarks.flatMap(q=>q.methods));
  for(const q of batch){
    assert.ok(topics.has(q.topic),q.topic);
    for(const method of q.methods)assert.ok(methods.has(method),method);
  }
  assert.deepEqual(batch.map(q=>q.difficulty),[1,1,1,1,2,1,1,1,1,1,1,3,2,3,2,3,2,2,1,2,3,4,3,4,3,2,4,3,3]);
  assert.deepEqual(batch.filter(q=>q.methods.includes("Integral Properties")).map(q=>q.source.questionNumber),[7]);
  assert.deepEqual(get(24).methods,["U-Substitution"]);
  assert.ok(batch.some(q=>q.methods.length===0));
});

test("every new mathematical expression compiles strictly and all exceptions are documented in the solutions",()=>{
  for(const q of batch)for(const text of [q.question,...q.choices,q.solution]){
    for(const m of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)){
      assert.doesNotThrow(()=>katex.renderToString(m[1]??m[2],{throwOnError:true,displayMode:m[2]!==undefined}),"source "+q.source.questionNumber);
    }
    assert.doesNotMatch(text.replace(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g,""),/\\[()[\]]/);
  }
  assert.match(get(19).solution,/correct exponent/);
  assert.match(get(22).solution,/omits a prime/);
  assert.match(get(23).question,/converges locally uniformly/);
  assert.match(get(28).question,/top and right edges/);
  assert.match(get(29).solution,/correct boundary term/);
  assert.ok(get(30).solution.includes(String.raw`u=4x`));
});

test("SVG table and fold drawings preserve values, source configuration, dimensions and reveal-only annotations",()=>{
  assert.equal(get(9).illustration.src,"/questions/mu-483-table.svg");
  assert.equal(get(28).illustration.src,"/questions/mu-502-fold.svg");
  const cells=[...vector("mu-483-table.svg").matchAll(/<text\b[^>]*>([^<]+)<\/text>/g)].map(m=>m[1]);
  assert.deepEqual(cells,["x","2","4","6","7","11","f(x)","0.7","1.1","1.9","2.5","5.3"]);
  for(const [name,w,h] of [["mu-483-table.svg",600,112],["mu-502-fold.svg",560,400],["mu-502-solution.svg",620,440]]){
    const svg=vector(name);
    assert.match(svg,new RegExp('viewBox="0 0 '+w+' '+h+'"'));
    assert.doesNotMatch(svg,/<image\b|data:|<script\b/);
  }
  assert.doesNotMatch(get(28).question,/solution-diagram/);
  assert.match(get(28).solution,/\[\[solution-diagram:mu-502\]\]/);
  const require=createRequire(import.meta.url),exports={};
  runInNewContext(ts.transpileModule(readFileSync(new URL("../components/math/MathText.tsx",import.meta.url),"utf8"),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true},
  }).outputText,{exports,require});
  const html=renderToStaticMarkup(React.createElement(exports.default,null,get(28).solution));
  assert.match(html,/\/questions\/mu-502-solution\.svg/);
  assert.doesNotMatch(html,/\[\[solution-diagram/);
});

test("power derivatives, factoring, secant slopes, quotient rule and composed differential equation check source 1 and 3-6",()=>{
  near(80*(-1)**3,-80);
  for(const x of [1.99999,2.00001])near((x*x+x+1)/(x*x+3*x+2),7/12,2e-6);
  near(((1+2*Math.sin(Math.PI/2))-(1+2*Math.sin(0)))/(Math.PI/2),4/Math.PI);
  near(derivative(x=>(3*x*x-2)/(4*x+1),-1),14/9);
  const rhs=(x,y)=>(x*y*y+4*y)**2/5;
  near(rhs(-1,5),5);
  near(derivative(x=>rhs(x,5+5*(x+1)),-1),10,1e-7);
});

test("elementary linearity, acceleration, unequal-width left sums and definite-integral recognition check sources 7-10",()=>{
  near(2*7-(-9),23);
  // A position with this acceleration exists without specifying initial position or velocity.
  const position=t=>9*t**(7/3)/28;
  const h=.0001,t=2;
  near((position(t+h)-2*position(t)+position(t-h))/(h*h),Math.cbrt(t),1e-6);
  const x=[2,4,6,7,11],y=[.7,1.1,1.9,2.5,5.3];
  let left=0,trapezoid=0;
  for(let i=0;i<4;i++){
    left+=(x[i+1]-x[i])*y[i];
    trapezoid+=(x[i+1]-x[i])*(y[i]+y[i+1])/2;
  }
  near(left,15.5);assert.ok(left<trapezoid);
  const f=x=>Math.sin(x)**2+3;
  const exact=14-(Math.sin(10)-Math.sin(2))/4;
  near(simpson(f,1,5),exact);
  let sum=0;const n=100000;
  for(let k=1;k<=n;k++)sum+=f(1+4*k/n)*4/n;
  near(sum,exact,5e-5);
});

test("root limit, inverse-variable derivatives and parametric cubic extrema check sources 11-13",()=>{
  for(const x of [-1e-8,1e-8])near(Math.expm1(Math.log1p(24*x)/20)/x,6/5,2e-7);
  near(Math.exp(Math.log(2024)),2024);
  for(const [b,c] of [[-2,3],[0,2],[1,1.5],[3,8]]){
    const r=b,s=(b+2*c)/3,t=(2*b+c)/3;
    const df=x=>(x-b)*(3*x-b-2*c);
    near(df(r),0);near(df(s),0);near(6*t-4*b-2*c,0);near(r+s+t,2*b+c);
    assert.ok(df(b-.001)>0&&df((r+s)/2)<0&&df(s+.001)>0);
  }
});

test("cone rate and tangent-intercept triangle have the claimed global values",()=>{
  const R=3,h=8/Math.PI,dh=R*Math.PI/16;
  near(Math.PI*h*h*dh/4,R);
  const A=a=>(a+1)**2*Math.exp(-a)/2,maximum=2/Math.E;
  near(A(1),maximum);
  for(let a=0;a<=30;a+=.01)assert.ok(A(a)<=maximum+1e-9);
  near(derivative(A,1),0);
});

test("separated IVP, bisected parabolic area and integrated velocity check sources 16-18",()=>{
  const y=x=>-2/(x*x+1);
  near(y(2),-2/5);near(y(3),-1/5);
  for(const x of [0,1,2,3])near(derivative(y,x),x*y(x)**2);
  const k=4-2*Math.cbrt(4);
  assert.ok(k>0&&k<4);
  near(simpson(x=>4*x-x*x,0,4),32/3);
  near(simpson(x=>4*x-x*x-k*x,0,4-k),16/3);
  near(4+simpson(t=>6*t*Math.sin(t*t),0,3*Math.sqrt(Math.PI)),10);
});

test("higher derivatives, arctangent limits, inverse tangent and three-factor second derivative check sources 19-22",()=>{
  let factorial=1;
  for(let n=0;n<=8;n++){
    if(n>0)factorial*=n;
    const f=x=>(-1)**n*2**n*factorial/(1+2*x)**(n+1);
    const next=x=>(-1)**(n+1)*2**(n+1)*factorial*(n+1)/(1+2*x)**(n+2);
    near(derivative(f,.3),next(.3),Math.max(1,Math.abs(next(.3)))*1e-7);
  }
  const f=x=>4*Math.atan(x**3)/Math.PI+4;
  for(const x of [.2,3,10000])near(f(x)+f(-x),8);
  const u=3*Math.PI/2,fx=Math.sin(u)+2*u,df=Math.cos(u)+2;
  near(fx,3*Math.PI-1);near(df,2);near(fx-u*df,-1);
  const multiply=(a,b)=>{
    const c=Array(a.length+b.length-1).fill(0);
    a.forEach((v,i)=>b.forEach((w,j)=>c[i+j]+=v*w));return c;
  };
  const polynomial=multiply(multiply([1,4,-12],[3,10,16]),[1,-2,8]);
  near(2*polynomial[2],0);
  near(4*(-6*3+8+4*3)+8*(2*5-2*3-5),0);
});

test("the infinite derivative solution satisfies both the original convergent series and its initial condition",()=>{
  const y=x=>3*Math.exp(x/2);
  near(y(Math.log(4)),6);near(y(Math.log(8)),6*Math.sqrt(2));
  for(const x of [-2,0,Math.log(8),4]){
    near(derivative(y,x),y(x)/2);
    let sum=0;for(let n=1;n<=45;n++)sum+=y(x)/2**n;
    near(sum,y(x),1e-10);
  }
});

test("nested trigonometric substitutions and annular cross sections agree with independent quadrature",()=>{
  const integrand=x=>Math.sin(x)**2*Math.cos(x)**2/(Math.sin(x)**3+Math.cos(x)**3)**2;
  near(simpson(integrand,0,Math.PI/4),1/6);
  const F=x=>-1/(3*(Math.tan(x)**3+1));
  for(const x of [.1,.3,.6])near(derivative(F,x),integrand(x));
  near(simpson(y=>Math.PI*(3-y*y),-Math.sqrt(3),Math.sqrt(3)),4*Math.PI*Math.sqrt(3));
});

test("the exact factorial sum telescopes even at degree 2024 and has the requested leading limit",()=>{
  const product=(a,b)=>{let p=1n;for(let j=a;j<=b;j++)p*=BigInt(j);return p;};
  const p=2024;
  for(const n of [0,1,5]){
    let term=product(1,p),sum=term;
    for(let i=1;i<=n;i++){term=term*BigInt(p+i)/BigInt(i);sum+=term;}
    assert.equal(sum,product(n+1,n+p+1)/BigInt(p+1));
  }
  let ratio=1;for(let j=1;j<=2025;j++)ratio*=1+j/1e12;
  near(ratio/2025,1/2025,2e-9);
});

test("trig simplification and the cosine cancellation limit select the source answers",()=>{
  const k=x=>(Math.sin(x)+1/Math.sin(x))**2+(Math.cos(x)+1/Math.cos(x))**2+(Math.tan(x)+1/Math.tan(x))**2;
  near(derivative(k,5*Math.PI/6),128*Math.sqrt(3)/9,1e-6);
  const x=.01,limit=(2*Math.sin(2*x)**2-8*x*x)/(x**4);
  near(limit,-32/3,.001);
  near(8*(-32/3),-256/3);
});

test("fold restrictions produce a valid reflected corner and the global minimum on the sheet",()=>{
  const minX=18-6*Math.sqrt(5);
  const L=x=>Math.sqrt(x**3/(x-4));
  near(L(6),6*Math.sqrt(3));assert.ok(minX<6&&6<8);
  for(let x=minX;x<=8;x+=.001){
    assert.ok(2*x/Math.sqrt(x-4)<=12+1e-9);
    assert.ok(L(x)>=6*Math.sqrt(3)-1e-9);
  }
  const x=6,y=4*Math.sqrt(x-4),z=2*x/Math.sqrt(x-4);
  const U=[12,8],P=[12-y,0],C=[12-z,8],D=[12,8-x];
  const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
  near(distance(C,U),distance(C,P));near(distance(D,U),distance(D,P));
  near(distance(C,D),6*Math.sqrt(3));
  near((D[0]-C[0])*(U[0]-P[0])+(D[1]-C[1])*(U[1]-P[1]),0);
});

test("Gamma quotient converges independently after removing its integrable endpoint singularity",()=>{
  const gammaHalf=simpson(u=>2*Math.exp(-u*u),0,9);
  const gammaFiveHalves=simpson(u=>2*u**4*Math.exp(-u*u),0,9);
  near(gammaFiveHalves/gammaHalf,3/4);
  assert.ok(gammaHalf>0);
});
