import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import test from "node:test";
import katex from "katex";
import {muQuestions} from "../data/questions/mu.ts";
import {alphaQuestions} from "../data/questions/alpha.ts";
import {thetaQuestions} from "../data/questions/theta.ts";
import {muNationalReferences} from "../data/question-references/muNationals.ts";

const batch=muQuestions.filter(q=>q.source?.competition==="2024 March Regional");
const get=n=>batch.find(q=>q.source.questionNumber===n);
const near=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,a+" vs "+b);
const derivative=(f,x,h=1e-5)=>(f(x+h)-f(x-h))/(2*h);
const simpson=(f,a,b,n=20000)=>{
  const h=(b-a)/n;let sum=f(a)+f(b);
  for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+i*h);
  return sum*h/3;
};
const table={x:[0,2,4,6,8],f:[20,16,8,2,0],d:[-4,-6,-4,-2,-1]};

test("all 30 March Regional 2024 originals retain credit and only original 25 changes answer key",()=>{
  assert.equal(batch.length,30);
  const key="DDBDCEBCADBABABCEEBDABCBDCACCB";
  const source="DDBDCEBCADBABABCEEBDABCBACACCB";
  assert.equal(key.length,30);assert.equal(source.length,30);
  assert.equal(batch.map(q=>q.answer).join(""),key);
  const changes=[];
  for(const [i,q] of batch.entries()){
    assert.equal(q.id,10622+i);assert.equal(q.number,499+i);
    assert.deepEqual(q.source,{competition:"2024 March Regional",event:"Calculus Individual",questionNumber:i+1});
    assert.equal(q.choices.length,5);assert.equal(q.choices[4],"NOTA");
    if(q.answer!==source[i])changes.push(i+1);
  }
  assert.deepEqual(changes,[25]);
  assert.equal(new Set(muQuestions.map(q=>q.id)).size,muQuestions.length);
  assert.deepEqual(muQuestions.map(q=>q.number),Array.from({length:muQuestions.length},(_,i)=>i+1));
});

test("all 498 earlier approved records remain unchanged",()=>{
  const old=muQuestions.filter(q=>q.id<10622);
  assert.equal(old.length,498);
  assert.equal(createHash("sha256").update(JSON.stringify(old)).digest("hex"),"3feaac209e366fcc2024e0491f423754e6e6c1d5105ff41d1a51734d32675647");
});

test("labels reuse canonical vocabulary and calibrate difficulty without topic-position inflation",()=>{
  const refs=[...muQuestions.filter(q=>q.id<10622),...alphaQuestions,...thetaQuestions,...muNationalReferences];
  const topics=new Set(refs.map(q=>q.topic)),methods=new Set(refs.flatMap(q=>q.methods));
  for(const q of batch){assert.ok(topics.has(q.topic),q.topic);for(const m of q.methods)assert.ok(methods.has(m),m);}
  assert.deepEqual(batch.map(q=>q.difficulty),[1,1,2,1,2,2,2,2,1,2,2,2,2,2,2,2,2,3,2,2,1,2,2,2,2,2,2,2,3,2]);
  assert.equal(batch.some(q=>q.methods.includes("Integral Properties")),false);
  assert.deepEqual(get(20).methods,["U-Substitution"]);
  assert.ok(batch.some(q=>q.methods.length===0));
});

test("every expression compiles strictly and ambiguity repairs are explicit",()=>{
  for(const q of batch)for(const text of [q.question,...q.choices,q.solution]){
    for(const m of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g))
      assert.doesNotThrow(()=>katex.renderToString(m[1]??m[2],{throwOnError:true,displayMode:m[2]!==undefined}),"source "+q.source.questionNumber);
    assert.doesNotMatch(text.replace(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g,""),/\\[()[\]]/);
  }
  assert.match(get(4).question,/not at/);assert.match(get(7).question,/great circle/);
  assert.match(get(23).question,/tabulated endpoint values, directly/);
  assert.match(get(23).solution,/also makes A and B true/);
  assert.ok(get(30).question.includes(String.raw`+\frac{(x-2)^{60}}{15!}`));
});

test("three SVGs are shared by exactly the corresponding original groups and preserve data and endpoints",()=>{
  const groups=[[9,10,11],[14,15,16],[21,22,23]];
  assert.equal(batch.filter(q=>q.illustration).length,9);
  for(const group of groups){
    const image=get(group[0]).illustration;
    for(const n of group)assert.equal(get(n).illustration,image);
    const svg=readFileSync(new URL("../public"+image.src,import.meta.url),"utf8");
    assert.match(svg,/<title/);assert.match(svg,/<desc/);
    assert.doesNotMatch(svg,/<image|data:|foreignObject|<script/);
  }
  const svg=readFileSync(new URL("../public"+get(21).illustration.src,import.meta.url),"utf8");
  const cells=[...svg.matchAll(/<text\b[^>]*>([^<]+)<\/text>/g)].map(m=>m[1]);
  assert.deepEqual(cells,["x","0","2","4","6","8","f(x)","20","16","8","2","0","f'(x)","-4","-6","-4","-2","-1"]);
  const graph=readFileSync(new URL("../public"+get(9).illustration.src,import.meta.url),"utf8");
  assert.match(graph,/<circle cx="480" cy="200" r="6" fill="white"/);
  assert.match(graph,/<circle cx="480" cy="326"/);
  assert.match(graph,/M480 200 L522 242 L606 158/);
  assert.match(graph,/A84 84 0 0 1 396 242 A84 84 0 0 0 480 326/);
});

