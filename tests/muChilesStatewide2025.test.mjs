import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import katex from "katex";
import {muQuestions} from "../data/questions/mu.ts";
import {alphaQuestions} from "../data/questions/alpha.ts";
import {thetaQuestions} from "../data/questions/theta.ts";
import {muNationalReferences} from "../data/question-references/muNationals.ts";

const batch=muQuestions.filter(q=>q.source?.competition==="2025 Chiles Statewide");
const get=n=>batch[n-1];
const near=(actual,expected,tolerance=1e-7)=>assert.ok(Math.abs(actual-expected)<tolerance,actual+" vs "+expected);
const derivative=(f,x)=>(f(x+1e-5)-f(x-1e-5))/2e-5;
const simpson=(f,a,b,n=20000)=>{
  const h=(b-a)/n;let sum=f(a)+f(b);
  for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+i*h);
  return sum*h/3;
};

test("Chiles retains all 30 originals, corrects two key answers, and preserves consecutive public numbering",()=>{
  assert.equal(batch.length,30);
  assert.equal(batch.map(q=>q.answer).join(""),"DBADBCBBEBEDAEDDBEDADBDDCAEBEC");
  const originalKey="DBADBCBBEBEDAEDDBEDADBDDCAABDC";
  assert.deepEqual(batch.flatMap((q,i)=>q.answer===originalKey[i]?[]:[i+1]),[27,29]);
  for(const [i,q] of batch.entries()){
    assert.equal(q.id,10356+i);
    assert.equal(q.number,234+i);
    assert.deepEqual(q.source,{competition:"2025 Chiles Statewide",event:"Calculus Individual",questionNumber:i+1});
    assert.equal(q.choices.length,5);
    assert.equal(q.choices[4],"NOTA");
    assert.ok(q.solution.length>250);
  }
  assert.equal(new Set(muQuestions.map(q=>q.id)).size,muQuestions.length);
  assert.deepEqual(muQuestions.map(q=>q.number),Array.from({length:muQuestions.length},(_,i)=>i+1));
});

test("labels match established vocabulary and difficulty benchmarks",()=>{
  const benchmarks=[...muQuestions.filter(q=>q.id<10356),...alphaQuestions,...thetaQuestions,...muNationalReferences];
  const topics=new Set(benchmarks.map(q=>q.topic)),methods=new Set(benchmarks.flatMap(q=>q.methods));
  for(const q of batch){
    assert.ok(topics.has(q.topic),q.topic);
    for(const method of q.methods)assert.ok(methods.has(method),method);
  }
  assert.deepEqual(batch.map(q=>q.difficulty),[1,2,1,2,1,2,2,3,2,2,2,2,2,2,3,3,2,2,2,3,3,3,1,4,1,4,4,4,2,4]);
  assert.equal(get(21).difficulty,muNationalReferences.find(q=>q.id===10116).difficulty);
  assert.ok(batch.some(q=>q.methods.length===0));
});

test("every formula compiles and each table question uses the original source crop",()=>{
  for(const q of batch)for(const value of [q.question,...q.choices,q.solution]){
    for(const m of value.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)){
      assert.doesNotThrow(()=>katex.renderToString(m[1]??m[2],{throwOnError:true,displayMode:m[2]!==undefined}),"Source question "+q.source.questionNumber);
    }
    assert.doesNotMatch(value.replace(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g,""),/\\[()[\]]/);
  }
  const png=readFileSync(new URL("../public/questions/mu-360-362-original.svg",import.meta.url));
  assert.match(png.toString("utf8"),new RegExp('width="'+906+'"'));
  assert.match(png.toString("utf8"),new RegExp('height="'+161+'"'));
  for(const n of [5,6,7])assert.equal(get(n).illustration.src,"/questions/mu-360-362-original.svg");
  assert.equal(batch.filter(q=>q.illustration).length,3);
});

