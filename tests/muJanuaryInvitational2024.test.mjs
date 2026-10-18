import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import test from "node:test";
import katex from "katex";
import {muQuestions} from "../data/questions/mu.ts";
import {alphaQuestions} from "../data/questions/alpha.ts";
import {thetaQuestions} from "../data/questions/theta.ts";
import {muNationalReferences} from "../data/question-references/muNationals.ts";

const batch=muQuestions.filter(q=>q.source?.competition==="2024 FAMAT January Invitational");
const get=n=>batch.find(q=>q.source.questionNumber===n);
const near=(a,b,tolerance=1e-8)=>assert.ok(Math.abs(a-b)<tolerance,a+" vs "+b);
const derivative=(f,x,h=1e-6)=>(f(x+h)-f(x-h))/(2*h);
const simpson=(f,a,b,n=20000)=>{
  const h=(b-a)/n;let sum=f(a)+f(b);
  for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+i*h);
  return sum*h/3;
};

test("all 30 January Invitational questions have corrected keys, unique IDs, consecutive numbers and original credit",()=>{
  assert.equal(batch.length,30);
  const key="ABCEEADADDBDADEBBCCCABCDADBDEC";
  for(const [i,q] of batch.entries()){
    assert.equal(q.id,10505+i);assert.equal(q.number,382+i);
    assert.deepEqual(q.source,{competition:"2024 FAMAT January Invitational",event:"Calculus Individual",questionNumber:i+1});
    assert.equal(q.answer,key[i],"original source "+(i+1));
    assert.equal(q.choices.length,5);assert.equal(q.choices[4],"NOTA");
    assert.equal(q.illustration,undefined,"the supplied PDFs contain no figures or tables");
  }
  assert.deepEqual(muQuestions.map(q=>q.number),Array.from({length:muQuestions.length},(_,i)=>i+1));
  assert.equal(new Set(muQuestions.map(q=>q.id)).size,muQuestions.length);
});

test("all 381 previously approved records remain unchanged",()=>{
  const old=muQuestions.filter(q=>q.id<10505);
  assert.equal(old.length,381);
  assert.equal(createHash("sha256").update(JSON.stringify(old)).digest("hex"),"79efa94c883b6131adaab4885f769cfe9313376adff8b63ccd6f11fb37b3cb57");
});

test("labels reuse existing vocabulary and calibrated difficulty without misusing Integral Properties",()=>{
  const benchmarks=[...muQuestions.filter(q=>q.id<10505),...alphaQuestions,...thetaQuestions,...muNationalReferences];
  const topics=new Set(benchmarks.map(q=>q.topic)),methods=new Set(benchmarks.flatMap(q=>q.methods));
  for(const q of batch){
    assert.ok(topics.has(q.topic),q.topic);
    for(const method of q.methods)assert.ok(methods.has(method),method);
  }
  assert.deepEqual(batch.map(q=>q.difficulty),[2,2,3,1,2,2,2,2,3,2,4,3,2,2,1,3,3,2,2,1,2,2,2,1,2,2,1,2,3,1]);
  assert.ok(batch.some(q=>q.methods.length===0));
  assert.equal(batch.some(q=>q.methods.includes("Integral Properties")),false);
});

test("every expression compiles strictly and published errata plus additional repairs are present",()=>{
  for(const q of batch)for(const text of [q.question,...q.choices,q.solution]){
    for(const m of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)){
      assert.doesNotThrow(()=>katex.renderToString(m[1]??m[2],{throwOnError:true,displayMode:m[2]!==undefined}),"source "+q.source.questionNumber);
    }
    assert.doesNotMatch(text.replace(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g,""),/\\[()[\]]/);
  }
  assert.ok(get(3).question.includes(String.raw`(-1)^n\sqrt{x^2+nx}`));
  assert.ok(get(21).question.includes(String.raw`xe^{-x}`));
  assert.equal(get(26).answer,"D");assert.equal(get(29).answer,"E");
  assert.equal(get(6).answer,"A");
  assert.match(get(1).question,/sufficiently small nonzero/);
  assert.ok(get(8).question.includes(String.raw`m\ne0`));
  assert.match(get(11).question,/attainable finite real/);
  assert.match(get(11).question,/for every real-valued/);
  assert.match(get(12).question,/a>1/);
  assert.match(get(16).question,/numerical rates/);
  assert.match(get(17).question,/entire real line/);
  assert.match(get(19).question,/local inverse branch/);
  assert.match(get(29).question,/same fixed uniform partition/);
  assert.match(get(29).solution,/counterexample/);
});

test("source 1 logarithmic cancellation holds for either sign and quotient needs its added domain",()=>{
  for(const sign of [-1,1])for(const x of [-.01,.01,.1]){
    const j=sign*Math.exp(x),k=sign*Math.exp(-x);
    const integral=Math.log(Math.abs(j))-Math.log(Math.abs(k));
    near(integral/Math.log(k/j),-1);
    near(simpson(z=>1/z,k,j),integral);
  }
  assert.equal(Math.log(1/1),0);
});

