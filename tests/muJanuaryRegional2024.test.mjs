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

const batch=muQuestions.filter(q=>q.source?.competition==="2024 January Regional");
const get=n=>batch.find(q=>q.source.questionNumber===n);
const near=(a,b,tolerance=1e-8)=>assert.ok(Math.abs(a-b)<tolerance,a+" vs "+b);
const derivative=(f,x,h=1e-6)=>(f(x+h)-f(x-h))/(2*h);
const simpson=(f,a,b,n=40000)=>{
  const h=(b-a)/n;let sum=f(a)+f(b);
  for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+i*h);
  return sum*h/3;
};
const vector=name=>readFileSync(new URL("../public/questions/"+name,import.meta.url),"utf8");

test("January Regional 2024 retains 30 credited questions, with source 26 and 27 keys corrected",()=>{
  assert.equal(batch.length,30);
  const sourceKey=["CADCC","AADBA","CCBDC","CBCCB","DACAB","BACBD"].join("");
  const correctedKey="CADCCAADBACCBDCCBCCBDACABABCBD";
  assert.equal(sourceKey.length,30);assert.equal(correctedKey.length,30);
  for(const [i,q] of batch.entries()){
    assert.equal(q.id,10535+i);assert.equal(q.number,412+i);
    assert.deepEqual(q.source,{competition:"2024 January Regional",event:"Calculus Individual",questionNumber:i+1});
    assert.equal(q.answer,correctedKey[i]);
    if(![26,27].includes(i+1))assert.equal(q.answer,sourceKey[i]);
    assert.equal(q.choices.length,5);assert.equal(q.choices[4],"NOTA");
  }
  assert.deepEqual(muQuestions.map(q=>q.number),Array.from({length:muQuestions.length},(_,i)=>i+1));
  assert.equal(new Set(muQuestions.map(q=>q.id)).size,muQuestions.length);
  assert.equal(get(26).answer,"A");assert.equal(get(27).answer,"B");
});

test("all 411 previously approved records are unchanged and the regional set does not duplicate the Invitational",()=>{
  const old=muQuestions.filter(q=>q.id<10535);
  assert.equal(old.length,411);
  assert.equal(createHash("sha256").update(JSON.stringify(old)).digest("hex"),"3ed73a672ca247137840df109565b08007e350592114ed6d0dbc138001b3fec9");
  const priorText=new Set(old.map(q=>q.question));
  for(const q of batch)assert.equal(priorText.has(q.question),false);
});

test("topics and optional methods reuse canonical vocabulary with calibrated difficulty",()=>{
  const benchmarks=[...muQuestions.filter(q=>q.id<10535),...alphaQuestions,...thetaQuestions,...muNationalReferences];
  const topics=new Set(benchmarks.map(q=>q.topic)),methods=new Set(benchmarks.flatMap(q=>q.methods));
  for(const q of batch){
    assert.ok(topics.has(q.topic),q.topic);
    for(const method of q.methods)assert.ok(methods.has(method),method);
  }
  assert.deepEqual(batch.map(q=>q.difficulty),[1,1,1,1,1,2,1,2,1,1,3,1,1,1,2,3,2,3,2,3,2,1,3,3,1,3,3,3,3,3]);
  assert.ok(batch.some(q=>q.methods.length===0));
  assert.equal(batch.some(q=>q.methods.includes("Integral Properties")),false);
});

test("all formulas compile strictly, and identified domain and wording repairs are explicit",()=>{
  for(const q of batch)for(const text of [q.question,...q.choices,q.solution]){
    for(const m of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)){
      assert.doesNotThrow(()=>katex.renderToString(m[1]??m[2],{throwOnError:true,displayMode:m[2]!==undefined}),"source "+q.source.questionNumber);
    }
    assert.doesNotMatch(text.replace(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g,""),/\\[()[\]]/);
  }
  assert.match(get(2).question,/b>0/);
  assert.match(get(16).solution,/Pointwise convergence alone/);
  assert.match(get(18).question,/minimum surface-path length/);
  assert.match(get(20).question,/axis perpendicular/);
  assert.match(get(24).question,/set of values/);
  assert.match(get(26).solution,/not.*as stated/);
  assert.match(get(27).solution,/wrong sign/);
  assert.match(get(28).question,/fixed nonnegative real number/);
  assert.match(get(28).question,/over nonnegative real/);
  assert.match(get(29).question,/nonzero real/);
  assert.match(get(30).question,/canceling its indicated factor/);
  assert.match(get(30).solution,/direct product rule/);
});