test("source ambiguity and notation repairs are explicit and narrowly scoped",()=>{
  assert.match(get(5).question,/fixed chosen preimage/);
  assert.match(get(5).solution,/does not permit a global inverse/);
  assert.match(get(6).solution,/difference-quotient argument/);
  assert.ok(get(9).question.includes(String.raw`n\to\infty`));
  assert.match(get(11).question,/absolute maximum/);
  assert.match(get(16).question,/mathrm\{cm\}\^2/);
  assert.match(get(17).question,/every admissible/);
  assert.match(get(18).question,/extended-real/);
  assert.match(get(20).question,/1\+\\ln y\\ne0/);
  assert.ok(get(23).choices[3].includes(String.raw`\sqrt[4]e+\sqrt[4]{e^3}`));
  assert.match(get(23).solution,/Fourth roots do not distribute/);
  assert.match(get(26).question,/t\^4/);
  assert.match(get(27).solution,/10y\+10/);
  assert.match(get(29).question,/sum/);
  assert.match(get(29).solution,/product, not the printed sum/);
  assert.match(get(30).solution,/incorrect cosecant\/cotangent factors/);
});

test("derivatives, limits, endpoint comparisons and midpoint areas agree independently",()=>{
  near(derivative(x=>Math.tan(x*x)**2,Math.sqrt(Math.PI)/2),4*Math.sqrt(Math.PI),1e-5);
  near(derivative(x=>Math.exp(x)+Math.cos(x)+x,0),2);
  for(const u of [-.4,.2,1])near(derivative(u=>2**(2*u**3-1),u),4**(u**3)*u*u*Math.log(8),1e-5);
  near((-3*4-2*7*1)/16,-13/8);
  const c1=(2-4)/2,c2=2-3-c1;near(c1,-1);near(c2,0);
  near((1-2/1e7)**(-1e7),Math.exp(2),2e-6);
  near(Math.PI/12+(Math.PI/6+1/Math.sqrt(3))*.5,(Math.PI+Math.sqrt(3))/6);
  const f=x=>2*x**3-4*x*x+2*x+1;
  near(Math.max(...[-.5,1/3,1,1.5].map(f)),7/4);
  const x=1e-5;near(Math.tan(x)*Math.sin(2*x)**2/x**3,4);
  near((-14-1/1e7)/(Math.sqrt(2-2/1e7)+Math.sqrt(2+12/1e7+1/1e14)),-7*Math.sqrt(2)/2,1e-6);
  assert.equal(Math.abs(2*0-1)**(2/3),Math.abs(2*1-1)**(2/3));
  near(6*(5/2)*Math.sqrt(3)*4/(5*Math.PI),12*Math.sqrt(3)/Math.PI);
  for(const a of [0,1])near(3*a*a-4*a+a,0);
  assert.ok((Math.log(1+1e-5)-Math.sin(-1e-5))/Math.sin(-1e-5)**2>1e5);
  near(Math.exp(2)*(1.5+1/(2*1e8)),1.5*Math.exp(2));
  near(2*simpson(x=>x*Math.sin(x),0,Math.PI/2)+simpson(x=>x*x*Math.cos(x),0,Math.PI/2),Math.PI**2/4);
  near([.25,.75,1.25,1.75].reduce((s,x)=>s+Math.exp(x)/2,0),[1,3,5,7].reduce((s,k)=>s+Math.pow(Math.exp(k),.25)/2,0));
});

test("distance minimization has the unique global minimum claimed in question 21",()=>{
  const Q=y=>y**4+(y+3)**2;
  near(Q(-1),5);
  for(let i=-1000;i<=1000;i++){
    const y=i/100;
    assert.ok(Q(y)>=5-1e-10);
    near(4*y**3+2*y+6,2*(y+1)*(2*y*y-2*y+3),1e-9);
    assert.ok(2*y*y-2*y+3>0);
  }
});

