import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
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

const batch=muQuestions.filter(q=>q.source?.competition==="2026 March Regional");
const get=n=>batch[n-1];
const near=(actual,expected,tolerance=1e-9)=>assert.ok(Math.abs(actual-expected)<tolerance,actual+" vs "+expected);
const simpson=(f,a,b,n=30000)=>{
  const h=(b-a)/n;let sum=f(a)+f(b);
  for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+i*h);
  return sum*h/3;
};
const gcd=(a,b)=>b?gcd(b,a%b):a;

test("March Regional contains all 30 source-key answers with independent public and original numbering",()=>{
  assert.equal(batch.length,30);
  assert.equal(batch.map(q=>q.answer).join(""),"ACCABABBDBAECECCDDEAACCABBBDBC");
  for(const [i,q] of batch.entries()){
    assert.equal(q.id,10326+i);
    assert.equal(q.number,204+i);
    assert.deepEqual(q.source,{competition:"2026 March Regional",event:"Calculus Individual",questionNumber:i+1});
    assert.equal(q.choices.length,5);
    assert.equal(q.choices[4],"NOTA");
  }
  assert.equal(new Set(muQuestions.map(q=>q.id)).size,muQuestions.length);
  assert.deepEqual(muQuestions.map(q=>q.number),Array.from({length:muQuestions.length},(_,i)=>i+1));
});

test("labels use the established vocabulary and calibrated difficulty snapshots",()=>{
  const benchmarks=[...muQuestions.filter(q=>q.id<10326),...alphaQuestions,...thetaQuestions,...muNationalReferences];
  const topics=new Set(benchmarks.map(q=>q.topic));
  const methods=new Set(benchmarks.flatMap(q=>q.methods));
  for(const q of batch){
    assert.ok(topics.has(q.topic),q.topic);
    for(const method of q.methods)assert.ok(methods.has(method),method);
  }
  assert.ok(batch.some(q=>q.methods.length===0));
  assert.deepEqual(batch.map(q=>q.difficulty),[1,1,1,1,2,1,2,1,2,2,2,4,4,3,3,1,3,2,2,4,2,2,3,3,2,4,3,4,3,5]);
});

test("all March formulas compile and original images are present at their exact dimensions",()=>{
  for(const q of batch)for(const value of [q.question,...q.choices,q.solution]){
    for(const m of value.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)){
      assert.doesNotThrow(()=>katex.renderToString(m[1]??m[2],{throwOnError:true,displayMode:m[2]!==undefined}),"Original question "+q.source.questionNumber);
    }
    assert.doesNotMatch(value.replace(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g,""),/\\[()[\]]/);
  }
  for(const [file,width,height] of [["mu-336-338-original.svg",607,155],["mu-348-original.svg",690,359],["mu-345-original-solution.svg",558,560]]){
    const png=readFileSync(new URL("../public/questions/"+file,import.meta.url));
    assert.match(png.toString("utf8"),new RegExp('width="'+width+'"'));
    assert.match(png.toString("utf8"),new RegExp('height="'+height+'"'));
  }
  for(const n of [11,12,13])assert.equal(get(n).illustration.src,"/questions/mu-336-338-original.svg");
  assert.equal(get(23).illustration.src,"/questions/mu-348-original.svg");
  assert.doesNotMatch(get(20).question,/solution-diagram/);
  const require=createRequire(import.meta.url),exports={};
  const code=ts.transpileModule(readFileSync(new URL("../components/math/MathText.tsx",import.meta.url),"utf8"),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true},
  }).outputText;
  runInNewContext(code,{exports,require});
  const html=renderToStaticMarkup(React.createElement(exports.default,null,get(20).solution));
  assert.match(html,/mu-345-original-solution\.svg/);
  assert.doesNotMatch(html,/\[\[solution-diagram/);
});