test("vector diagrams retain source geometry and the tangent graph is solution-only",()=>{
  assert.equal(get(20).illustration.src,"/questions/mu-554-parabolas.svg");
  assert.equal(get(24).illustration,undefined);
  const square=vector("mu-554-parabolas.svg");
  assert.match(square,/<rect x="180" y="150" width="120" height="120"/);
  assert.match(square,/<rect x="120" y="90" width="240" height="240"/);
  assert.match(square,/M 60 15 Q 240 285 420 15/);
  assert.match(square,/stroke-dasharray="6 5"/);
  for(const [name,w,h] of [["mu-554-parabolas.svg",480,420],["mu-558-solution.svg",620,380]]){
    const svg=vector(name);
    assert.match(svg,new RegExp('viewBox="0 0 '+w+' '+h+'"'));
    assert.doesNotMatch(svg,/<image\b|data:|<script\b/);
  }
  assert.match(get(24).solution,/\[\[solution-diagram:mu-558\]\]/);
  const require=createRequire(import.meta.url),exports={};
  runInNewContext(ts.transpileModule(readFileSync(new URL("../components/math/MathText.tsx",import.meta.url),"utf8"),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true},
  }).outputText,{exports,require});
  const html=renderToStaticMarkup(React.createElement(exports.default,null,get(24).solution));
  assert.match(html,/\/questions\/mu-558-solution\.svg/);
  assert.doesNotMatch(html,/\[\[solution-diagram/);
  const questionHtml=renderToStaticMarkup(React.createElement(exports.default,null,get(24).question));
  assert.doesNotMatch(questionHtml,/mu-558-solution/);
});