test("source 2 powers have the claimed distinct limits while determined forms are forced",()=>{
  const t=1e6;
  near((1/t)*(-t),-1);near((1/(t*t))*(-t),0,2e-6);
  near(t**0,1);near(t**(1/Math.log(t)),Math.E);
  near((1+1/t)**t,Math.E,2e-6);near(1**t,1);
  assert.equal(-t+t,0);assert.equal(-t+2*t,t);
  assert.ok((-t)/1< -100000);assert.ok(-t*t< -1e11);
  for(const y of [.6,1,1.4])assert.ok(t**y>=Math.sqrt(t));
});

test("source 3 paired radical limits avoid cancellation and sum to 2500",()=>{
  for(const x of [1e10,1e12]){
    let total=0;
    for(let k=1;k<=5000;k++)total+=1/(Math.sqrt(1+2*k/x)+Math.sqrt(1+(2*k-1)/x));
    near(total,2500,x===1e10?.001:.00001);
  }
  assert.equal([...String(2500)].reduce((s,n)=>s+Number(n),0),7);
});

test("sources 4-6 amplitude, composition derivatives and geometric sum select E E A",()=>{
  const maxX=Math.PI/2+Math.atan2(2,3);
  near(3*Math.sin(maxX)-2*Math.cos(maxX),Math.sqrt(13));
  assert.ok(maxX>-2024&&maxX<2024);
  for(let x=-2024;x<2024;x+=.1)assert.ok(3*Math.sin(x)-2*Math.cos(x)<=Math.sqrt(13)+1e-12);
  const f=x=>(1-x)/(1+x);
  for(const x of [-.3,0,.4])near(f(f(x)),x);
  near(derivative(f,0),-2);
  let sum=0;for(let n=1;n<=2024;n++)sum+=n%2?-2:1;
  assert.equal(sum,-1012);
  let geometric=0;for(let n=1;n<=100;n++)geometric+=Math.PI*Math.log(2)**n;
  near(geometric,Math.PI*Math.log(2)/(1-Math.log(2)));
  near((2**.4/Math.log(2))*Math.log(2),2**.4);
});

test("sources 7 and 8 IVT bracket and even-function normal lines are valid and nondegenerate",()=>{
  const F=x=>x**2018+1/Math.sin(x)**2;
  assert.ok(F(.001)>2018&&F(1)<2018);
  for(const p of [.2,1,3]){
    const q=p*p,m=2*p;
    const normal1=x=>q-(x-p)/m,normal2=x=>q+(x+p)/m;
    near(normal1(0),normal2(0));near(normal1(0),q+p/m);
  }
});

test("sources 9 and 10 global viewing optimum and differentiated arctangent limit check",()=>{
  const angle=d=>Math.atan(8/d)-Math.atan(3/d),optimum=Math.sqrt(24);
  for(let d=.01;d<=100;d+=.01)assert.ok(angle(d)<=angle(optimum)+1e-12);
  near(derivative(angle,optimum),0);
  const f=x=>1/(1+x*x);
  for(const h of [-1e-6,1e-6])near((Math.atan(1+h)-Math.atan(1))/h,f(1),1e-6);
  near(-1/derivative(f,1),2);
});

test("source 11 coalescing roots force limits only at the two attainable endpoints",()=>{
  for(const c of [-8,-3,3,8]){
    const plus=(c+Math.sqrt(c*c-4))/2,minus=(c-Math.sqrt(c*c-4))/2;
    near(plus+1/plus,c);near(minus+1/minus,c);assert.notEqual(plus,minus);
  }
  for(const sign of [-1,1]){
    const g=sign*(2+1e-10),disc=Math.sqrt(g*g-4);
    near((g+disc)/2,sign,.00002);near((g-disc)/2,sign,.00002);
  }
});

test("sources 12 and 13 area-angle differentiation and acute tangent-angle formula check",()=>{
  const theta=a=>Math.PI/4-Math.atan(1/(a*a));
  for(const a of [1.2,2,3]){
    const area=simpson(x=>x-x/(a*a),0,1)+simpson(x=>1/x-x/(a*a),1,a);
    near(area,Math.log(a));
    near(derivative(Math.log,a)/derivative(theta,a),1/Math.cos(2*theta(a)),1e-7);
  }
  const m1=derivative(x=>1/x,1),m2=derivative(x=>x*x,1);
  near(Math.abs((m2-m1)/(1+m1*m2)),3);
});

test("sources 14 and 15 cube difference limit and logarithmic derivative check",()=>{
  for(const x of [1e7,1e9]){
    const a=Math.cbrt(8+5/x);
    near(5/(a*a+2*a+4),5/12,1e-8);
  }
  near(derivative(x=>Math.log(x+Math.sqrt(x*x+1)),4),1/Math.sqrt(17));
  const distractors=[2*Math.sqrt(15),2*Math.sqrt(15)/15,4*Math.sqrt(15)/15,(35-9*Math.sqrt(15))/10];
  for(const value of distractors)assert.ok(Math.abs(value-1/Math.sqrt(17))>1e-4);
});

