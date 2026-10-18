import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import test from "node:test";
import katex from "katex";
import {muQuestions} from "../data/questions/mu.ts";
import {alphaQuestions} from "../data/questions/alpha.ts";
import {thetaQuestions} from "../data/questions/theta.ts";
import {muNationalReferences} from "../data/question-references/muNationals.ts";

const batch=muQuestions.filter(q=>q.source?.competition==="2025 February Regional");
const get=n=>batch[n-1];
const near=(a,b,tolerance=1e-8)=>assert.ok(Math.abs(a-b)<tolerance,a+" vs "+b);
const derivative=(f,x,h=1e-5)=>(f(x+h)-f(x-h))/(2*h);
const simpson=(f,a,b,n=40000)=>{
  const h=(b-a)/n;let sum=f(a)+f(b);
  for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+i*h);
  return sum*h/3;
};

test("February Regional 2025 keeps all 30 source answers and credits without changing any old records",()=>{
  assert.equal(batch.length,30);
  assert.equal(batch.map(q=>q.answer).join(""),["CDCCD","BABBA","DACBA","ADBAD","AACAC","BCDAC"].join(""));
  for(const [i,q] of batch.entries()){
    assert.equal(q.id,10445+i);
    assert.equal(q.number,323+i);
    assert.deepEqual(q.source,{competition:"2025 February Regional",event:"Calculus Individual",questionNumber:i+1});
    assert.equal(q.choices.length,5);
    assert.equal(q.choices[4],"NOTA");
    assert.equal(q.illustration,undefined,"supplied pages contain no diagrams");
  }
  assert.equal(new Set(muQuestions.map(q=>q.id)).size,muQuestions.length);
  assert.deepEqual(muQuestions.map(q=>q.number),Array.from({length:muQuestions.length},(_,i)=>i+1));
  const old=muQuestions.filter(q=>q.id<=10444);
  assert.equal(old.length,322);
  assert.equal(createHash("sha256").update(JSON.stringify(old)).digest("hex"),"0c4948abec014a80f25041eff9a5643cbf845075b781c0d9d57fb40771ffd7b6");
});

test("topics and optional methods use existing labels with calibrated difficulties",()=>{
  const benchmarks=[...muQuestions.filter(q=>q.id<10445),...alphaQuestions,...thetaQuestions,...muNationalReferences];
  const topics=new Set(benchmarks.map(q=>q.topic)),methods=new Set(benchmarks.flatMap(q=>q.methods));
  for(const q of batch){
    assert.ok(topics.has(q.topic),q.topic);
    for(const method of q.methods)assert.ok(methods.has(method),method);
    assert.ok(!q.methods.includes("Integral Properties"),"no elementary interval-rule problem in this set");
  }
  assert.deepEqual(batch.map(q=>q.difficulty),[1,1,1,1,1,1,1,2,2,2,2,2,2,2,1,2,3,2,3,2,4,4,2,3,4,3,3,2,3,3]);
  assert.ok(batch.some(q=>q.methods.length===0));
});

test("every question, answer choice and detailed solution compiles with KaTeX",()=>{
  for(const q of batch)for(const text of [q.question,...q.choices,q.solution]){
    for(const m of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)){
      assert.doesNotThrow(()=>katex.renderToString(m[1]??m[2],{throwOnError:true,displayMode:m[2]!==undefined}),"source "+q.source.questionNumber);
    }
    assert.doesNotMatch(text.replace(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g,""),/\\[()[\]]/);
  }
});

test("narrow wording repairs and necessary explanation corrections are explicit",()=>{
  assert.match(get(2).question,/entire real line/);
  assert.match(get(2).solution,/removable hole, not a vertical asymptote/);
  assert.match(get(8).question,/at \\\(\(1,1\)\\\)/);
  assert.match(get(14).solution,/self-contained/);
  assert.match(get(21).solution,/actual error bound/);
  assert.ok(get(21).solution.includes(String.raw`\[e^{-x/2},-2e^{-x/2}`),"long integration lists use scrollable display math");
  assert.match(get(22).question,/original Question 21/);
  assert.match(get(22).solution,/without requiring the previous question/);
  assert.ok(get(22).solution.includes(String.raw`\[e^{-x/3},-3e^{-x/3}`));
  assert.ok(get(25).solution.includes(String.raw`ends at \(2\pi\)`));
  assert.match(get(26).question,/two distinct lines/);
  assert.match(get(29).solution,/cannot vanish/);
  assert.match(get(30).solution,/constant sign/);
});

