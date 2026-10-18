import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import test from "node:test";
import katex from "katex";
import {muQuestions} from "../data/questions/mu.ts";
import {alphaQuestions} from "../data/questions/alpha.ts";
import {thetaQuestions} from "../data/questions/theta.ts";
import {muNationalReferences} from "../data/question-references/muNationals.ts";

const batch=muQuestions.filter(q=>q.source?.competition==="2024 February Regional");
const get=n=>batch.find(q=>q.source.questionNumber===n);
const near=(a,b,tolerance=1e-8)=>assert.ok(Math.abs(a-b)<tolerance,a+" vs "+b);
const derivative=(f,x,h=1e-6)=>(f(x+h)-f(x-h))/(2*h);
const simpson=(f,a,b,n=20000)=>{
  const h=(b-a)/n;let sum=f(a)+f(b);
  for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+i*h);
  return sum*h/3;
};

test("all 30 February Regional 2024 questions retain source numbers and correct five erroneous keys",()=>{
  assert.equal(batch.length,30);
  const sourceKey=["CEABC","DBDAC","ACBAB","CDACB","DBDAB","DACDC"].join("");
  const correctedKey="CEABCDBDAEACBABCEACBEBDAEDACDD";
  assert.equal(sourceKey.length,30);assert.equal(correctedKey.length,30);
  const changed=[];
  for(const [i,q] of batch.entries()){
    assert.equal(q.id,10565+i);assert.equal(q.number,442+i);
    assert.deepEqual(q.source,{competition:"2024 February Regional",event:"Calculus Individual",questionNumber:i+1});
    assert.equal(q.answer,correctedKey[i]);
    if(q.answer!==sourceKey[i])changed.push(i+1);
    assert.equal(q.choices.length,5);assert.equal(q.choices[4],"NOTA");
    assert.equal(q.illustration,undefined,"no figures or tables occur in these PDFs");
  }
  assert.deepEqual(changed,[10,17,21,25,30]);
  assert.deepEqual(muQuestions.map(q=>q.number),Array.from({length:muQuestions.length},(_,i)=>i+1));
  assert.equal(new Set(muQuestions.map(q=>q.id)).size,muQuestions.length);
});

test("all 441 previously approved records remain unchanged",()=>{
  const old=muQuestions.filter(q=>q.id<10565);
  assert.equal(old.length,441);
  assert.equal(createHash("sha256").update(JSON.stringify(old)).digest("hex"),"61c8f1628e0a45a1e58eee9e8e2869aa5301aec51604f82190e2274cd995ee7e");
});

test("new labels reuse existing vocabulary and consistent difficulty without Integral Properties overreach",()=>{
  const benchmarks=[...muQuestions.filter(q=>q.id<10565),...alphaQuestions,...thetaQuestions,...muNationalReferences];
  const topics=new Set(benchmarks.map(q=>q.topic)),methods=new Set(benchmarks.flatMap(q=>q.methods));
  for(const q of batch){
    assert.ok(topics.has(q.topic),q.topic);
    for(const method of q.methods)assert.ok(methods.has(method),method);
  }
  assert.deepEqual(batch.map(q=>q.difficulty),[1,2,3,1,2,2,1,2,2,2,3,2,2,2,2,2,3,1,2,2,2,1,1,2,3,2,2,2,1,1]);
  assert.ok(batch.some(q=>q.methods.length===0));
  assert.equal(batch.some(q=>q.methods.includes("Integral Properties")),false);
  assert.deepEqual(get(23).methods,["U-Substitution"]);
  assert.deepEqual(get(25).methods,["Cross Sections"]);
});

