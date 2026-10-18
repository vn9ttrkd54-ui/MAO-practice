import assert from "node:assert/strict";
import test from "node:test";
import katex from "katex";
import {muQuestions} from "../data/questions/mu.ts";
import {alphaQuestions} from "../data/questions/alpha.ts";
import {thetaQuestions} from "../data/questions/theta.ts";
import {muNationalReferences} from "../data/question-references/muNationals.ts";

const batch=muQuestions.filter(q=>q.source?.competition==="2025 January Regional");
const get=n=>batch[n-1];
const near=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<tol,a+" vs "+b);
const derivative=(f,x,h=1e-5)=>(f(x+h)-f(x-h))/(2*h);
const second=(f,x,h=1e-3)=>(f(x+h)-2*f(x)+f(x-h))/(h*h);
const integrate=(f,a,b,n=20000)=>{
  const h=(b-a)/n;let sum=f(a)+f(b);
  for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+i*h);
  return sum*h/3;
};

test("January Regional 2025 retains all 30 original-key answers and independent source numbering",()=>{
  assert.equal(batch.length,30);
  assert.equal(batch.map(q=>q.answer).join(""),"BDADCEBACDCEEAAADBDCDAACBBBBCC");
  for(const [i,q] of batch.entries()){
    assert.equal(q.id,10386+i);
    assert.equal(q.number,264+i);
    assert.deepEqual(q.source,{competition:"2025 January Regional",event:"Calculus Individual",questionNumber:i+1});
    assert.equal(q.choices.length,5);
    assert.equal(q.choices[4],"NOTA");
    assert.equal(q.illustration,undefined);
    assert.ok(q.solution.length>350);
  }
  assert.equal(new Set(muQuestions.map(q=>q.id)).size,muQuestions.length);
  assert.deepEqual(muQuestions.map(q=>q.number),Array.from({length:muQuestions.length},(_,i)=>i+1));
});

test("labels reuse established vocabulary and comparable public and held national benchmarks",()=>{
  const references=[...muQuestions.filter(q=>q.id<10386),...alphaQuestions,...thetaQuestions,...muNationalReferences];
  const topics=new Set(references.map(q=>q.topic)),methods=new Set(references.flatMap(q=>q.methods));
  for(const q of batch){
    assert.ok(topics.has(q.topic),q.topic);
    for(const method of q.methods)assert.ok(methods.has(method),method);
  }
  assert.deepEqual(batch.map(q=>q.difficulty),[1,1,1,1,1,2,1,1,1,2,1,2,2,2,2,2,2,2,2,3,2,2,3,3,3,2,3,3,3,3]);
  assert.equal(get(29).difficulty,muQuestions.find(q=>q.id===10376).difficulty);
  assert.equal(get(29).difficulty,muNationalReferences.find(q=>q.id===10116).difficulty);
  assert.deepEqual(get(29).methods,["Distance Formula","First Derivative Test"]);
  assert.deepEqual(get(25).methods,[]);
  assert.ok(batch.every(q=>!q.methods.includes("Integral Properties")));
  assert.ok(!get(12).methods.includes("Trigonometric Substitution"));
  assert.deepEqual(get(12).methods,["Chain Rule","Double-Angle Identity"]);
});

test("all problem, choice and solution formulas compile without broken delimiters",()=>{
  for(const q of batch)for(const value of [q.question,...q.choices,q.solution]){
    for(const m of value.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)){
      assert.doesNotThrow(()=>katex.renderToString(m[1]??m[2],{throwOnError:true,displayMode:m[2]!==undefined}),"Original question "+q.source.questionNumber);
    }
    assert.doesNotMatch(value.replace(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g,""),/\\[()[\]]/);
  }
});

test("degree conversion, original distractors and justified source corrections are explicit",()=>{
  assert.ok(get(6).choices[2].includes(String.raw`\frac{\sqrt[3]{36}}{12}`));
  assert.equal(get(6).answer,"E");
  assert.ok(get(12).question.includes(String.raw`x^\circ`));
  assert.ok(get(12).solution.includes(String.raw`\frac\pi{180}\sin(2x^\circ)`));
  assert.ok(get(13).question.includes(String.raw`\sum_{k=0}^{2024}(k+1)x^k`));
  assert.ok(get(23).question.includes(String.raw`x\ne0`));
  assert.match(get(23).solution,/\(343,0\)/);
  assert.match(get(26).solution,/b=2.*typos/);
  assert.match(get(28).solution,/positive magnitude/);
});

test("elementary derivatives and tangent/normal slopes are independently verified",()=>{
  for(const x of [-2,-.4,.2,1,2]){
    near(derivative(t=>7*t**5,x),35*x**4,1e-5);
    near(derivative(t=>Math.sin(4*t+3),x),4*Math.cos(4*x+3),1e-6);
    near(derivative(t=>-5*Math.cos(t)+5*t,x),5*Math.sin(x)+5,1e-6);
    near(derivative(t=>Math.log(Math.exp(6-t)),x),-1);
    near(derivative(t=>18*t*Math.cbrt(t),x),24*Math.cbrt(x),1e-5);
    const arctanPrime=x*(x+2)*Math.exp(x)/(1+x**4*Math.exp(2*x));
    near(derivative(t=>Math.atan(t*t*Math.exp(t)),x),arctanPrime,1e-6);
  }
  const a=-Math.cbrt(36)/12;near(-1/(4*a**3),12);
  for(const wrong of [-Math.cbrt(3),-Math.cbrt(6)/6,Math.cbrt(36)/12,Math.cbrt(3)]){
    assert.ok(Math.abs(-1/(4*wrong**3)-12)>1);
  }
  near(80/2**3,10);near(derivative(x=>80/x**3,2),-15,1e-6);
  near(-15*2+40,10);
  near(3/(2*Math.sqrt(3*8+1)),3/10);
  near(second(t=>3**(2*t),1),36*Math.log(3)**2,1e-4);
  const tangent=-9*Math.log(3)/(8*Math.log(2));
  near(tangent*(8*Math.log(2)/(9*Math.log(3))),-1);
});