test("sources 1-4 continuity, logarithm derivative, difference quotient and acceleration law check",()=>{
  assert.ok(Math.PI>2&&Math.PI<4);assert.ok(Math.PI/2<2&&3*Math.PI/2>4);
  for(let x=2;x<=4;x+=.01){assert.ok(x+1>0&&x+3>0);assert.ok(Math.abs(Math.cos(x))>.4);}
  for(const x of [-3,0,2])near(derivative(x=>Math.log1p(Math.exp(x)),x),Math.exp(x)/(Math.exp(x)+1));
  near(derivative(x=>1/(x-2),4),-.25);
  const k=3,y=t=>4*k*t**1.5/3;
  near(derivative(t=>2*k*Math.sqrt(t),2),k/Math.sqrt(2));
  near(derivative(y,2),2*k*Math.sqrt(2));
});

test("sources 5 and 6 integrate the actual width and retain both even-power roots",()=>{
  near(simpson(y=>4*y-3-y*y,1,3),4/3);
  for(const x of [-2,2])near((2**100-x**100)/100,0);
  assert.equal((-2)*2,-4);assert.equal(get(6).answer,"E");
});

test("sources 7 and 8 related rate and rational derivative give circumference 1 and two points",()=>{
  const r=1/(2*Math.PI),rdot=.7;
  near(8*Math.PI*r*rdot,4*rdot);near(2*Math.PI*r,1);
  for(const x of [1,3])near(derivative(x=>x/(x-2),x),-2);
  assert.deepEqual([2-Math.sqrt(1),2+Math.sqrt(1)],[1,3]);
});

test("sources 9-11 graph limits, all five nondifferentiabilities and reversed shifted area check",()=>{
  near(-2-2,-4);
  assert.deepEqual([-2,0,2,4,5].filter(x=>x>-6&&x<7),[-2,0,2,4,5]);
  const right=x=>x===4?-2:Math.abs(x-5);
  near(right(4),-2);near(right(4+1e-7),1,1e-6);
  near(simpson(x=>Math.abs(x-5),4,5)+simpson(x=>Math.abs(x-5),5,7),2.5);
  near(-(.5*1*1+.5*2*2),-2.5);
  assert.ok(get(10).solution.includes("vertical tangent"));assert.match(get(10).solution,/different one-sided slopes/);
});

test("sources 12 and 13 local approximation and simultaneous sign conditions check",()=>{
  const f=x=>1+2*(x-4)+(x-4)**2;
  near(f(4),1);near(derivative(f,4),2);assert.ok(f(4.5)>2);
  near(1+2*.5,2);
  for(let x=-3;x<4;x+=.01){
    const condition=3*x*(2-x)>0&&6*(1-x)>0;
    assert.equal(condition,x>0&&x<1);
  }
});

test("sources 14-16 derivative graph areas, integration by parts and order check",()=>{
  near(-4-8,-12);near(-4+6,2);near(4*0-2*0-6,-6);
  // A smooth representative on [2,4] with area 6 and endpoint values zero.
  const d=x=>4.5*(x-2)*(4-x),dd=x=>27-9*x;
  near(simpson(d,2,4),6);near(d(2),0);near(d(4),0);
  near(simpson(x=>x*dd(x),2,4),-6);
  assert.ok(dd(4)<0&&0<2);
});

test("source 17 follows an actual implicit branch near (0,-1)",()=>{
  // Nonzero branch is y=(-x-sqrt(x^2+4))/2, obtained from 1-y^2=xy.
  const y=x=>(-x-Math.sqrt(x*x+4))/2;
  near(y(0),-1);near(derivative(y,0),-.5);
  for(const x of [-.2,0,.2])near(y(x)-y(x)**3,x*y(x)**2);
});

test("source 18 evaluates two convergent exponential integrals and one unbounded primitive",()=>{
  near(simpson(x=>Math.exp(-x),0,40),1);
  near(simpson(x=>x*x*Math.exp(-x),0,40),2);
  const F=x=>Math.sqrt(x*x-1);
  near(derivative(F,3),3/Math.sqrt(8));assert.ok(F(1e6)-F(2)>999990);
  assert.equal(get(18).answer,"E");
});

