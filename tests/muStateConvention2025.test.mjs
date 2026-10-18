import assert from "node:assert/strict";
import test from "node:test";
import katex from "katex";
import { muQuestions } from "../data/questions/mu.ts";

const questions=muQuestions.filter(question=>(question.id - 10000)>=148&&(question.id - 10000)<=176);
const originalNumbers=Array.from({length:30},(_,index)=>index+1).filter(number=>number!==17);
const get=number=>questions.find(question=>question.source.questionNumber===number);

test("2025 States preserves all established IDs and original-number credits across omitted 17",()=>{
  assert.equal(questions.length,29);
  assert.deepEqual(questions.map(question=>question.id),Array.from({length:29},(_,index)=>10148+index));
  const key="A B E B A B D D C C B C D A D D C B A D B E D B B B C A C A".split(" ");
  key[18]="E"; // Existing unrestricted real-query reading, rather than integer-only queries.
  for(const [index,question] of questions.entries()){
    const number=originalNumbers[index];
    assert.deepEqual(question.source,{competition:"2025 FAMAT State Convention",event:"Calculus Individual",questionNumber:number});
    assert.equal(question.answer,key[number-1]);
    assert.equal(question.choices.length,5);
  }
  assert.ok(!questions.some(question=>question.source.questionNumber===17));
  assert.deepEqual(questions.map(question=>question.difficulty),[1,2,3,1,3,5,2,3,5,3,4,5,3,2,4,3,3,5,5,5,5,4,2,4,5,4,2,5,5]);
});

test("every 2025 States formula compiles and no image from the supplied PDFs is missing",()=>{
  assert.equal(questions.filter(question=>question.illustration).length,0);
  for(const question of questions)for(const value of [question.question,...question.choices,question.solution]){
    assert.doesNotMatch(value,/,qquad/);
    for(const match of value.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)){
      assert.doesNotThrow(()=>katex.renderToString(match[1]??match[2],{throwOnError:true,displayMode:match[2]!==undefined}),`MU ${(question.id - 10000)}`);
    }
  }
});

test("source transcription and domain corrections are explicit",()=>{
  assert.ok(get(11).question.includes(String.raw`4-\dfrac{x^2}{2}`));
  assert.ok(!get(11).question.includes(String.raw`\dfrac{4-x^2}{2}`));
  assert.ok(get(11).solution.includes(String.raw`2+2h-h^2/2`));
  assert.match(get(9).question,/arbitrary real constant/);
  assert.match(get(9).solution,/K=0/);
  assert.match(get(19).question,/exact value/);
  assert.match(get(19).question,/any real value/);
  assert.equal(get(19).answer,"E");
  assert.match(get(19).solution,/restricted to positive integers/);
  assert.match(get(6).solution,/elementary manipulation/);
  assert.match(get(12).solution,/first sum only through/);
  assert.match(get(21).solution,/Rationalizing/);
  assert.match(get(22).solution,/0\/0/);
  assert.match(get(30).solution,/23\^2=529/);
});

test("composition limit follows the actual transcribed piecewise formulas",()=>{
  const f=x=>[-2,2,5].includes(x)?4:x< -2?3-x:x<2?4-x*x/2:x<5?(6*x-21)/(x-5):(2*x-1)/3;
  assert.equal(f(0),4);
  for(const epsilon of [1e-4,1e-6,1e-8]){
    assert.ok(f(-2-epsilon)>5);
    assert.ok(f(-2+epsilon)>2);
    assert.ok(Math.abs(f(f(-2-epsilon))-3)<2*epsilon);
    assert.ok(Math.abs(f(f(-2+epsilon))-3)<3*epsilon);
  }
});

test("elementary series manipulation and finite harmonic cancellation check independently",()=>{
  const r=2-Math.sqrt(3);let odd=0,even=0;
  for(let n=1;n<100;n++)if(n%2)odd+=n*r**n;else even+=n*r**n;
  assert.ok(Math.abs(odd-2*even)<1e-14);
  const h=n=>{let sum=0;for(let k=1;k<=n;k++)sum+=1/k;return sum;};
  const a=45,N=1000;let sum=0;
  for(let n=a+1;n<=N;n++)sum+=4*a*a/(n*n*n-a*a*n);
  const finite=4*h(a)-2*h(2*a)+2*(h(N-a)+h(N+a)-2*h(N));
  assert.ok(Math.abs(sum-finite)<1e-12);
});

test("both curve-branch derivative limits use valid explicit derivatives",()=>{
  for(const x of [1e-3,1e-5,1e-7]){
    const s=Math.sqrt(1-x);
    const lower=x/Math.sqrt(1+s),upper=Math.sqrt(x+x*s);
    for(const y of [lower,upper])assert.ok(Math.abs(2*x*y*y-x*x*x-y**4)<1e-18);
    const lowerSlope=1/Math.sqrt(1+s)+x/(4*s*(1+s)**1.5);
    const upperSlope=(1+s-x/(2*s))/(2*upper);
    assert.ok(Math.abs(lowerSlope-Math.SQRT1_2)<x);
    assert.ok(upperSlope>0.6/Math.sqrt(x));
  }
});

test("remaining integrals and minimum arithmetic-sequence square agree independently",()=>{
  const simpson=(fn,start,end,n=10000)=>{const w=(end-start)/n;let sum=fn(start)+fn(end);for(let k=1;k<n;k++)sum+=(k%2?4:2)*fn(start+k*w);return sum*w/3;};
  assert.ok(Math.abs(simpson(x=>(1-2*x)**4*x*x,0,1)-3/35)<1e-12);
  assert.ok(Math.abs(simpson(x=>1/Math.cos(7*x),0,Math.PI/21)-Math.log(2+Math.sqrt(3))/7)<1e-12);
  assert.ok(Math.abs(simpson(x=>1/(1+Math.cos(7*x)),0,Math.PI/21)-Math.sqrt(3)/21)<1e-12);
  assert.ok(Math.abs(simpson(u=>u*u*(2-u*u)**2/2,0,1)-71/210)<1e-12);
  const candidates=[];
  for(let N=1;N<=24;N++)for(let p=-8;p<=8;p++)for(let q=-3;q<=3;q++){
    if(q!==0&&9*p*p+60*q*q===N*N)candidates.push(N);
  }
  assert.ok(candidates.length>0);
  assert.equal(Math.min(...candidates),24);
  assert.equal([-10,-7,-4,-1,2,5,8,11,14].reduce((sum,value)=>sum+value*value,0),24**2);
});
