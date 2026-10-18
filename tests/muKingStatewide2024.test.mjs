import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import test from "node:test";
import katex from "katex";
import {muQuestions} from "../data/questions/mu.ts";
import {alphaQuestions} from "../data/questions/alpha.ts";
import {thetaQuestions} from "../data/questions/theta.ts";
import {muNationalReferences} from "../data/question-references/muNationals.ts";

const batch=muQuestions.filter(q=>q.source?.competition==="2024 February King Statewide");
const originals=Array.from({length:30},(_,i)=>i+1).filter(n=>![12,25,28].includes(n));
const get=n=>batch.find(q=>q.source.questionNumber===n);
const near=(a,b,tolerance=1e-8)=>assert.ok(Math.abs(a-b)<tolerance,a+" vs "+b);
const derivative=(f,x,h=1e-5)=>(f(x+h)-f(x-h))/(2*h);
const simpson=(f,a,b,n=20000)=>{
  const h=(b-a)/n;let s=f(a)+f(b);
  for(let i=1;i<n;i++)s+=(i%2?4:2)*f(a+i*h);
  return s*h/3;
};
const factorial=n=>n<=1?1:n*factorial(n-1);

test("King 2024 excludes exactly three official throw-outs and retains all corrected disputes",()=>{
  assert.equal(batch.length,27);
  assert.deepEqual(batch.map(q=>q.source.questionNumber),originals);
  assert.equal(batch.map(q=>q.answer).join(""),"CBDABBDACCEABCACBDBDBADBCDE");
  for(const n of [12,25,28])assert.equal(get(n),undefined);
  assert.equal(get(11).answer,"E");assert.equal(get(29).answer,"D");assert.equal(get(30).answer,"E");
  for(const [i,q] of batch.entries()){
    assert.equal(q.id,10595+i);assert.equal(q.number,472+i);
    assert.deepEqual(q.source,{competition:"2024 February King Statewide",event:"Calculus Individual",questionNumber:originals[i]});
    assert.equal(q.choices.length,5);assert.equal(q.choices[4],"NOTA");
    assert.equal(q.illustration,undefined,"no source question or solution diagrams");
  }
  assert.deepEqual(muQuestions.map(q=>q.number),Array.from({length:muQuestions.length},(_,i)=>i+1));
  assert.equal(new Set(muQuestions.map(q=>q.id)).size,muQuestions.length);
});

test("all 471 earlier approved records remain unchanged",()=>{
  const old=muQuestions.filter(q=>q.id<10595);
  assert.equal(old.length,471);
  assert.equal(createHash("sha256").update(JSON.stringify(old)).digest("hex"),"9fcc56cdd09bb574c5d9d5331779f05331895f263e3c0a77fc907a7421d95774");
});

test("labels reuse existing vocabulary and difficulty tracks actual mathematical work",()=>{
  const refs=[...muQuestions.filter(q=>q.id<10595),...alphaQuestions,...thetaQuestions,...muNationalReferences];
  const topics=new Set(refs.map(q=>q.topic)),methods=new Set(refs.flatMap(q=>q.methods));
  for(const q of batch){assert.ok(topics.has(q.topic),q.topic);for(const m of q.methods)assert.ok(methods.has(m),m);}
  assert.deepEqual(batch.map(q=>q.difficulty),[1,2,2,1,2,1,2,2,2,2,2,2,2,2,2,2,2,2,1,3,1,1,2,3,3,3,3]);
  assert.equal(batch.some(q=>q.methods.includes("Integral Properties")),false);
  assert.deepEqual(get(10).methods,["U-Substitution"]);
  assert.deepEqual(get(26).methods,["Symmetry"]);
  assert.ok(batch.some(q=>q.methods.length===0));
});

test("all formulas compile strictly and missing assumptions and corrected working are disclosed",()=>{
  for(const q of batch)for(const text of [q.question,...q.choices,q.solution]){
    for(const m of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g))
      assert.doesNotThrow(()=>katex.renderToString(m[1]??m[2],{throwOnError:true,displayMode:m[2]!==undefined}),"source "+q.source.questionNumber);
    assert.doesNotMatch(text.replace(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g,""),/\\[()[\]]/);
  }
  assert.match(get(11).question,/conclusion/);
  assert.match(get(16).question,/series in parentheses means/);
  assert.ok(get(21).question.includes(String.raw`n\ge3`));
  assert.match(get(21).solution,/source omits E/);
  assert.match(get(30).question,/including a singleton/);
  assert.match(get(30).question,/two nonempty piles/);
});