test("determinant implicit derivative and constant-slope conditions match independent calculations",()=>{
  const det=(x,y)=>x*(x*x+y)-2*(3+x*y)+y*(3*y-x**3*y);
  for(const [x,y] of [[.4,.3],[1,2],[-1,.4]]){
    const gx=derivative(t=>det(t,y),x),gy=derivative(t=>det(x,t),y);
    const listed=-(3*x*x*y*y-3*x*x+y)/(2*x**3*y+x-6*y);
    near(-gx/gy,listed,1e-6);
  }
  for(const a of [-2,0,3])for(const b of [-1,2]){
    const f=x=>a*x+b-a*a;
    near(f(a),b);near(f(b),a*b+b-a*a);
  }
});

test("speeding and slowing durations select only A, including negative time intervals",()=>{
  const r=Math.sqrt(5);
  const slowing=[[-Infinity,-r],[-5/3,-1],[1,r]];
  const speeding=[[-r,-5/3],[-1,1],[r,Infinity]];
  const duration=(pieces,a,b)=>pieces.reduce((sum,[lo,hi])=>sum+Math.max(0,Math.min(b,hi)-Math.max(a,lo)),0);
  const intervals=[[1,(3*r-1)/2],[-r,-1],[-1,2],[-r,(9*r-10)/3]];
  const ratios=intervals.map(([a,b])=>duration(slowing,a,b)/duration(speeding,a,b));
  near(ratios[0],2);
  for(const ratio of ratios.slice(1))assert.ok(Math.abs(ratio-2)>.1);
  for(const t of [-3,-2,-1.5,0,1.5,3]){
    const v=4*(t+1)*(t*t-5),a=4*(3*t+5)*(t-1);
    assert.equal(slowing.some(([lo,hi])=>t>lo&&t<hi),v*a<0);
  }
});

test("corrected ellipse answer satisfies the constraint and global distance bound; source choices do not",()=>{
  const x=2+5/Math.sqrt(17),y=-1+6/Math.sqrt(17);
  near(5*y*y+10*y,-3*x*x+12*x-2);
  near(-3*(x-2)/(5*(y+1)),-.5);
  const d=(6-Math.sqrt(17))/Math.sqrt(5);
  near(Math.abs(x+2*y-6)/Math.sqrt(5),d);
  for(let i=0;i<20000;i++){
    const t=2*Math.PI*i/20000;
    const px=2+Math.sqrt(5)*Math.cos(t),py=-1+Math.sqrt(3)*Math.sin(t);
    assert.ok(Math.abs(px+2*py-6)/Math.sqrt(5)>=d-1e-10);
  }
  for(const choice of [(174+Math.sqrt(15945))/102,(696+Math.sqrt(484418))/408,(348+Math.sqrt(17))/102,(348+Math.sqrt(255118))/102]){
    assert.ok(Math.abs(choice-x)>1e-3);
  }
});

test("radical and cosecant primitives differentiate correctly; printed series diverges while product telescopes",()=>{
  for(const x of [.05,.2,.5,.8,.95]){
    near(derivative(t=>Math.asin(Math.sqrt(t))+Math.sqrt(t-t*t),x),Math.sqrt(1-x)/Math.sqrt(x),1e-5);
  }
  for(const x of [.2,.4,.7,1]){
    const F=t=>Math.log(Math.abs(Math.sin(t+t*t)))-Math.log(Math.abs(1+Math.cos(t+t*t)));
    near(derivative(F,x),(1+2*x)/(Math.cos(x*x)*Math.sin(x)+Math.sin(x*x)*Math.cos(x)),1e-5);
  }
  let sum=0,exponent=0;
  for(let n=1;n<=1000;n++){
    const a=(n+5)*(n+6),term=128**(1/a);
    assert.ok(term>1);
    sum+=term;exponent+=1/a;
  }
  assert.ok(sum>1000);
  near(exponent,1/6-1/1006);
  near(128**(1/6),2*2**(1/6));
});
