import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import katex from "katex";
import {muQuestions} from "../data/questions/mu.ts";
import {alphaQuestions} from "../data/questions/alpha.ts";
import {thetaQuestions} from "../data/questions/theta.ts";
import {muNationalReferences} from "../data/question-references/muNationals.ts";

const batch=muQuestions.filter(q=>q.source?.competition==="2025 February King Statewide");
const get=n=>batch.find(q=>q.source.questionNumber===n);
const near=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<tol,a+" vs "+b);
const derivative=(f,x,h=1e-5)=>(f(x+h)-f(x-h))/(2*h);
const second=(f,x,h=1e-4)=>(f(x+h)-2*f(x)+f(x-h))/(h*h);
const simpson=(f,a,b,n=10000)=>{
  const h=(b-a)/n;let sum=f(a)+f(b);
  for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+i*h);
  return sum*h/3;
};
const graph=t=>{
  if(t<0||t>7)return 0;
  if(t<=1)return t;
  if(t<=2)return Math.sqrt(Math.max(0,1-(t-1)**2));
  if(t<=3)return 2-t;
  if(t<=4)return -1;
  if(t<=5)return t-5;
  return Math.sqrt(Math.max(0,1-(t-6)**2));
};

test("King corrected disputes 17,18,23 are retained and officially thrown-out question 30 is excluded",()=>{
  assert.equal(batch.length,29);
  assert.equal(batch.map(q=>q.answer).join(""),"DDACEABCBDDCDADAEEABDBAACEBCB");
  assert.deepEqual(batch.map(q=>q.source.questionNumber),Array.from({length:29},(_,i)=>i+1));
  assert.equal(get(30),undefined);
  assert.equal(get(17).answer,"E");
  assert.equal(get(18).answer,"E");
  assert.equal(get(23).answer,"A");
  for(const [i,q] of batch.entries()){
    assert.equal(q.id,10416+i);
    assert.equal(q.number,294+i);
    assert.deepEqual(q.source,{competition:"2025 February King Statewide",event:"Calculus Individual",questionNumber:i+1});
    assert.equal(q.choices.length,5);
    assert.equal(q.choices[4],"NOTA");
    assert.ok(q.solution.length>450);
  }
  assert.equal(new Set(muQuestions.map(q=>q.id)).size,muQuestions.length);
  assert.deepEqual(muQuestions.map(q=>q.number),Array.from({length:muQuestions.length},(_,i)=>i+1));
});

test("all labels exist already, basic interval rules retain their specific label, and difficulty matches benchmarks",()=>{
  const references=[...muQuestions.filter(q=>q.id<10416),...alphaQuestions,...thetaQuestions,...muNationalReferences];
  const topics=new Set(references.map(q=>q.topic)),methods=new Set(references.flatMap(q=>q.methods));
  for(const q of batch){
    assert.ok(topics.has(q.topic),q.topic);
    for(const method of q.methods)assert.ok(methods.has(method),method);
  }
  assert.deepEqual(batch.map(q=>q.difficulty),[2,2,2,3,1,2,2,2,2,2,2,2,2,3,2,2,3,2,2,2,1,3,3,3,3,2,2,3,2]);
  assert.deepEqual(batch.filter(q=>q.methods.includes("Integral Properties")).map(q=>q.source.questionNumber),[21]);
  assert.equal(get(25).difficulty,muNationalReferences.find(q=>q.id===10076).difficulty);
  assert.equal(get(24).difficulty,3);
  assert.ok(batch.some(q=>q.methods.length===0));
});

test("every mathematical expression compiles and all three graph questions reuse the exact original image",()=>{
  for(const q of batch)for(const value of [q.question,...q.choices,q.solution]){
    for(const m of value.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)){
      assert.doesNotThrow(()=>katex.renderToString(m[1]??m[2],{throwOnError:true,displayMode:m[2]!==undefined}),"Original "+q.source.questionNumber);
    }
    assert.doesNotMatch(value.replace(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g,""),/\\[()[\]]/);
  }
  const png=readFileSync(new URL("../public/questions/mu-442-444-original.png",import.meta.url));
  assert.equal(png.readUInt32BE(16),290);
  assert.equal(png.readUInt32BE(20),153);
  for(const n of [27,28,29])assert.equal(get(n).illustration.src,"/questions/mu-442-444-original.png");
  assert.equal(batch.filter(q=>q.illustration).length,3);
  assert.ok(get(28).question.includes(String.raw`F(x)=\int_5^{3x}f(t)\,dt`));
});

