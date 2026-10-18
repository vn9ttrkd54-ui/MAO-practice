import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {muQuestions} from "../data/questions/mu.ts";

const questions=muQuestions.filter(q=>(q.id - 10000)>=177&&(q.id - 10000)<=206);
const get=n=>questions[n-1];
const near=(actual,expected,tolerance=1e-10)=>assert.ok(Math.abs(actual-expected)<tolerance,actual+" vs "+expected);
const simpson=(f,a,b,n=20000)=>{
  const h=(b-a)/n;let sum=f(a)+f(b);
  for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+i*h);
  return sum*h/3;
};

test("2024 States keeps all 30 original questions, credits, IDs, answers and ratings",()=>{
  assert.equal(questions.length,30);
  assert.equal(questions.map(q=>q.answer).join(""),"AACBADADAABEBCCABCCBBDACADCCBD");
  assert.deepEqual(questions.map(q=>q.difficulty),[2,1,1,1,2,1,2,2,2,2,2,3,2,2,3,3,3,3,4,4,4,4,4,4,4,4,5,4,5,5]);
  for(const [i,q] of questions.entries()){
    assert.equal(q.id,10177+i);
    assert.equal((q.id - 10000),177+i);
    assert.deepEqual(q.source,{competition:"2024 FAMAT State Convention",event:"Calculus Individual",questionNumber:i+1});
    assert.equal(q.choices.length,5);
  }
});

test("2024 States original solution pictures are intact, solution-only PNGs",()=>{
  for(const [n,width,height] of [[194,1353,172],[196,322,416],[201,387,291]]){
    const q=questions.find(q=>(q.id - 10000)===n);
    assert.ok(!q.illustration);
    assert.doesNotMatch(q.question,/solution-diagram/);
    assert.ok(q.solution.includes("[[solution-diagram:mu-"+n+"]]"));
    const png=readFileSync(new URL("../public/questions/mu-"+n+"-original-solution.png",import.meta.url));
    assert.equal(png.subarray(1,4).toString("ascii"),"PNG");
    assert.equal(png.readUInt32BE(16),width);
    assert.equal(png.readUInt32BE(20),height);
  }
});

test("composition-limit repair and source alternatives remain explicit",()=>{
  assert.match(get(2).question,/continuous at/);
  assert.match(get(2).solution,/For example/);
  assert.match(get(11).solution,/global maximum/);
  assert.match(get(16).solution,/r_n/);
  assert.match(get(21).solution,/error/);
  assert.match(get(27).solution,/triangular spike/);
  assert.match(get(27).solution,/intermediate value theorem/);
  assert.match(get(29).solution,/finite intervals/);
  assert.match(get(30).question,/For the appropriate choice/);
  assert.match(get(30).solution,/Using the work from the previous problem/);
  for(const n of [13,19,23,26])assert.match(get(n).solution,/Alternatively/);
});

test("finite-sum bound certifies the nearest answer independently",()=>{
  let sum=0;for(let i=2000;i<3000;i++)sum+=1/(i*i+1000*i);
  const lower=Math.log(9/8)/1000,upper=lower+1/12000000;
  assert.ok(sum>=lower&&sum<=upper);
  const choices=[.000287,.000119,.000283,.000104];
  assert.equal(choices.indexOf(choices.reduce((best,x)=>Math.abs(x-sum)<Math.abs(best-sum)?x:best)),1);
  near(sum,.00011782470984619786,1e-15);
});

test("continuous spikes satisfy the exact constraint and approach the supremum",()=>{
  for(const epsilon of [1,.1,.01]){
    const f=x=>x<3-epsilon?0:x<3-epsilon/2?16*(x-3+epsilon)/epsilon**2:16*(3-x)/epsilon**2;
    const area=simpson(f,3-epsilon,3);
    near(area,4);
    const length=3-epsilon+simpson(x=>Math.hypot(1,f(x)),3-epsilon,3);
    assert.ok(length>=7-epsilon&&length<7);
  }
  near(3*Math.hypot(1,4/3),5);
});

test("source integrals, integrating factor and cone minimum check independently",()=>{
  near(simpson(x=>1/((8*x+27)*Math.sqrt(2*x+7)),1,9),Math.log(63/55)/4);
  near(simpson(t=>2*Math.cos(t)**2,0,Math.PI/2)/Math.sqrt(2024),Math.PI*Math.sqrt(506)/2024);
  near(simpson(z=>Math.PI*z*(1-z)**1.5,0,1),4*Math.PI/35);
  near(simpson(a=>2/3*a**(4/3),0,1),2/7);
  near(simpson(x=>1/(1+Math.exp(Math.sin(x)**3)),0,2*Math.PI),Math.PI);
  const y=x=>1/x+1+Math.exp(1/x-1);
  near(y(1),3);
  near(y(2),1.5+1/Math.sqrt(Math.E));
  for(const x of [.5,1,2,5]){
    const derivative=-1/x**2-Math.exp(1/x-1)/x**2;
    near(derivative+y(x)/x**2,1/x**3);
  }
  const volume=x=>Math.PI/6*(1+x)**2*(1+1/x);
  near(volume(.5),9*Math.PI/8);
  for(const x of [.1,.3,.49,.51,1,3,10])assert.ok(volume(x)>volume(.5));
});

test("Gaussian moment recurrence has the stated normalization",()=>{
  for(const n of [10,50,200]){
    let logRatio=.5*Math.log(Math.PI);
    for(let k=1;k<=n;k++)logRatio+=Math.log((2*k-1)/2);
    logRatio-=n*(Math.log(n)-1);
    near(Math.exp(logRatio),Math.sqrt(2*Math.PI),.11/n);
  }
  let sum=0;
  for(let n=0;n<100;n++){const index=2*n;sum+=(index%3===0?1:index%3===1?-1:0)/2**n;}
  near(sum,6/7);
});
