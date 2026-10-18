import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";
import { muQuestions } from "../data/questions/mu.ts";

const questions = muQuestions.filter(question => (question.id - 10000) >= 119 && (question.id - 10000) <= 147);
const retained = Array.from({ length: 30 }, (_, index) => index + 1).filter(number => number !== 26);

test("2026 States retains its 29 established records and original-number credits", () => {
  assert.equal(questions.length, 29);
  assert.deepEqual(questions.map(question => question.id), Array.from({ length: 29 }, (_, index) => 10119 + index));
  const printedKey = "B C C D A B D B E A A D B B A B A B C C D A C A B C B D A B".split(" ");
  printedKey[28] = "C"; // Printed A comes from an invalid cancellation at a 0/0 limit.
  for (const [index, question] of questions.entries()) {
    const number = retained[index];
    assert.deepEqual(question.source, {
      competition: "2026 FAMAT State Convention", event: "Calculus Individual", questionNumber: number,
    });
    assert.equal(question.answer, printedKey[number - 1]);
    assert.equal(question.choices.length, 5);
  }
  assert.ok(!questions.some(question => question.source.questionNumber === 26));
});

test("existing difficulties, topics and meaningful methods are preserved", () => {
  assert.deepEqual(questions.map(question => question.difficulty), [1,1,1,1,3,4,3,4,1,4,4,3,4,2,1,4,3,2,4,4,4,4,3,5,4,5,4,5,4]);
  assert.equal(questions.find(question => question.id === 10146).answer, "C");
  assert.deepEqual(questions.find(question => question.id === 10146).methods, ["Trigonometric Identities"]);
});

test("all States problem and solution formulas compile with KaTeX", () => {
  for (const question of questions) for (const value of [question.question,...question.choices,question.solution]) {
    for (const match of value.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) {
      assert.doesNotThrow(() => katex.renderToString(match[1] ?? match[2], {
        throwOnError: true, displayMode: match[2] !== undefined,
      }), `MU ${(question.id - 10000)}`);
    }
  }
});

test("wording and explanatory corrections resolve source and catalog errors", () => {
  const get = original => questions.find(question => question.source.questionNumber === original);
  assert.match(get(7).question, /northeast/);
  assert.match(get(7).question, /next intersection/);
  assert.match(get(12).question, /volume rate/);
  assert.match(get(20).solution, /a=1.*not a solution/);
  assert.doesNotMatch(get(20).solution, /a=1.*satisfies/);
  assert.match(get(21).question, /fractional part/);
  assert.match(get(22).question, /arc length/);
  assert.match(get(25).question, /in inches per hour/);
  assert.doesNotMatch(get(25).question, /in cubic inches per hour/);
  assert.match(get(29).solution, /vary with/);
  assert.match(get(29).solution, /0\/0/);
});

test("original question 29 artwork is present before reveal and sourced locally", () => {
  const question = questions.find(question => question.id === 10146);
  assert.equal(question.illustration.src, "/questions/mu-146-original.png");
  assert.equal(question.illustration.width,600);
  assert.equal(question.illustration.height,390);
  const png = readFileSync(new URL(`../public${question.illustration.src}`,import.meta.url));
  assert.equal(png.subarray(1,4).toString("ascii"),"PNG");
  assert.equal(questions.filter(question => question.illustration).length,1);
});

test("minimum-distance stationarity and geometry limit agree with independent calculations", () => {
  const derivative = x => x - 2 + Math.log(x) / x;
  assert.equal(derivative(1),-1);
  let left=1, right=2;
  for (let k=0;k<70;k++) {
    const middle=(left+right)/2;
    if (derivative(middle)>0) right=middle; else left=middle;
  }
  const a=(left+right)/2;
  assert.ok(a>1 && a<2);
  assert.ok(Math.abs(a+Math.log(a)/a-2)<1e-14);
  const distance=x=>(x-2)**2+Math.log(x)**2;
  assert.ok(distance(a)<distance(1) && distance(a)<distance(2));
  const b=2;
  for (const delta of [-0.001,-0.0001,0.0001,0.001]) {
    const a=b+delta, x=Math.sqrt(a*b);
    const c=Math.hypot(a,x), d=Math.hypot(b,x);
    assert.ok(Math.abs((a-b)/(c-d)-Math.SQRT2)<1e-7);
    assert.ok(Math.abs(-x*x+a*b)<1e-12); // Diagonals meet at a right angle.
  }
});

test("integrals, series, bump maximum and physical units are independently consistent", () => {
  const simpson=(fn,start,end,count=10000)=>{
    const width=(end-start)/count;let sum=fn(start)+fn(end);
    for(let k=1;k<count;k++)sum+=(k%2?4:2)*fn(start+k*width);
    return sum*width/3;
  };
  assert.ok(Math.abs(simpson(x=>Math.sin(2*x)*Math.sin(3*x)+Math.sin(3*x)*Math.cos(4*x)-Math.sin(4*x)**2,-Math.PI,Math.PI)+Math.PI)<1e-10);
  let harmonic=0;
  for(let n=1;n<=100000;n++)harmonic+=1/(2*n-1)-1/(2*n);
  assert.ok(Math.abs(harmonic-Math.log(2))<3e-6);
  let exponential=0,factorial=1;
  for(let n=1;n<30;n++){factorial*=n;exponential+=(n+1)*(-1)**n/(factorial*2**n);}
  assert.ok(Math.abs(exponential-(1/(2*Math.sqrt(Math.E))-1))<1e-14);
  assert.equal((2/3)*2*231,308);
  assert.equal(308/(16*Math.PI),77/(4*Math.PI));
  const bump=x=>x<=0.5||x>=1.5?0:Math.exp(1/((x-0.5)*(x-1.5)));
  for(let k=0;k<=1000;k++)assert.ok(bump(k/500)<=Math.exp(-4)+1e-16);
});