test("source repairs resolve undefined sampling, additive constants and maximal concavity without changing valid distractors",()=>{
  assert.match(get(5).solution,/may be undefined or assigned/);
  assert.match(get(17).solution,/I, II, V/);
  assert.match(get(18).solution,/split at that interior singularity/);
  assert.match(get(20).solution,/783\.8095/);
  assert.match(get(22).solution,/monotonicity.*not concavity alone/);
  assert.match(get(23).question,/probability proportional to its area/);
  assert.match(get(23).question,/Overlapping regions are counted separately/);
  assert.ok(get(24).choices[0].includes(String.raw`\frac{e^x+C}{x^3}`));
  assert.equal(get(25).choices[0],get(25).choices[3]);
  assert.equal(get(26).choices[1],get(26).choices[3]);
  assert.ok(get(28).choices[2].includes(String.raw`(\frac43,2)`));
  assert.match(get(28).solution,/strictly increasing across/);
  assert.ok(get(29).solution.includes(String.raw`k=\frac\pi2-\frac32`));
});

test("elementary derivatives, implicit slope, antiderivative and finite limit are independently checked",()=>{
  const q=x=>(4*x*x+5*x+4)/(x+1);
  near(q(-.25),4);
  near(q(1e8)-(4*1e8+1),0,1e-7);
  near(((-5)*(2*6+3)-2*3*8)/25,-123/25);
  near(simpson(x=>(x+2)/(x*x+1),-1,1),Math.PI);
  const H=(x,y)=>x*Math.sin(Math.PI*y)+Math.exp(y)-Math.tan(x+1)-Math.exp(-x);
  near(H(-1,1),0);
  const slope=-derivative(x=>H(x,1),-1)/derivative(y=>H(-1,y),1);
  near(slope,(1-Math.E)/(Math.PI+Math.E),1e-6);
  // The supplied limit is compatible with an arbitrary, discontinuous value at 6.
  const g=x=>x===6?123:-12+9*(x-6);
  near((g(6.0001)+12)/.0001,9);
  assert.equal(g(6),123);
  near(5*7,35);near(7/2,3.5);
  near(-1/(1+1),-.5);
  const m=10/Math.E,b=-14/Math.E;
  near(Math.E*(m+b),-4);near(Math.E*(2*m+b),6);
  assert.ok(5*Math.exp(0)-8<0&&5*Math.E+1-8>0);
  near(-Math.cos(Math.PI/6)/(1-Math.sin(Math.PI/6))/Math.cos(Math.PI/6),-2);
});

test("Riemann limit, accumulated-integral maximum, exponential limit and nested derivatives agree",()=>{
  near(simpson(x=>x**-2,1,2),.5);
  const f=x=>-(x+3)*(x-1)**2*(x-4);
  for(const x of [-2,0,2,3.99])assert.ok(f(x)>0);
  for(const x of [4.01,5,8])assert.ok(f(x)<0);
  near(f(1),0);near(f(4),0);
  near(Math.exp(Math.log(1.000001)/(1-1.000001)),Math.exp(-1),1e-6);
  const g=x=>Math.exp(Math.exp(x)+Math.exp(-x));
  near(second(g,Math.log(2)),19/4*Math.exp(5/2),1e-5);
  const u=x=>-x+x*x,v=x=>x*u(x*x+4*x-21);
  near(derivative(v,3),-30,1e-5);
  const velocity=t=>(t*t+t-2)*Math.abs(t*t+t-12);
  assert.ok(velocity(.99)<0&&velocity(1.01)>0);
  assert.ok(velocity(2.99)>0&&velocity(3.01)>0);
});

test("disputed jump-function derivative limit exists but its two-sided function limit does not",()=>{
  const f=x=>Math.abs(3-x)/(9-x*x);
  near(f(3-1e-5),1/6,1e-6);near(f(3+1e-5),-1/6,1e-6);
  near(derivative(f,3.001),1/6.001**2,1e-7);
  near(1/(3+3)**2,1/36);
});