test("sources 1 and 2 product derivative and global minimum independently check",()=>{
  const cubic=x=>(x-1)*(x-2)*(x-3);
  near(derivative(cubic,4),11,1e-7);
  const f=x=>x*Math.exp(x);
  near(f(-1),-1/Math.E);near(derivative(f,-1),0);
  for(let x=-20;x<10;x+=.01)assert.ok(f(x)>=-1/Math.E-1e-12);
});

test("source 3 differentiates the actual circumference and area with the required pi",()=>{
  const r=t=>2+1.5*t;
  near(derivative(t=>2*Math.PI*r(t),0),3*Math.PI);
  near(derivative(t=>Math.PI*r(t)**2,0),6*Math.PI);
});

test("sources 4-7 factorization, nested chain rule, exponential limit and absolute values check",()=>{
  for(const x of [.3,.9,1.1,2])near(x**3-3*x+2,(x-1)**2*(x+2));
  const f=x=>x*Math.sin(Math.cos(x));
  for(const x of [.2,1.3,3])near(derivative(f,x),Math.sin(Math.cos(x))-x*Math.cos(Math.cos(x))*Math.sin(x));
  const n=1e6;near(Math.exp(3*n*Math.log1p(1/(3*n))),Math.E,1e-6);
  near(derivative(x=>Math.abs(3-x)+Math.abs(5+x)+Math.abs(7-2*x),5),4);
});

test("source 8 has the claimed unique maximum on its open interval",()=>{
  const area=x=>.5*x*(1-x)**2*Math.sin(Math.PI/6);
  near(area(1/3),1/27);near(derivative(area,1/3),0);
  for(let x=.0001;x<1;x+=.0001)assert.ok(area(x)<=1/27+1e-12);
});

test("sources 9 and 10 tangent intercept and transformed integral agree with independent evaluation",()=>{
  const f=x=>x**3+5*x*x-8*x+13;
  near(f(1),11);near(derivative(f,1),5);
  near(5*(-6/5-1)+11,0);
  near(simpson(x=>x*(1-x*x)**10,0,1),1/22);
});

test("source 11 corrects the MVT average slope and none of the numerical choices works",()=>{
  const slope=(Math.cbrt(27)-Math.cbrt(0))/27,c=3*Math.sqrt(3);
  near(slope,1/9);near(1/(3*c**(2/3)),slope);
  near(derivative(Math.cbrt,c),slope);
  assert.ok(c>0&&c<27);
  for(const wrong of [1/Math.sqrt(27),1/Math.cbrt(9),1/3,1])assert.ok(Math.abs(1/(3*wrong**(2/3))-slope)>.01);
});

test("sources 13 and 14 sphere rates and simplified trigonometric derivative check",()=>{
  const r=8,rdot=3/(8*r);
  near(8*Math.PI*r*rdot,3*Math.PI);near(4*Math.PI*r*r*rdot,12*Math.PI);
  for(const x of [.2,1,2.5])near(derivative(x=>Math.sin(x)**4-Math.cos(x)**4,x),2*Math.sin(2*x));
});

test("source 15 cancellation is necessary and sufficient, not an unsupported reverse L'Hopital inference",()=>{
  for(const b of [-10,-.3,0,3])for(const x of [-.1,.1,.7]){
    const c=-b,a=50;
    near((a*x*x+Math.sin(b*x)+Math.sin(c*x))/(5*x*x),10);
  }
  const q=x=>(50*x*x+Math.sin(2*x)+Math.sin(3*x))/(5*x*x);
  assert.ok(q(1e-5)>90000);assert.ok(q(-1e-5)<-90000);
});

test("source 16 entire infinite tail sums to (1-1/n)^-2 before taking the limit",()=>{
  for(const n of [2,3,10,50]){
    let sum=0;for(let k=0;k<1000;k++)sum+=(k+1)/n**k;
    near(sum,(1-1/n)**-2);
  }
  const n=1e7;near(-2*n*Math.log1p(-1/n),2,2e-7);
});

test("sources 17 and 18 compose before integrating and use the perpendicular normal slope",()=>{
  const f=u=>u*u-8*u,F=x=>f(3*x*x+6);
  for(const x of [6,7,10]){
    near(2*(3*x*x+6)-8,6*x*x+4);
    near(F(x),9*x**4+12*x*x-12);
    near(derivative(F,x),36*x**3+24*x,.001);
  }
  const curve=x=>(x*x+3*x+2)/(x-1);
  near(curve(3),10);near(derivative(curve,3),-.5);near(-1/(-.5),2);
  near(2*3-10+4,0);
});

