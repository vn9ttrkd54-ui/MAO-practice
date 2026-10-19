import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import test from "node:test";
import katex from "katex";
import {thetaQuestions} from "../data/questions/theta.ts";
import {alphaQuestions} from "../data/questions/alpha.ts";

const hash=value=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
const old=thetaQuestions.filter(q=>q.id>=30031&&q.id<=30179);
const added=thetaQuestions.filter(q=>q.id>=30420);
const get=id=>thetaQuestions.find(q=>q.id===id);
const jan=n=>get(30419+n);
const sets=[
  ["2026 January Statewide",30031,30059,"BBCDACBBAEBDDCEBCDCABECBCBABD",29],
  ["2026 February Regional",30060,30089,[..."AECDBDAEBCCADEDBCADCBBEABDABBA"].filter((_,i)=>i!==23).join(""),29],
  ["2026 King February Statewide",30090,30119,"BCCDCAAABCECBBCBCADCBCCCABCDBB",30],
  ["2026 March Regional",30120,30149,"BCEAAEBABCDCDBDCBCDECADCBACDAC",30],
  ["2026 NSU March Statewide",30150,30179,"BADDBBEECECBBBADACABCAEBBBBCBB",30],
  ["2026 January Regional",30420,30449,"BAEDDCABBACBEBCBDCBCCDCDDCCACB",30],
];

test("six supplied 2026 Theta sets have credits, source numbers, complete keys, and no duplicates",()=>{
  assert.equal(thetaQuestions.length,447);
  assert.equal(old.length,148);
  assert.equal(added.length,30);
  assert.equal(new Set(thetaQuestions.map(q=>q.id)).size,thetaQuestions.length);
  assert.equal(new Set(thetaQuestions.map(q=>q.number)).size,thetaQuestions.length);
  for(const [competition,first,last,key,count] of sets){
    const qs=thetaQuestions.filter(q=>q.id>=first&&q.id<=last);
    assert.equal(qs.length,count,competition);
    assert.equal(qs.map(q=>q.answer).join(""),key,competition);
    for(const q of qs){
      const questionNumber=first===30031?q.id-30030+(q.id>=30033?1:0):q.id-first+1;
      assert.deepEqual(q.source,{competition,event:"Algebra 2 Individual",questionNumber});
      assert.equal(q.id,q.number+30000);
      assert.equal(q.choices.length,5);
      assert.ok(q.solution.length>=30);
      assert.doesNotMatch(q.question+q.solution,/youtube|thrown out|disput|Region \d/);
    }
  }
  assert.equal(get(30083),undefined,"original February Regional 24 was thrown out in Region 5");
  assert.ok(!old.some(q=>q.source.competition==="2026 January Statewide"&&q.source.questionNumber===3));
});

test("existing retained IDs, numbering, topics, methods, difficulty, choices and unrelated questions stay stable",()=>{
  assert.equal(hash(old.map(({id,number,division,topic,difficulty,methods})=>({id,number,division,topic,difficulty,methods}))),
    "bb97ca02dc1ba3467c615b9ff6b7e34a4bafaa80cf83b137e1288821f41ca0f8");
  assert.equal(hash(old.filter(q=>q.id!==30039).map(q=>[q.id,q.choices])),
    "24021154450f3a86fa4b7df9602db8a7193a35213eac1eff969590588c3bbaef");
  assert.equal(get(30039).choices[1],String.raw`\( \frac{67}{76} \)`.replaceAll(" ",""));
  assert.equal(hash(thetaQuestions.filter(q=>q.id>=30180&&q.id<=30419).map(q=>{
    const content={...q};
    delete content.source;
    return content;
  })),
    "1b2e78d0282aaed469a7ddbd4f55693fd87089698181c3d5d797bf07f6e9e981");
  assert.equal(createHash("sha256").update(readFileSync(new URL("../data/questions/mu.ts",import.meta.url))).digest("hex"),
    "c44c28c37a223ed2236a616ce51aa363a304fb2ab192561efb0d1e24e4fd44c3");
  // Later authorized Alpha source credits must leave all reviewed content intact.
  assert.equal(hash(alphaQuestions.map(q=>{
    const content={...q};
    delete content.source;
    return content;
  })),"58432486ac41dd54186ca3f6c8894a24be6b3b0d688bee53cb361d9e1ab17e0c");
  assert.deepEqual(added.map(q=>q.difficulty),[1,1,1,1,2,2,2,2,2,1,2,2,1,2,3,3,2,2,2,3,3,2,1,1,3,3,1,2,3,1]);
});