test("every expression compiles strictly and all substantive prompt repairs are disclosed",()=>{
  for(const q of batch)for(const text of [q.question,...q.choices,q.solution]){
    for(const m of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)){
      assert.doesNotThrow(()=>katex.renderToString(m[1]??m[2],{throwOnError:true,displayMode:m[2]!==undefined}),"source "+q.source.questionNumber);
    }
    assert.doesNotMatch(text.replace(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g,""),/\\[()[\]]/);
  }
  assert.match(get(3).question,/when.*along the solution/);
  for(const n of [5,6])assert.match(get(n).question,/outside that interval/);
  assert.match(get(13).question,/There exists a point/);
  assert.match(get(14).question,/fixed real value/);
  assert.ok(get(21).question.includes(String.raw`x^2y\ne1`));
  assert.ok(get(26).question.includes(String.raw`=\frac52`));
  assert.match(get(26).solution,/explicit editorial repair/);
  assert.doesNotMatch(get(27).question,/from rest/);
  assert.match(get(27).solution,/phrase "from rest" is removed/);
  assert.match(get(30).solution,/one-sided limits differ/);
});

test("sources 1-4 differential, parametric slope, initial-value branch and continuous rational limit check",()=>{
  near(2+.24/(3*8**(2/3)),2.02);
  const t=Math.sqrt(6-4);
  near(derivative(t=>t-8,t)/derivative(t=>t*t+4,t),Math.SQRT2/4);
  const y=x=>2*Math.tan(2*Math.log(x)+Math.PI/4)-2,x=Math.exp(-Math.PI/4);
  near(y(1),0);near(y(x),-4);
  assert.ok(x>Math.exp(-3*Math.PI/8)&&x<Math.exp(Math.PI/8));
  for(const z of [.4,.8,1])near(z*derivative(y,z),y(z)**2+4*y(z)+8,1e-6);
  near((4**3-27)/(4*4+5*4-24),37/12);
});

test("sources 5 and 6 are normalized nonnegative densities and the requested mass is 63/128",()=>{
  const f=x=>8*x**3-3*x*x+2,c=.5;
  near(2*c**4-c**3+2*c,1);
  near((2*c-1)*(c**3+1),0);
  near(f(.25),31/16);
  for(let x=0;x<=.5;x+=.0005)assert.ok(f(x)>=31/16-1e-12);
  near(simpson(f,0,.5),1);near(simpson(f,0,.25),63/128);
  // Normalization is strictly increasing for every c>=0.
  for(let x=0;x<=5;x+=.01)assert.ok(f(x)>0);
});

test("sources 7-9 normal line, FTC chain rule and all global-maximum candidates check",()=>{
  const f=x=>3*x**3-10*x*x;
  near(f(2),-16);near(derivative(f,2),-4);
  near((2/4-33/2),-16);near(-1/(-4),.25);
  const F=x=>4*Math.asin(x*x/5);
  near(derivative(F,2),16/3,1e-6);
  const cubic=x=>2*x**3+x*x-48*x-72;
  const values=[-4,-3,8/3,4].map(cubic);
  near(values[0],8);near(values[1],27);near(values[2],-4184/27);near(values[3],-120);
  assert.equal(Math.max(...values),27);
  for(let x=-4;x<=4;x+=.001)assert.ok(cubic(x)<=27+1e-10);
});

test("source 10 agrees with integrated geometric terms and quadrature, not any printed numerical choice",()=>{
  const correct=-1+4*Math.log(1.5);
  near(simpson(x=>4*x/(1-x),.25,.5),correct);
  let termwise=0;
  for(let n=1;n<=100;n++)termwise+=4*(.5**(n+1)-.25**(n+1))/(n+1);
  near(termwise,correct);
  near(derivative(x=>-4*x-4*Math.log(1-x),.4),4*.4/(1-.4));
  for(const value of [1+Math.log(16),-3+Math.log(1/16),-1+Math.log(1/16),-1-Math.log(1/4)])assert.ok(Math.abs(value-correct)>.01);
  assert.ok(correct>0);
});

test("sources 11 and 12 outer-radius related rate and polynomial coefficient check",()=>{
  const r=t=>Math.cbrt(729+45*t/4);
  near(r(0),9);near(r(12)**3,864);
  near(derivative(r,12),5*Math.cbrt(4)/192,1e-7);
  near(4*Math.PI*r(12)**2*(5*Math.cbrt(4)/192),15*Math.PI);
  const b=15;
  near(simpson(t=>b*t**4-2*t**3-6*t*t-6,0,2),60);
  near(32*b/5-8-16-12,60);
});