test("document errors and ambiguity repairs are explicit without changing intended answers",()=>{
  assert.match(get(2).solution,/negative to positive/);
  assert.ok(get(5).solution.includes(String.raw`x^2-3y^2`));
  assert.ok(get(7).solution.includes(String.raw`r(3\pi/4)=\sqrt2+1`));
  assert.match(get(12).solution,/not differentiability at every/);
  assert.match(get(13).solution,/convergence condition/);
  assert.match(get(15).solution,/not always the reduced denominator/);
  assert.ok(get(16).solution.includes(String.raw`\int_0^2`));
  assert.match(get(18).solution,/Now set/);
  assert.match(get(22).choices[1],/cannot equal/);
  assert.match(get(22).solution,/need not represent the same/);
  assert.match(get(24).question,/finite continuous extension/);
  assert.match(get(24).solution,/bound is attainable/);
  assert.ok(get(27).solution.includes(String.raw`r=-\sqrt2/2`));
  assert.match(get(27).question,/q>0/);
  assert.match(get(30).solution,/y'\(0\)=0/);
});

test("a positive continuous corner construction satisfies every table entry without derivative zeros",()=>{
  const eps=.01;
  const pieces=[
    {center:1,p:t=>2+t+t*t/2,d:t=>1+t,dd:()=>1},
    {center:2,p:t=>1+4*t-t*t/2,d:t=>4-t,dd:()=>-1},
    {center:3,p:t=>4+3*t+t*t,d:t=>3+2*t,dd:()=>2},
  ];
  for(const [i,p] of pieces.entries()){
    assert.deepEqual([p.p(0),p.d(0),p.dd(0)],[[2,1,1],[1,4,-1],[4,3,2]][i]);
    for(const t of [-eps,0,eps])assert.ok(p.p(t)>0&&p.d(t)!==0&&p.dd(t)!==0);
  }
  for(let i=0;i<2;i++){
    const left=pieces[i],right=pieces[i+1],L=left.center+eps,R=right.center-eps;
    const u=left.p(eps),v=right.p(-eps);
    for(const t of [0,.25,.5,.75,1]){
      const value=u+(v-u)*Math.expm1(t)/Math.expm1(1);
      const derivative=(v-u)*Math.exp(t)/((R-L)*Math.expm1(1));
      const second=derivative/(R-L);
      assert.ok(value>0&&derivative!==0&&second!==0);
    }
    const dLeft=(v-u)/((R-L)*Math.expm1(1));
    const dRight=dLeft*Math.E;
    assert.notEqual(dLeft,left.d(eps));
    assert.notEqual(dRight,right.d(-eps));
  }
  assert.notEqual(pieces[0].p(-eps),pieces[0].d(-eps));
  assert.notEqual(pieces[2].p(eps),pieces[2].d(eps));
});

test("elementary derivatives, finite sums and reduced fractions check independently",()=>{
  near(Math.sin(3*Math.PI/4)-Math.cos(3*Math.PI/4)+1,1+Math.SQRT2);
  near((1-2)/(1-3),.5);
  near(Math.PI/3-.5/(2/Math.sqrt(3)),Math.PI/3-Math.sqrt(3)/4);
  near(Math.E*2/Math.E,2);
  let right=0;for(let i=1;i<=4;i++){const x=i/2;right+=(3*x*x+2*x)/2;}
  near(right,65/4);
  const possible=new Set();
  for(let N=1;N<=99;N++){const d=gcd(N,99);possible.add((N+99)/d);}
  assert.deepEqual([105,110,115,120].filter(n=>possible.has(n)),[115]);
  const f=x=>simpson(t=>Math.cos(t)+Math.sin(t),x*x,x);
  const h=1e-5;near((f(1+h)-f(1-h))/(2*h),-Math.cos(1)-Math.sin(1),1e-8);
});

test("recognized product-rule integral works for an independent polynomial meeting the relevant table rows",()=>{
  const p1=t=>1+t-102*t*t+214*t**3-110*t**4;
  const p2=t=>1-204*t+642*t*t-440*t**3;
  near(p1(0),1);near(p1(1),4);near(p2(0),1);near(p2(1),-1);
  near(simpson(p1,0,1),-1);
  const value=simpson(x=>{
    const d=p1(x-1),dd=p2(x-1);
    return(d*d+x*d*dd+1)/Math.hypot(1,d);
  },1,2);
  near(value,2*Math.sqrt(17)-Math.SQRT2,1e-8);
});

test("inverse-integral equality, optimization, trig ratios and final series agree numerically",()=>{
  // Substituting x=1-t^63 removes both fractional-power endpoint singularities.
  const transformed=(t,a,b)=>t===0?0:63*t**62*(-Math.expm1(a*Math.log1p(-(t**63))))**(1/b);
  const first=simpson(t=>t===1?63:transformed(t,9,7),0,1);
  const second=simpson(t=>t===1?63:transformed(t,7,9),0,1);
  near(first,second,1e-8);
  const x=80/Math.sqrt(3),T=x=>x+(80-Math.sqrt(x*x-1600))/2;
  for(const other of [40,42,45,50,60,80,40*Math.sqrt(5)])assert.ok(T(x)<T(other));
  for(const k of [.1,.3,.7,.9]){
    const denom=x=>k*Math.sin(x)**2+Math.cos(x)**2;
    const I=simpson(x=>1/denom(x),0,Math.PI/2);
    const Is=simpson(x=>Math.sin(x)**2/denom(x),0,Math.PI/2);
    const Ic=simpson(x=>Math.cos(x)**2/denom(x),0,Math.PI/2);
    near(I,Math.PI/(2*Math.sqrt(k)));
    near(Is/Ic,(Math.PI-2*I)/(2*k*I-Math.PI));
  }
  const r=-Math.SQRT1_2;
  assert.ok(1/(1-r)<1/(1+r));near(1/(1-r)+1/(1+r),4);near(r**4,.25);
  let term=16/3,sum=term;
  for(let k=2;k<100;k++){term*=2*(k+1)**2/(k*k*(k+2));sum+=term;}
  near(sum,3*Math.exp(2)-3);
});