test("disputed integral has an interior pole and both split integrals diverge positively",()=>{
  const F=t=>-2/Math.sin(t)+Math.tan(t);
  let lastLeft=0,lastRight=0;
  for(const eps of [.1,.01,.001,.0001]){
    const left=F(Math.PI/2-eps)-F(Math.PI/4);
    const right=F(2*Math.PI/3)-F(Math.PI/2+eps);
    assert.ok(left>lastLeft&&right>lastRight);
    lastLeft=left;lastRight=right;
  }
  assert.ok(lastLeft>9000&&lastRight>9000);
  near(derivative(x=>Math.atan(Math.sinh(x)),Math.log(3)),3/5);
});

test("rate accumulation, elementary integral properties and quadrature classification are exact",()=>{
  near(128/3+4096/7+156,16460/21);
  assert.equal(Math.round(16460/21),784);
  // A constant f=2/3 realizes the supplied integral constraint.
  const f=()=>2/3,q=simpson(f,1,8);
  near(simpson(x=>2*f(x),4,1),-4);
  near(simpson(f,4,8),q-2);
  const curve=x=>(x-2)**2+5,dx=.5;
  const left=dx*[3,3.5,4,4.5].reduce((s,x)=>s+curve(x),0);
  const right=dx*[3.5,4,4.5,5].reduce((s,x)=>s+curve(x),0);
  const mid=dx*[3.25,3.75,4.25,4.75].reduce((s,x)=>s+curve(x),0);
  const trap=(left+right)/2;
  const simp=dx/3*(curve(3)+4*curve(3.5)+2*curve(4)+4*curve(4.5)+curve(5));
  near(left,67/4);near(right,83/4);near(mid,149/8);near(trap,75/4);near(simp,56/3);
  assert.equal([left,right,mid,trap,simp].filter(v=>v>56/3+1e-9).length,2);
});

test("corrected conditional sampling uses summed labeled areas rather than their geometric union",()=>{
  const area=n=>1/(n+1);
  near(area(4)/(area(2)+area(4)+area(6)),21/71);
  near(area(4)/area(2),3/5);
  assert.notEqual(21/71,3/5);
  const total=[2,3,4,5,6].reduce((s,n)=>s+area(n),0);
  const pEven=(area(2)+area(4)+area(6))/total,pQuartic=area(4)/total;
  near(pQuartic/pEven,21/71);
});

test("corrected linear ODE, particular solution and missing exponential-series term satisfy original equations",()=>{
  for(const x of [-2,-.5,.4,1,2]){
    for(const C of [-3,0,5]){
      const y=x=>(Math.exp(x)+C)/x**3;
      near(derivative(y,x)+3*y(x)/x,Math.exp(x)/x**3,1e-5);
    }
    const z=x=>4-4*Math.exp(1/x-1);
    near(x*x*derivative(z,x)+z(x),4,1e-5);
    let sum=0,term=1;
    for(let n=1;n<=80;n++){term*=(4-x*x)/n;sum+=term;}
    near(sum,Math.exp(4-x*x)-1,1e-7);
  }
  near(4-4*Math.exp(1-1),0);
  const incorrect=x=>Math.exp(x+1)/x**3;
  assert.ok(Math.abs(derivative(incorrect,1)+3*incorrect(1)-Math.E)>1);
});

test("graph accumulation gives tangent value, original-source constant and correct concavity across the join",()=>{
  near(graph(4.5),-.5);
  near(simpson(graph,5,4.5),1/8);
  near(3*graph(4.5),-1.5);
  near(12*1.5+8*(1/8),19);
  const integral=simpson(graph,0,1)+simpson(graph,1,2)+simpson(graph,2,3)+simpson(graph,3,4)+simpson(graph,4,5)+simpson(graph,5,6);
  near(integral,Math.PI/2-1.5,1e-6);
  const k=Math.PI-3-integral;
  near(k,Math.PI/2-1.5,1e-6);
  near(k+.5,(Math.PI-2)/2,1e-6);
  const Fprime=x=>3*graph(3*x);
  // Positive slopes on each arc/segment, and increasing first derivative through x=5/3.
  for(const x of [.1,1.4,1.6,1.7,1.9])assert.ok(derivative(Fprime,x)>0);
  for(const x of [.5,.8,2.1,2.2])assert.ok(derivative(Fprime,x)<0);
  const join=5/3,eps=1e-5;
  assert.ok(Fprime(join-eps)<Fprime(join));
  assert.ok(Fprime(join)<Fprime(join+eps));
});