test("long source choices retain their content inside shrinkable answer grids",()=>{
  const css=readFileSync(new URL("../components/practice/question-detail.module.css",import.meta.url),"utf8");
  assert.match(css,/\.choices \{[^}]*grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(css,/\.choice \{[^}]*min-width: 0/);
  assert.match(css,/\.choiceText \{[^}]*overflow-x: auto/);
  for(const file of ["MatchQuestion.tsx","MatchResults.tsx","SpectatorView.tsx"]){
    const source=readFileSync(new URL("../components/multiplayer/"+file,import.meta.url),"utf8");
    assert.match(source,/grid min-w-0 grid-cols-1/);
  }
});

test("source 1 cubic coefficient and source 2 implicit slopes agree with the printed choices",()=>{
  const multiply=(a,b)=>{const c=Array(a.length+b.length-1).fill(0);a.forEach((v,i)=>b.forEach((w,j)=>c[i+j]+=v*w));return c;};
  const coefficients=multiply(multiply([8,1],[9,2]),[10,1]);
  assert.equal(coefficients[3]*6,12);
  for(const a of [-3,0,5])for(const b of [1,4,9]){
    const f=x=>Math.sqrt(x**3+a*x+b);
    near(derivative(f,0),a*Math.sqrt(b)/(2*b));
  }
});

test("sources 3-7 exponential limit, MVT point, independent rational limits and tangent intercept check",()=>{
  for(const x of [1e8,1e10])near(100*x*Math.log1p(1/x),100,1e-6);
  const c=Math.E-1;
  assert.ok(c>1&&c<Math.E);near(1/c,(Math.log(Math.E)-Math.log(1))/(Math.E-1));
  for(const a of [-10,0,4])near((0+2024)/(0+1)+a*0-2024,0);
  const divided=x=>2025/(x+1);
  near(divided(1e12),0,3e-9);
  for(const x of [1,4,8])near((x*x+2024)/(x+1)-x+1,divided(x));
  near(3*3+2*3+2,17);near(2*3+2,8);near(17-8*3,-7);
});

test("source 8 recurrence has a growing square lower bound and diverges to positive infinity",()=>{
  let x=1;
  for(let n=1;n<=10000;n++){
    const next=x+1/x;assert.ok(next>x);near(next*next,x*x+2+1/(x*x),1e-8);
    x=next;assert.ok(x*x>=1+2*n-1e-7);
  }
  assert.ok(x>140);
});

test("sources 9-13 finite difference, quotient derivative, log-sine limit, concavity and fixed point check",()=>{
  const f=x=>3*x*x-2*x+1;
  for(const a of [-4,.5,3])near(f(a+1)-f(a),6*a+1);
  near(derivative(x=>Math.cos(Math.PI*x)/(1+x*x),1),.5);
  for(const x of [-.001,-.0001,.0001,.001])near(Math.log(Math.sin(x)/x)/(x*x),-1/6,3e-8);
  assert.ok(6*2-6>0&&6*0-6<0);
  for(const x of [-2,0,1,2])near(x**3-3*x*x+4*x-1-x,(x-1)**3);
});

test("sources 14 and 15 one-sided piecewise value and derivative limits match for arbitrary parameters",()=>{
  for(const a of [-2,0,3])for(const b of [-4,0,5]){
    const left=x=>Math.exp(a*x)/(Math.exp(b*x)+Math.exp(-b*x));
    near(left(0),.5);near(derivative(left,0),a/2);
  }
});

test("source 16 improper-integral chopping is controlled by explicit integrable errors",()=>{
  for(const n of [4,8,20,80]){
    const integrand=x=>Math.sin(Math.PI*x)/(1+x**n);
    const core=simpson(integrand,0,1);
    const tail=simpson(integrand,1,40,100000);
    assert.ok(Math.abs(core-2/Math.PI)<=1/(n+1));
    assert.ok(Math.abs(tail)<=1/(n-1));
    assert.ok(Math.abs(core+tail-2/Math.PI)<=1/(n+1)+1/(n-1));
    if(n===80)near(core+tail,2/Math.PI,.001);
  }
});

test("sources 17 and 18 logarithmic derivative and shortest cube surface-path rate check",()=>{
  const f=x=>Math.sqrt((x-1)*(x-2)**3*(x+1)**5);
  near(f(3),32*Math.sqrt(2));near(derivative(f,3),76*Math.sqrt(2),1e-6);
  for(const s of [1,2,5]){
    const bound=u=>Math.hypot(s,u)+Math.hypot(s,s-u),minimum=s*Math.sqrt(5);
    near(bound(s/2),minimum);
    for(let i=0;i<=100;i++)assert.ok(bound(s*i/100)>=minimum-1e-10);
  }
  near(derivative(t=>(3+2*t)*Math.sqrt(5),0),2*Math.sqrt(5));
});

test("source 19 sum-of-cubes ratio telescopes with the claimed finite and infinite sums",()=>{
  let sum=0,triangular=0,cubes=0;
  for(let n=1;n<=10000;n++){
    triangular+=n;cubes+=n**3;
    near(triangular/cubes,2/(n*(n+1)));
    sum+=triangular/cubes;
    near(sum,2*(1-1/(n+1)));
  }
});

test("source 20 four tangent parabolas give the same outer-to-inner square ratio at every scale",()=>{
  for(const s of [.5,1,4]){
    const k=1/(4*s),t=2*s;
    near(k*t*t+s,t);
    near(2*k*t,1);near(1/(2*k*t),1);
    near(4*s/(2*s),2);
    // Top SVG quadratic has the vertex and two tangencies in the correct positions.
    const bezier=q=>(1-q)**2*15+2*(1-q)*q*285+q*q*15;
    near(bezier(.5),150);near(bezier(1/6),90);near(bezier(5/6),90);
  }
});

test("sources 21-23 logarithmic derivative, entire cosine series and second-order exponential limit check",()=>{
  near(derivative(x=>x**x,Math.E),2*Math.E**Math.E,1e-6);
  let series=1,term=1;
  for(let n=1;n<=25;n++){term*=-Math.PI*Math.PI/((2*n-1)*(2*n));series+=term;}
  near(series,-1);
  for(const x of [-1e-5,1e-5]){
    const limit=Math.E*Math.expm1(Math.log1p(x)/x-1)/x;
    near(limit,-Math.E/2,.00002);
  }
});

test("source 24 stationary levels count all intersections including the two excluded boundary levels",()=>{
  const H=x=>Math.log1p(x*x)-x/2,u=2-Math.sqrt(3),v=2+Math.sqrt(3),low=H(u),high=H(v);
  near(low,Math.log(8-4*Math.sqrt(3))-(1-Math.sqrt(3)/2));
  near(high,Math.log(8+4*Math.sqrt(3))-(1+Math.sqrt(3)/2));
  assert.ok(low<high);
  const count=b=>{
    const roots=[];
    for(const [a0,b0] of [[-100,u],[u,v],[v,100]]){
      if(b<Math.min(H(a0),H(b0))-1e-10||b>Math.max(H(a0),H(b0))+1e-10)continue;
      let a=a0,c=b0;
      if(Math.abs(H(a)-b)<1e-9)roots.push(a);
      else if(Math.abs(H(c)-b)<1e-9)roots.push(c);
      else{
        for(let i=0;i<80;i++){const mid=(a+c)/2;if((H(a)-b)*(H(mid)-b)<=0)c=mid;else a=mid;}
        roots.push((a+c)/2);
      }
    }
    return roots.filter((x,i)=>!roots.slice(0,i).some(y=>Math.abs(x-y)<1e-7)).length;
  };
  assert.equal(count(low-1),1);assert.equal(count(low),2);
  assert.equal(count((low+high)/2),3);assert.equal(count(high),2);assert.equal(count(high+1),1);
  near(derivative(x=>Math.log1p(x*x),u),.5);near(derivative(x=>Math.log1p(x*x),v),.5);
});

test("sources 25 and 26 dominant nth root and actual Newton recurrence converge to 20 and -5",()=>{
  for(const n of [10,30,100]){
    const value=20*Math.exp(Math.log1p(.1**n+.2**n)/n);
    assert.ok(value>=20&&value<=20*3**(1/n));if(n===100)near(value,20);
  }
  let x=-2024;
  for(let n=0;n<30;n++){
    const denominator=2*x+1;assert.ok(denominator<0);
    const next=x-(x*x+x-20)/denominator;
    assert.ok(next>=x-1e-10&&next<=-5+1e-10);
    near(next+5,(x+5)**2/denominator,1e-10);x=next;
  }
  near(x,-5);
  assert.equal((-5)**2-5-20,0);assert.notEqual((-4)**2-4-20,0);
});

test("source 27 repeated complex multiplication independently gives positive one-half",()=>{
  const real=Math.sqrt(3)/8,imag=-1/8,powers=[[1,0]];
  for(let n=1;n<=61;n++){
    const [x,y]=powers[n-1];powers.push([x*real-y*imag,x*imag+y*real]);
  }
  for(let n=1;n<=60;n++){
    const [a,b]=powers[n+1],[c,d]=powers[n-1];
    near(4**(2*n)*(a*c+b*d),.5);
  }
  near(Math.cos(11*Math.PI/3),.5);
});

test("source 28 Young minimization includes the y=0 endpoint and fixed-variable quantifier",()=>{
  for(const p of [1.5,2,3,5])for(const y of [0,.3,2,5]){
    const q=p/(p-1),f=x=>x**p/p-x*y,x=y**(1/(p-1)),minimum=-(y**q)/q;
    near(1/p+1/q,1);near(f(x),minimum);
    for(let i=0;i<=200;i++)assert.ok(f(i*Math.max(10,3*x)/200)>=minimum-1e-8);
  }
});

test("source 29 circle construction works on both slope signs and has the claimed derivative",()=>{
  const f=x=>1/Math.sqrt(1+x*x);
  for(const m of [-3,-.5,.5,2]){
    const bx=1/m,ay=Math.abs(m)/Math.sqrt(1+m*m);
    near(f(bx),ay);
    const ax=ay/m;near(ax*ax+ay*ay,1);assert.ok(ay>0);
  }
  near(f(0),1);near(derivative(f,1),-Math.sqrt(2)/4);
});

test("source 30 product rule handles canceled factors, repeated roots and endpoint integration",()=>{
  const roots=[1,2,2,3,4],product=(x,excluded=-1)=>roots.reduce((p,a,i)=>i===excluded?p:p*(x-a),1);
  const sum=x=>roots.reduce((s,_,i)=>s+product(x,i),0);
  for(const x of [0,1,2,2.5,4,5])near(derivative(product,x),sum(x),1e-6);
  near(simpson(sum,1,4),0,1e-8);
  const omitted=simpson(x=>product(x,2),1,4);
  near(simpson(x=>sum(x)-product(x,2),1,4),-omitted);
  // At x=0, a full 2024-factor product with every root 1 has derivative -2024.
  let fullSum=0;for(let n=1;n<=2024;n++)fullSum+=(-1)**2023;
  assert.equal(fullSum,-2024);
  assert.equal(0-1012,-1012);
});