test("direct limits, reciprocal-composition domains, coefficients and trig derivatives match sources 1-7",()=>{
  near(1**4+2*1**2+1,4);
  const g=x=>1/x;
  for(const x of [-5,-1,0,.5,3]){
    for(const u of [2**x,2+Math.sin(x),x*x+1])assert.ok(Number.isFinite(g(u)));
    if(x!==0)near(g(g(x)),x);
  }
  assert.ok(!Number.isFinite(g(0)));
  const a=2,b=8;near(2*a*3+b,4*3+8);near(a+b,10);
  const f=x=>Math.sin(x)+Math.cos(x);
  for(const x of [-1,.3,2]){
    near(derivative(f,x),f(-x));
    near(derivative(t=>-f(-t),x),f(x));
    near(derivative(t=>(t*t+1)**2+1,x),4*x*(x*x+1));
  }
  for(const x of [-1e-6,1e-6])near(Math.expm1(x*Math.log(2))/(Math.sin(x)+Math.tan(x)),Math.log(2)/2,2e-7);
});

test("normal intersection, inflection ordinate, rational extrema and cube-root cancellation check sources 8-12",()=>{
  near(-1.5+2*(-1.5)**2,3);
  near((-1/3)**3+(-1/3)**2+1/3,11/27);
  const y=x=>(1+2*x)/(3+4*x*x);
  near(y(-1.5),-1/6);near(y(.5),.5);near(1/y(-1.5)+1/y(.5),-4);
  for(let x=-20;x<=20;x+=.01)assert.ok(y(x)>=-1/6-1e-10&&y(x)<=.5+1e-10);
  const f=x=>Math.cbrt(x**3+x*x+x+1);
  near(derivative(f,4)*f(4)**2,19,1e-7);
  const F=x=>(x+1)**2*(x/3-1/6);
  for(const x of [-2,-1,.3,4])near(derivative(F,x),x*(x+1));
  near(1/(1/3-1/6),6);
});

test("vertical tangencies, center, phase shift and implicit slope check sources 13-16",()=>{
  const curve=(x,y)=>x*x+2*x*y+3*y*y+4*x;
  for(const [x,y] of [[0,0],[-6,2]]){
    near(curve(x,y),0);near(2*x+6*y,0);assert.notEqual(2*x+2*y+4,0);
  }
  near(2*(-3)+2*1+4,0);near(2*(-3)+6*1,0);
  const f=x=>3*Math.sin(x)+4*Math.cos(x);
  for(const x of [-2,.3,2])near(derivative(f,x),f(x+Math.PI/2));
  near(3*Math.sin(4*Math.PI)+4*Math.sin(3*Math.PI),0);
  near(-(Math.sin(4*Math.PI)+4*Math.PI*Math.cos(3*Math.PI))/(Math.sin(3*Math.PI)+3*Math.PI*Math.cos(4*Math.PI)),4/3);
});

test("distance, tangent discriminant, concavity and maximum slope check sources 17-20",()=>{
  const distanceSquared=x=>(x-18)**2+x**4;
  near(distanceSquared(2),272);near(Math.sqrt(distanceSquared(2)),4*Math.sqrt(17));
  for(let x=-10;x<=10;x+=.01)assert.ok(distanceSquared(x)>=272-1e-9);
  near(2*2**3+2-18,0);
  for(const m of [-.5,.5]){
    near(1-4*m*m,0);near(1-2+(m*(-2))**2,0);
  }
  const f=x=>(x-2)*Math.sqrt(4-x*x);
  const second=x=>2*(x-2)*(x*x+2*x-2)/(4-x*x)**1.5;
  const h=1e-4,x=Math.sqrt(3)-1;
  near((f(x+h)-2*f(x)+f(x-h))/(h*h),0,1e-6);
  assert.ok(second(x-.01)>0&&second(x+.01)<0);
  const slope=x=>-2*x*Math.exp(-x*x),maximum=Math.sqrt(2/Math.E);
  near(slope(-1/Math.sqrt(2)),maximum);
  for(let t=-10;t<=10;t+=.01)assert.ok(slope(t)<=maximum+1e-10);
});