test("source 13 Rolle counterexample satisfies its hypotheses without endpoint derivatives",()=>{
  const f=x=>Math.sqrt(x*(1-x));
  near(f(0),f(1));near(derivative(f,.5),0);
  const h1=1e-4,h2=1e-8;
  assert.ok(f(h2)/h2>f(h1)/h1);
  assert.ok(f(h2)/h2>9000);
});

test("source 14 decay and varying powers hold for zero, negative and arbitrarily large fixed x",()=>{
  for(const x of [-1e100,-10,0,.1,1e100]){
    if(x===0){assert.equal((x*100**2*(Math.E/10)**100)**100,0);continue;}
    const logA=n=>Math.log(Math.abs(x))+2*Math.log(n)+n*(1-Math.log(10));
    assert.ok(logA(1000)<Math.log(.5));
    assert.ok(1000*logA(1000)<-1e6);
    const n=1000;near(Math.exp(logA(n+1)-logA(n)),Math.E*(n+1)**2/(10*n*n),1e-10);
  }
});

test("sources 15 and 16 sign-split area and admissible MVT point check",()=>{
  const f=x=>x*x+4*x-12;
  near(f(2),0);near(-simpson(f,0,2)+simpson(f,2,4),32);
  const p=x=>x**3-x*x+6,c=8/3;
  near((p(4)-p(1))/3,16);near(3*c*c-2*c,16);
  assert.ok(c>1&&c<4);
});

test("source 17 independently weighted Simpson arc length disagrees with all four printed formulas",()=>{
  const a=Math.PI/6,b=5*Math.PI/6,h=(b-a)/4;
  const F=x=>1/Math.sin(x);
  const computed=h/3*(F(a)+4*F(a+h)+2*F(a+2*h)+4*F(a+3*h)+F(b));
  const correct=(18+16*Math.sqrt(3))*Math.PI/54;
  near(computed,correct);
  for(const value of [(12+16*Math.sqrt(3))*Math.PI/27,(12+4*Math.sqrt(3))*Math.PI/9,(72+8*Math.sqrt(3))*Math.PI/27,(36+16*Math.sqrt(3))*Math.PI/27])assert.ok(Math.abs(value-correct)>.1);
  near(simpson(F,a,b),2*Math.log(2+Math.sqrt(3)));
  assert.ok(Math.abs(correct-2*Math.log(2+Math.sqrt(3)))<.03);
});

test("sources 18-20 base-four logarithm limit, derivative-cycle sum and sign intersections check",()=>{
  for(const x of [-1e-8,1e-8])near(Math.log1p(x*x)/(Math.log(4)*Math.sin(x)),0,1e-7);
  let a=1,b=-1,sumA=0,sumB=0;
  for(let n=1;n<=330;n++){[a,b]=[b,-a];sumA+=a;sumB+=b;}
  assert.equal(sumA,-2);assert.equal(sumB,0);
  for(const x of [-10,-4,-2,0,1,2,10]){
    const increasing=12*x*x+48*x-48>0,concave=24*x+48>0;
    assert.equal(increasing&&concave,x>-2+Math.sqrt(8));
  }
});

test("source 21 correct implicit derivative matches an actual real branch and none of the distractors",()=>{
  const y=x=>{
    let a=1e-14,b=20;
    for(let i=0;i<100;i++){
      const z=(a+b)/2,F=x*z+x**3-Math.log(z);
      if(F>0)a=z;else b=z;
    }
    return (a+b)/(2*x);
  };
  const correct=(x,y)=>(y/x-2*x*y*y-3*x*x*y)/(x*x*y-1);
  for(const x of [-1.5,-1,-.5]){
    const z=y(x);
    near(x*x*z+x**3-Math.log(x*z),0);
    near(derivative(y,x),correct(x,z),1e-7);
  }
  const x=-1,z=y(x),answer=correct(x,z);
  const printed=[
    (x*x*z-x)/(x-2*x*x*z*z-3*x**3*z),
    1/(x**3*z-x),
    (2*z+3*x-1)/(x-1),
    (1-2*x*z*z-3*x*x*z)/(x*x*z-1),
  ];
  for(const choice of printed)assert.ok(Math.abs(choice-answer)>.01);
});