test("limits, degree input and inverse derivative use the correct variables and scaling",()=>{
  near((3*1e9+7)/1e9,3);
  const x=-1e9;
  near((4+3/x-7/x**2-20/x**3)/(6-8/x+5/x**2-12/x**3),2/3);
  for(const degree of [-100,-10,15,90]){
    near(derivative(t=>Math.sin(t*Math.PI/180)**2,degree),Math.PI/180*Math.sin(2*degree*Math.PI/180),1e-9);
  }
  const f=x=>(x**5+x**3)/4;near(f(2),10);
  near(1/derivative(f,2),1/23);
  const asymptote=x=>x>0?(16+20*Math.exp(-x))/(8+4*Math.exp(-x)):(16*Math.exp(x)+20)/(8*Math.exp(x)+4);
  near(asymptote(100),2);near(asymptote(-100),5);
  const F=x=>x**3/(x*x-8);
  near(F(2),-2);near(derivative(F,2),-5,1e-6);
  const n=2025,c=Math.log(2025/2024);
  assert.ok(c>0);
  assert.ok(n*Math.log(1e9)-c*1e9<0);
});

test("power-rule factorials, inflection parity and product derivatives agree with exact algebra",()=>{
  const factorial=n=>n<2?1:n*factorial(n-1);
  for(let n=2;n<=12;n++)for(let k=1;k<n;k++){
    let product=1;for(let j=0;j<k;j++)product*=n-j;
    near(product,factorial(n)/factorial(n-k));
  }
  for(let n=1;n<=10;n++){
    const dd=x=>n===1?2:n*x**(n-2)*((n+1)*x-(n-1));
    assert.equal(dd(-.001)*dd(.001)<0,n>=3&&n%2===1);
  }
  const f=x=>4+x,g=x=>5+2*x,h=x=>6+3*x;
  const j=x=>(f(x)*g(x)*h(x))**2;
  near(derivative(j,0),33120,1e-4);
  // Cubic Taylor polynomials realize all supplied derivatives in question 24.
  const F=[1,3,5/2,10/6],G=[2,4,6/2,25/6];
  const cubicCoefficient=F.reduce((sum,a,i)=>sum+a*G[3-i],0);
  near(6*cubicCoefficient,159);
});

test("cube-root implicit differentiation matches the gradient and identifies the excluded removable point",()=>{
  const H=(x,y)=>Math.cbrt(x)+4*x*y+2*Math.cbrt(y)-7;
  for(const [x,y] of [[1,1],[8,2],[-1,2],[-8,-1]]){
    const numeric=-derivative(t=>H(t,y),x)/derivative(t=>H(x,t),y);
    const listed=-(y*Math.cbrt(x)+12*x*y*y)/(12*x*x*y+2*x*Math.cbrt(y));
    near(numeric,listed,1e-6);
  }
  near(H(1,1),0);
  near(H(343,0),0);
  // y=v^3 desingularizes the cube root at the horizontal-tangent point.
  const x=343,v=0,Fv=12*x*v*v+2;
  assert.notEqual(Fv,0);
  const vPrime=-(1/(3*Math.cbrt(x)**2)+4*v**3)/Fv;
  near(3*v*v*vPrime,0);
});

test("both area integrals and independent lifetime failures give the original probabilities",()=>{
  const a=2/5;
  near(1/(a+1),5/7);near(1/(2*a+1),5/9);
  const density=t=>(2*t+2)**2/84;
  near(integrate(density,0,3),1);
  const p=integrate(density,0,1);near(p,1/9);
  let probability=0;
  for(let mask=0;mask<8;mask++){
    const count=[0,1,2].filter(bit=>mask&(1<<bit)).length;
    if(count>=2)probability+=p**count*(1-p)**(3-count);
  }
  near(probability,25/729);
});

test("ellipse, altitude and lighthouse related rates agree with independent derivatives",()=>{
  near(derivative(t=>Math.sqrt(2*(4+2.5*t)+1),0),5/6);
  const altitude=t=>{
    const a=30+2*t,b=40+3*t;
    return a*b/Math.hypot(a,b);
  };
  near(altitude(0),24);
  near(derivative(altitude,0),209/125,1e-6);
  const thetaAtD=D=>Math.atan(20/D);
  near(derivative(t=>thetaAtD(60+10*t),0),-.05,1e-8);
  near(derivative(t=>thetaAtD(600+10*t),0),-1/1802,1e-9);
});

test("parabola distance and binomial-spinner objective attain their global minima/maxima",()=>{
  const S=x=>x*x+(2*x*x/3-1)**2;
  near(S(Math.sqrt(3/8)),15/16);
  for(let i=-500;i<=500;i++){
    const x=i/100;
    near(S(x),4/9*(x*x-3/8)**2+15/16,1e-9);
    assert.ok(S(x)>=15/16-1e-10);
  }
  const objective=p=>6*p*p*(1-p)**2+4*p**3*(1-p);
  const best=(3-Math.sqrt(3))/2;
  near(8*best**3-24*best*best+12*best,0);
  near(objective(0),0);near(objective(1),0);
  for(let i=0;i<=10000;i++)assert.ok(objective(i/10000)<=objective(best)+1e-12);
});