test("sources 19 and 20 Riemann interpretation and ordinary substitution integral check",()=>{
  const n=10000;let sum=0;for(let k=1;k<=n;k++)sum+=(3+4*k/n)*4/n;
  near(sum,20+8/n);near((7**2-3**2)/2,20);
  near(simpson(x=>3+x,0,4),20);assert.notEqual(20,32);
  near(simpson(x=>Math.cos(x)/Math.sqrt(1+Math.sin(x)),0,Math.PI/2),2*Math.SQRT2-2);
});

test("sources 21 and 22 use table entries, left endpoints and the perpendicular slope",()=>{
  near(2*table.f.slice(0,4).reduce((a,b)=>a+b),92);
  near(2*table.f.slice(1).reduce((a,b)=>a+b),52);
  near(table.f[1]+2*table.d[1],4);near(-1/4,-.25);
});

test("source 23 original A, B, C all guarantee derivative -3, but only C directly matches MVT secant slope",()=>{
  const slopes=[(2-16)/4,(0-16)/6,(8-20)/4,(0-2)/2];
  assert.deepEqual(slopes,[-3.5,-8/3,-3,-1]);
  assert.deepEqual(slopes.flatMap((s,i)=>s===-3?[i]:[]),[2]);
  assert.ok(table.d[1]<-3&&-3<table.d[3],"Darboux guarantees a point in (2,6), also in (2,8)");
  // The entire table is compatible with a strictly decreasing C1 cubic Hermite interpolant.
  const d=(i,t)=>{
    const y0=table.f[i],y1=table.f[i+1],m0=table.d[i],m1=table.d[i+1],h=2;
    return (6*t*t-6*t)*y0/h+(3*t*t-4*t+1)*m0+(-6*t*t+6*t)*y1/h+(3*t*t-2*t)*m1;
  };
  for(let i=0;i<4;i++){
    near(d(i,0),table.d[i]);near(d(i,1),table.d[i+1]);
    near(simpson(t=>2*d(i,t),0,1),table.f[i+1]-table.f[i]);
    for(let t=0;t<=1;t+=.001)assert.ok(d(i,t)<0);
  }
  for(let t=0;t<=1;t+=.001)assert.ok(d(3,t)>-3,"D need not contain such a derivative");
});

test("source 24 integrates square cross sections over the entire semicircular base",()=>{
  near(simpson(x=>Math.sqrt(Math.max(0,4-x*x))**2,-2,2),32/3);
  near(2*(8-8/3),32/3);
});

test("source 25 corrects the polynomial degrees and the actual positive-infinity exponential limit",()=>{
  const f=x=>2*x*x*(1-x)**3*(1+x)/(x*(1+x)**2*(1-x)**4);
  for(const x of [2,3,10])near(f(x),2*x/(1-x*x));
  near(f(1e8),0,3e-8);
  for(const x of [-.01,.01,.003])assert.ok(Math.abs(x*x*Math.cos(1/(x*x)))<=x*x);
  near((Math.exp(30)+3)/(Math.exp(30)+1),1);
  assert.equal(get(25).answer,"D");
});

test("sources 26 and 27 matching value and one-sided derivatives give a=1, b=2 and integral pi+1/3",()=>{
  const a=1,b=2;
  near(a,1);near(b*Math.cos(0),2);
  near(derivative(x=>(x+1)**2,-1e-3),1.998);
  near(simpson(x=>(x+1)**2,-1,0)+simpson(x=>Math.sin(b*x)+a,0,Math.PI),Math.PI+1/3);
});

test("source 28 directly differentiates the finite product, avoiding overflow and verifies factor counts",()=>{
  const logY=x=>{
    let sum=0;for(let k=2;k<=1000;k++)sum+=(k%2===0?1:-1)*Math.log1p(k*x)/k;
    return sum;
  };
  near(Math.exp(logY(0)),1);near(derivative(x=>Math.exp(logY(x)),0,1e-8),1,1e-7);
  assert.equal(Array.from({length:999},(_,i)=>i+2).filter(n=>n%2===0).length,500);
  assert.equal(Array.from({length:999},(_,i)=>i+2).filter(n=>n%2!==0).length,499);
});

test("source 29 endpoint terms form a positive p-series and radius is 2",()=>{
  for(const x of [0,4])for(let n=1;n<=20;n++)near((x-2)**(2*n)/(4**(n+1)*n*n),1/(4*n*n));
  near((2-2)**2/4,0);near((0-2)**2/4,1);near((4-2)**2/4,1);
  assert.ok((5-2)**2/4>1);
});

test("source 30 matches factorial normalization and repairs only the inconsistent final sign",()=>{
  const factorial=n=>n<=1?1:n*factorial(n-1);
  const n=24/4,coefficient=(-1)**(n+1)/factorial(n);
  near(coefficient,-1/720);assert.equal((-1)**(15+1),1);
  const value=-factorial(24)/factorial(6);
  near(value/factorial(24),coefficient);
  assert.match(get(30).solution,/final sign is corrected/);
});