test("tabular antiderivatives and explicit integral bounds rigorously establish both nearest integers",()=>{
  for(const [k,C,target,nearest] of [[2,158,48,79],[3,678,81,113]]){
    const f=x=>x**3*Math.exp(-x/k);
    const F=x=>-(k*x**3+3*k*k*x*x+6*k**3*x+6*k**4)*Math.exp(-x/k);
    for(const x of [0,.1,.5,1])near(derivative(F,x),f(x),2e-8);
    const integral=simpson(f,0,1);
    assert.ok(integral>0&&integral<.25);
    near(F(1)-F(0),integral);
    near(6*k**4-C/Math.exp(1/k),integral);
    const value=target*Math.exp(1/k);
    assert.ok(value>nearest&&value<nearest+.5);
    near(target*C/(6*k**4),nearest);
    assert.ok(target*C/(6*k**4-.25)<nearest+.5);
    assert.equal(Math.round(value),nearest);
  }
});

test("x-to-the-x substitution and cubic constraints check sources 23-24",()=>{
  near(simpson(x=>Math.log(x)+1,1,2),simpson(u=>1/u,1,4));
  near(1**2+4**2+(-1)**2,18);
  const P=x=>(x-1)*(x-4)**2;
  near(P(1),0);near(derivative(P,2),0);near(6*3-18,0);near(P(4),0);
  for(const x of [5,6,7])assert.notEqual(P(x),0);
});

test("counterclockwise motion reaches B at two pi and attains the maximum signed area rate",()=>{
  const end=3/16,theta=t=>Math.PI/2+8*Math.PI*t;
  const K=t=>(1-Math.cos(theta(t))-Math.sin(theta(t)))/2;
  near(theta(end),2*Math.PI);near(Math.cos(theta(end)),1);near(Math.sin(theta(end)),0);
  const t=1/32,maximum=4*Math.PI*Math.sqrt(2);
  near(derivative(K,t,1e-7),maximum,1e-7);
  for(let time=.0001;time<end;time+=.0001){
    assert.ok(K(time)>=0);
    assert.ok(4*Math.PI*(Math.sin(theta(time))-Math.cos(theta(time)))<=maximum+1e-10);
  }
});

test("exactly two distinct tangent intercepts satisfy the required open interval",()=>{
  const intercepts=[];
  for(let k=-10;k<=10;k++)for(const x of [2*k*Math.PI,3*Math.PI/2+2*k*Math.PI]){
    near(Math.cos(x)-Math.sin(x),1);
    const intercept=Math.sin(x)+Math.cos(x)-x;
    if(intercept>6&&intercept<8)intercepts.push(intercept);
  }
  assert.equal(intercepts.length,2);assert.notEqual(intercepts[0],intercepts[1]);
  near(intercepts.reduce((a,b)=>a+b),9*Math.PI/2);
});

test("moving-triangle determinant and AM-GM equality check sources 27-28",()=>{
  for(let t=0;t<=8;t+=.01){
    const P=[0,8-t],Q=[2*t,0],R=[16,t];
    const area=Math.abs((Q[0]-P[0])*(R[1]-P[1])-(Q[1]-P[1])*(R[0]-P[0]))/2;
    near(area,2*(t-4)**2+32);assert.ok(area>=32-1e-9);
  }
  const f=x=>Math.sin(x)**2+Math.cos(x)**2+Math.tan(x)**2+1/Math.sin(x)**2+1/Math.cos(x)**2+1/Math.tan(x)**2;
  near(f(Math.PI/4),7);
  for(let x=.01;x<Math.PI/2;x+=.01)assert.ok(f(x)>=7-1e-9);
});

test("positive separated solution satisfies the unusual product equation and fixes the requested ratio",()=>{
  const f=x=>Math.exp(1/x),df=x=>-Math.exp(1/x)/(x*x);
  const g=x=>3*Math.exp(Math.atan(x)),dg=x=>g(x)/(1+x*x);
  for(const x of [.4,1,Math.sqrt(3),4])near(df(x)*g(x)+f(x)*dg(x),df(x)*dg(x));
  near(g(Math.sqrt(3))/g(1),Math.exp(Math.PI/12));
});

test("absolute sine accumulation has the unique claimed R and verifies the original upper square root",()=>{
  const R=16*Math.PI/3;
  assert.ok(R>5*Math.PI&&R<6*Math.PI);assert.equal(Math.round(R),17);
  let total=0;
  for(let k=0;k<5;k++)total+=simpson(u=>Math.abs(Math.sin(u)),k*Math.PI,(k+1)*Math.PI,2000);
  total+=simpson(u=>Math.abs(Math.sin(u)),5*Math.PI,R,2000);
  near(total,21/2);
  near(simpson(x=>Math.abs(x*Math.sin(x*x)),0,Math.sqrt(R),160000),21/4,2e-8);
});