test("sources 16 and 17 prism numerical rates and global monotone-cubic maximum check",()=>{
  const s=(12+8*Math.sqrt(3))/9,growth=.7;
  near(9*Math.sqrt(3)*s*s*growth/2,(12+6*Math.sqrt(3))*s*growth);
  for(const c of [12,13,30]){
    const d=20-2*c,f=x=>x**3-6*x*x+c*x+d;
    near(f(2),4);assert.ok(d<=-4);
    for(let x=-20;x<=20;x+=.1)assert.ok(3*x*x-12*x+c>=-1e-9);
  }
  near((2-2)**3+4,4);near((0-2)**3+4,-4);
});

test("sources 18-20 distance rate, local inverse derivative and cube-root linearization check",()=>{
  const r=t=>Math.hypot(t*t/2,t**4/4);
  near(derivative(r,1),3/Math.sqrt(5));
  const f=x=>3*x**7+2*x**3-x-1;
  near(f(-1),-5);near(derivative(f,-1),26,1e-7);
  const g=y=>{let x=-1;for(let i=0;i<10;i++)x-=(f(x)-y)/(21*x**6+6*x*x-1);return x;};
  near(derivative(g,-5),1/26);
  assert.ok(21*0**6+6*0**2-1<0);
  near(4+(63-64)/(3*64**(2/3)),191/48);
  assert.ok(191/48>Math.cbrt(63));
});

test("sources 21-23 derivative induction, cone outflow and locally constant floor values check",()=>{
  for(let n=0;n<12;n++){
    const f=x=>(-1)**n*(x-n)*Math.exp(-x);
    near(derivative(f,.7),(-1)**(n+1)*(.7-n-1)*Math.exp(-.7));
  }
  near((-1)**2024*(.5-2024)*Math.exp(-.5),(.5-2024)*Math.exp(-.5));
  near(derivative(h=>Math.PI*h**3/48,4)*(-2/Math.PI),-2,1e-7);
  let sum=0;
  for(let n=1;n<=100;n++){
    for(const delta of [-.49,-.1,0,.1,.49])assert.equal(Math.floor(n+delta+.5),n);
    near(derivative(t=>Math.floor(t+.5),n),0);sum+=n;
  }
  assert.equal(sum,5050);
});

test("sources 24-26 radical limit, exact Newton updates and focal-separation derivative check",()=>{
  for(const x of [1e7,1e9])near((2+7/x)/(Math.sqrt(2+1/x+7/(x*x))+Math.sqrt(2-1/x)),Math.SQRT1_2,3e-7);
  const f=x=>x**3-x+1,df=x=>3*x*x-1;
  const x1=-1-f(-1)/df(-1),x2=x1-f(x1)/df(x1);
  near(x1,-3/2);near(x2,-31/23);
  const separation=t=>2*Math.sqrt((5+t/2)**2-(3-t/3)**2);
  near(separation(0),8);near(derivative(separation,0),7/4);
});

test("sources 27 and 28 a compatible car motion and exact Laurent expansion confirm the keys",()=>{
  const v=t=>45+200*t-420*t*t;
  near(v(0),45);near(v(.5),40);near(simpson(v,0,.5),30);assert.ok(v(.25)>50);
  const terms=new Map();let choose=1;
  for(let k=0;k<=9;k++){
    if(k>0)choose=choose*(10-k)/k;
    terms.set(3*k-9,choose*2**(9-k));
  }
  assert.equal(terms.get(6),2016);
  const derivativeTerms=new Map([...terms].map(([power,coefficient])=>[power-1,power*coefficient]));
  assert.equal(derivativeTerms.get(5),12096);
  for(const x of [.8,1.2])near([...terms].reduce((sum,[p,c])=>sum+c*x**p,0),(2/x+x*x)**9,1e-7);
});

test("source 29 smooth counterexample satisfies all quadrature data but defeats every offered necessity",()=>{
  const f=x=>{const t=x-1;return 3-2*t+t*t+.1*Math.sin(4*Math.PI*t);};
  const df=x=>-2+2*(x-1)+.4*Math.PI*Math.cos(4*Math.PI*(x-1));
  const ddf=x=>2-1.6*Math.PI**2*Math.sin(4*Math.PI*(x-1));
  near(f(1),3);near(f(2),2);near(simpson(f,1,2),7/3);
  assert.ok(f(2)<7/3&&f(1)>7/3&&(f(1)+f(2))/2>7/3);
  assert.ok(df(1.5)>0&&df(1.25)<0);assert.ok(ddf(1.125)<0&&ddf(1.375)>0);
  for(let x=1;x<=2;x+=.001)assert.ok(f(x)>=1.9);
  for(const x of [1.125,1.25,1.5])near(derivative(f,x),df(x));
});

test("source 30 is eventually the constant -1 with nonzero denominator",()=>{
  for(const x of [3.001,4,10,1000]){
    const denominator=Math.abs(x-3)-Math.abs(x-2);
    near(denominator,-1);near((Math.abs(x*x+2)-Math.abs(x*x+1))/denominator,-1);
  }
});