test("sources 19 and 20 logarithmic differentiation and two-sided piecewise limit check",()=>{
  const f=x=>Math.exp(Math.exp(x)*Math.log(Math.log(x)));
  near(f(Math.E),1);near(derivative(f,Math.E),Math.exp(Math.E-1),1e-6);
  near(6*2+2,14);near(3*2**2+2,14);assert.notEqual(24,14);
});

test("source 21 general repeated derivative holds and n=1,2 would duplicate C and D",()=>{
  // Represent each derivative as A*x^p*ln(x)+B*x^p, then differentiate exactly.
  for(let n=0;n<=12;n++){
    let a=1,b=0,p=n;
    for(let k=0;k<=n;k++){const nextB=a+b*p;a*=p;b=nextB;p--;}
    near(a,0);near(b,factorial(n));assert.equal(p,-1);
    for(const x of [.2,1,3])near(a*x**p*Math.log(x)+b*x**p,factorial(n)/x,1e-5);
    if(n>=3)assert.notEqual(n,factorial(n));
  }
  assert.equal(factorial(1),1);assert.equal(factorial(2),2);
});

test("sources 22 and 23 derivative cycle and reversed derivative quotient check",()=>{
  near(Math.cos(.7+10*Math.PI/2),-Math.cos(.7));
  const h=1e-6;near((8-2**(3+h))/h,-Math.log(256),3e-6);
  const correct=-8*Math.log(2);
  for(const value of [8*Math.log(2),-2*Math.log(8),-4*Math.log(24)])assert.ok(Math.abs(value-correct)>.1);
});

test("source 24 uses the volume-to-area rate ratio in the stated order",()=>{
  const x=3,xdot=2;
  near(6*x*x,54);near(3*x*x*xdot,54);near(12*x*xdot,72);
  near((3*x*x*xdot)/(12*x*xdot),.75);
});

test("source 26 reflection identity and actual quadrature both give 1",()=>{
  const f=x=>Math.cos(x)/(1+Math.exp(x));
  for(let x=-1.5;x<=1.5;x+=.01)near(f(x)+f(-x),Math.cos(x));
  near(simpson(f,-Math.PI/2,Math.PI/2),1);
});

test("source 27 series and an independent endpoint-regularized improper integral agree",()=>{
  let sum=0;for(let n=1;n<=100000;n++)sum-=1/(12*n*n);
  near(sum,-(Math.PI**2)/72,1e-6);
  // u=x^12 then u=1-exp(-t) turns the integral into -1/12*int t/(exp(t)-1) dt.
  const f=t=>t===0?1:t/Math.expm1(t);
  near(-simpson(f,0,40)/12,-(Math.PI**2)/72);
});

test("source 29 positive square roots sum to 3, not 1, and the transformed integral is 3pi/2",()=>{
  const numerator=x=>Math.sqrt(Math.sin(x)**4+4*Math.cos(x)**2)+Math.sqrt(Math.cos(x)**4+4*Math.sin(x)**2);
  for(let x=-10;x<=10;x+=.01)near(numerator(x),3);
  near(simpson(t=>numerator(Math.sin(t)),0,Math.PI/2),3*Math.PI/2);
});

test("source 30 simulates legal finite constructions for all four choices including singleton removal",()=>{
  const run=n=>{
    const piles=[1679];let moves=0,singletonRemovals=0;
    const turn=(discardIndex,splitIndex,size)=>{
      const stones=piles.reduce((a,b)=>a+b,0);
      if(--piles[discardIndex]===0){piles.splice(discardIndex,1);singletonRemovals++;}
      const m=piles[splitIndex];
      assert.ok(Number.isInteger(size)&&size>0&&size<m,"two nonempty parts");
      piles.splice(splitIndex,1,size,m-size);moves++;
      assert.ok(piles.every(x=>x>0));assert.equal(piles.reduce((a,b)=>a+b,0),stones-1);
    };
    if(n===8){
      turn(0,0,1);
      for(let i=0;i<5;i++)turn(0,0,1);
      assert.deepEqual(piles,[1,1672]);
      turn(0,0,8);assert.deepEqual(piles,[8,1664]);
    }
    while(piles.at(-1)>n)turn(piles.length-1,piles.length-1,n);
    assert.ok(piles.every(x=>x===n));
    assert.equal(piles.reduce((a,b)=>a+b,0),1679-moves);
    return {count:piles.length,moves,singletonRemovals};
  };
  assert.deepEqual(run(6),{count:240,moves:239,singletonRemovals:0});
  assert.deepEqual(run(7),{count:210,moves:209,singletonRemovals:0});
  assert.deepEqual(run(8),{count:186,moves:191,singletonRemovals:6});
  assert.deepEqual(run(9),{count:168,moves:167,singletonRemovals:0});
});