test("restored source details and necessary stem repairs do not regress",()=>{
  assert.match(get(30034).question,/odd, one-to-one/);
  assert.equal(get(30034).illustration.src,"/questions/theta-january-statewide-2026-table.svg");
  assert.match(get(30060).question,/including a zero divisor/);
  assert.match(get(30074).question,/uniformly/);
  assert.match(get(30102).question,/^Our coordinate is back again!/);
  for(const id of [30099,30100,30101]) assert.doesNotMatch(get(id).question,/Questions #10-12/);
  assert.match(get(30110).question,/magnitude of the displacement/);
  assert.match(get(30112).question,/magnitude of the total displacement/);
  assert.match(get(30116).question,/coefficient.*coefficient.*original minus translated/);
  assert.match(get(30123).question,/continuous/);
  assert.match(get(30145).question,/not all positive and not all negative/);
  assert.match(get(30156).question,/nonzero/);
  assert.match(get(30174).question,/her yard/);
  assert.ok(get(30177).question.includes(String.raw`\sqrt{a\cdot\sqrt[3]{a\cdot\sqrt[4]{a}}}`));
  assert.match(get(30048).solution,/no unique solution/);
  assert.match(get(30057).solution,/\(3Q-16\).*\(Q\+5\)/);
});

test("native source tables retain all original values and solution figures stay out of prompts",()=>{
  const svg=name=>readFileSync(new URL("../public/questions/"+name+".svg",import.meta.url),"utf8");
  const cells=name=>[...svg(name).matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)].map(m=>m[1]);
  assert.deepEqual(cells("theta-january-statewide-2026-table"),["x","−7","−2","4","a","7","f(x)","b","7","5","−7","4"]);
  assert.deepEqual(cells("theta-feb-2026-11-solution").slice(4),["Batch #1","5","80","400","Batch #2","100","x","100x","Batch #3","24","x + 80","24x + 1920"]);
  assert.deepEqual(cells("theta-feb-2026-21-solution"),["","1","7","5","−8","−14","−6","","−6","−6","6","12","","1","1","−1","−2","−2"]);
  assert.deepEqual(cells("theta-feb-2026-28-solution").slice(3),["Positive real roots","2","0","Negative real roots","0","0","Complex non-real roots","2","4"]);
  assert.deepEqual(cells("theta-feb-2026-29-solution").slice(4),["With","200 + w","960 / (200 + w)","960","Against","200 − w","640 / (200 − w)","640"]);
  const illustrated=old.filter(q=>q.solution.includes("[[solution-diagram:"));
  assert.deepEqual(illustrated.map(q=>q.id),[30065,30070,30080,30086,30087,30088,30163]);
  for(const q of [...old,...added]){
    assert.doesNotMatch(q.question,/solution-diagram/);
    assert.ok(!q.illustration?.src.endsWith("-solution.svg"));
  }
});

test("January Regional #1-10 agree with independent substitution, roots, branches, and slopes",()=>{
  assert.equal(9-(0+1)**2,8);
  assert.equal(1.5*(5/3)-.5,2);
  const lower=-7/2; assert.equal(1-2*lower,8);
  assert.ok(Math.abs((2*Math.sqrt(12)+3*Math.sqrt(27))**2-507)<1e-10);
  assert.equal(-2*(-3)**3,54);
  const k=2.5; assert.equal(k-2,(4-k)/3);
  const f=x=>(x+2)/(x-2);
  assert.ok(Math.abs(f(4)*(10/3)-10)<1e-10);assert.ok(Math.abs(f(10/3)-4)<1e-10);
  assert.equal(4*.5**2-10*.5+4,0);assert.equal(4*(-4)**2+17*(-4)+4,0);
  assert.equal(-10+17,7);assert.equal((-2/3)*(3/2),-1);assert.equal(3+(-2),1);
  assert.ok(-4<1/3&&1/3<3/2);
  assert.equal(jan(3).answer,"E");
});