test("sources 22 and 23 exponential scaling and inverse-tangent primitive check",()=>{
  for(const x of [1e7,1e9])near(5*x*Math.log1p(1/(10*x)),.5,1e-8);
  const options=[
    x=>Math.atan(x/2)/64,x=>Math.atan(x/4)/16,
    x=>Math.atan(x/4)/8,x=>Math.atan(x/2)/16,
  ];
  for(const x of [-3,.3,2]){
    const integrand=2/(64+16*x*x);
    near(derivative(options[3],x),integrand);
    for(const option of options.slice(0,3))assert.ok(Math.abs(derivative(option,x)-integrand)>1e-4);
  }
});

test("source 24 ceiling integrals equal 88 independently of isolated endpoint values",()=>{
  let exact=0,midpoints=0;
  for(let k=2;k<5;k++){
    exact+=(k+1)*((k+1)**2-k*k);
    midpoints+=2*(k+.5)*Math.ceil(k+.5);
  }
  assert.equal(exact,88);assert.equal(midpoints,88);
});

test("source 25 correct annular volume differs from the correctly evaluated but wrong source setup",()=>{
  const R=x=>7*x,r=x=>2*x*x-x;
  const right=simpson(x=>Math.PI*(R(x)**2-r(x)**2),1,2);
  const wrong=simpson(x=>Math.PI*(R(x)-r(x))**2,1,2);
  near(right,511*Math.PI/5);near(wrong,812*Math.PI/15);
  for(let x=1;x<=2;x+=.01)assert.ok(R(x)>r(x)&&r(x)>0);
  for(const coefficient of [94/5,812/15,994/5,932/15])assert.ok(Math.abs(coefficient-511/5)>.1);
});

test("source 26 repaired level is 5/2 and its slope exists; original level 1 has no real point",()=>{
  const x=Math.PI/4,y=Math.PI/4,z=Math.sin(y)*Math.cos(x);
  near(z+1/z,2.5);
  const Fx=-Math.sin(y)*Math.sin(x)+1/Math.cos(x)*Math.tan(x)/Math.sin(y);
  const Fy=Math.cos(y)*Math.cos(x)-1/Math.cos(x)/Math.sin(y)/Math.tan(y);
  near(Fx,1.5);near(Fy,-1.5);near(-Fx/Fy,1);
  near(derivative(x=>Math.asin(.5/Math.cos(x)),Math.PI/4),1);
  // z^2-z+1 = (z-1/2)^2+3/4 is strictly positive.
  for(const z of [-100,-1,-.1,.1,.5,1,100])assert.ok(z*z-z+1>0);
});

test("source 27 velocity condition and initial position are consistent only after removing rest",()=>{
  const v=t=>2*t**3-6*t*t-18,s=t=>t**4/2-2*t**3-18*t;
  near(v(4),14);near(v(0),-18);near(s(0),0);near(s(4),-72);
  for(const t of [.3,2,4]){
    near(derivative(s,t),v(t),1e-7);
    near(derivative(v,t),6*t*t-12*t,1e-7);
  }
  assert.equal(2*4**3-6*4**2,32);
});

test("sources 28-30 substitution, right sums and two-sided absolute-value limit check",()=>{
  near(simpson(x=>x/(1+x)**4,0,1),1/12);
  const antiderivative=x=>-.5*(1+x)**-2+(1/3)*(1+x)**-3;
  for(const x of [0,.3,1])near(derivative(antiderivative,x),x/(1+x)**4);
  const gap=x=>4*x*x+x-18;
  assert.equal(gap(4)+gap(5)+gap(6),269);
  near(simpson(gap,3,6),211.5);
  assert.ok(gap(3)>0);
  near(Math.abs(1e-7)/Math.tan(1e-7),1);
  near(Math.abs(-1e-7)/Math.tan(-1e-7),-1);
});