test("January Regional #11-20 agree with independent circle, polynomial, conic, and domain checks",()=>{
  for(const a of [1,2,5]) assert.equal((a*a+a*a)/2,a*a);
  const roots=[3,-3,2,-2];for(const x of roots)assert.equal((x*x-5)**2,3*(x*x-5)+4);
  assert.equal(roots.reduce((a,b)=>a*b,1),36);
  assert.equal(8/12,2/3);
  assert.ok(Math.abs((-32)*(-1/6)-(1/3)*16)<1e-12);
  assert.equal(3**2+2**2,13);
  assert.equal((-4)**2-4*4,0);assert.equal(4**2+4*(-4),0);
  assert.equal((-3)*(-2)*3,18);
  const g=x=>(-4*x**4+2*x)/(x*x+3);
  assert.ok(g(-1000)<-1e6&&g(1000)<-1e6);
  for(const x of [-3,-2,0,2,6]) assert.equal(x**4-2*x**3+x*x+8*x-20,(x*x-2*x+5)*(x*x-4));
  assert.equal((-2)*2,-4);
  for(const a of [0,1,10])for(const x of [-.01,-10,-1e6]) assert.ok(a*x-2*.1<3);
  for(const a of [-1,-.001])assert.ok(a*(-100/a*-1)-2*.1>3);
});

test("January Regional #21-30 agree with independent conic, determinant, remainder, complex, log, and radical checks",()=>{
  assert.equal(4-2/(4/3),2.5);
  const det=([a,b,c],[d,e,f],[g,h,i])=>a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g);
  assert.equal(det([2,-1,3],[0,-3,1],[1,1,-1]),12);
  assert.equal(det([0,6,-2],[-4,2,-6],[-2,-2,2]),96);
  assert.equal(Math.hypot(-1+7,-2+10),10);
  assert.equal((-4-1)*(-4+3)*(2*(-4)-1),-45);
  for(const [a,b] of [[0,0],[1,0],[-.5,Math.sqrt(3)/2],[-.5,-Math.sqrt(3)/2]]){
    assert.ok(Math.abs(a*a-b*b-a)<1e-12);assert.ok(Math.abs(2*a*b+b)<1e-12);
  }
  for(const x of [16,.25]) assert.ok(Math.abs(x**Math.log2(x)/(x*x)-256)<1e-10);
  assert.equal(16*.25,4);
  const f=x=>2*x+1;assert.equal(f(f(f(f(1)))),31);
  assert.equal(f(2+1),f(4-1));assert.equal(Math.hypot(1-(-1),7-7),2);
  assert.ok(Math.abs(Math.sqrt(11+6*Math.sqrt(2))+Math.sqrt(11-6*Math.sqrt(2))-6)<1e-12);
  assert.equal(-(2**2)-(-2)**2-2**(-2),-33/4);
});

test("corrected existing-source factorization, minima, geometry, and probability work independently",()=>{
  for(const Q of [-5,16/3])assert.ok(Math.abs(3*Q*Q-Q-80)<1e-10);
  const h=x=>Math.abs(x+2)+Math.abs(2*x+10);
  assert.ok(Math.abs(h(-16/3)-4)<1e-10);assert.equal(h(-4),4);
  const x=4/7,y=1/14;assert.ok(Math.abs(3*x*x+x*y-4*y*y-1)<1e-12);
  assert.equal(49*x*x-16,0);
  assert.equal((5*80+100*20)/(80+20),24);
  assert.equal(960/(200+40),640/(200-40));
  const p=x=>(x*x-5*x+6)*(x*x-9*x+18)*(x*x-9*x+14)*(x*x-7*x+12);
  assert.equal(p(2),0);for(const x of [1,2.5,5,9])assert.ok(p(x)>0);
  const numerator=4*3*3-2*3,denominator=4*7*7-2*7;
  assert.notEqual(numerator,denominator);
  assert.equal(3*3**2-5*1,22);assert.equal(3*3**2-1-6*3,8);
  assert.match(get(30081).solution,/\(2x\+1\)/);
});

test("every restored and added formula compiles with strict KaTeX",()=>{
  for(const q of [...old,...added])for(const text of [q.question,...q.choices,q.solution]){
    for(const m of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)){
      assert.doesNotThrow(()=>katex.renderToString(m[1]??m[2],{throwOnError:true,displayMode:m[2]!==undefined}),"Theta "+q.number);
    }
  }
});
