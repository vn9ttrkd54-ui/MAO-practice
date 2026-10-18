import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import test from "node:test";
import katex from "katex";
import {muQuestions} from "../data/questions/mu.ts";
import {alphaQuestions} from "../data/questions/alpha.ts";
import {thetaQuestions} from "../data/questions/theta.ts";
import {muNationalReferences} from "../data/question-references/muNationals.ts";

const batch=muQuestions.filter(q=>q.source?.competition==="2024 March NSU Statewide");
const get=n=>batch.find(q=>q.source.questionNumber===n);
const near=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,a+" vs "+b);
const derivative=(f,x,h=1e-5)=>(f(x+h)-f(x-h))/(2*h);
const second=(f,x,h=1e-4)=>(f(x+h)-2*f(x)+f(x-h))/(h*h);
const simpson=(f,a,b,n=40000)=>{
  const h=(b-a)/n;let s=f(a)+f(b);
  for(let i=1;i<n;i++)s+=(i%2?4:2)*f(a+i*h);
  return s*h/3;
};

test("all 30 NSU originals retain source numbers and correct only answer keys 13 and 16",()=>{
  assert.equal(batch.length,30);
  const source="CDBADBABBACABCADBCDCABBAEDBEDC";
  const correct="CDBADBABBACACCAEBCDCABBAEDBEDC";
  assert.equal(source.length,30);assert.equal(correct.length,30);
  assert.equal(batch.map(q=>q.answer).join(""),correct);
  const changes=[];
  for(const [i,q] of batch.entries()){
    assert.equal(q.id,10652+i);assert.equal(q.number,529+i);
    assert.deepEqual(q.source,{competition:"2024 March NSU Statewide",event:"Calculus Individual",questionNumber:i+1});
    assert.equal(q.choices.length,5);assert.equal(q.choices[4],"NOTA");
    if(q.answer!==source[i])changes.push(i+1);
  }
  assert.deepEqual(changes,[13,16]);
  assert.equal(new Set(muQuestions.map(q=>q.id)).size,muQuestions.length);
  assert.deepEqual(muQuestions.map(q=>q.number),Array.from({length:muQuestions.length},(_,i)=>i+1));
});

test("all 528 previously approved records remain unchanged",()=>{
  const old=muQuestions.filter(q=>q.id<10652);
  assert.equal(old.length,528);
  assert.equal(createHash("sha256").update(JSON.stringify(old)).digest("hex"),"ee1abb3c1b54348f49bede23f3a9cbdc50142aa7ad7e652c952a7cbc3e422574");
});

test("NSU labels reuse existing vocabulary and difficulty is calibrated by work rather than question position",()=>{
  const refs=[...muQuestions.filter(q=>q.id<10652),...alphaQuestions,...thetaQuestions,...muNationalReferences];
  const topics=new Set(refs.map(q=>q.topic)),methods=new Set(refs.flatMap(q=>q.methods));
  for(const q of batch){assert.ok(topics.has(q.topic),q.topic);for(const m of q.methods)assert.ok(methods.has(m),m);}
  assert.deepEqual(batch.map(q=>q.difficulty),[1,1,1,2,2,2,2,1,2,2,2,3,3,2,2,3,3,3,3,2,2,2,2,2,3,2,3,4,2,3]);
  assert.equal(batch.some(q=>q.methods.includes("Integral Properties")),false);
  assert.ok(batch.some(q=>q.methods.length===0));
  assert.deepEqual(get(28).methods,["U-Substitution","Symmetry"]);
});

test("strict KaTeX accepts every expression and all substantive assumptions/repairs are disclosed",()=>{
  for(const q of batch)for(const text of [q.question,...q.choices,q.solution]){
    for(const m of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g))
      assert.doesNotThrow(()=>katex.renderToString(m[1]??m[2],{throwOnError:true,displayMode:m[2]!==undefined}),"source "+q.source.questionNumber);
    assert.doesNotMatch(text.replace(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g,""),/\\[()[\]]/);
  }
  assert.match(get(9).question,/maximal/);
  assert.match(get(12).question,/positive rational numbers/);
  assert.match(get(16).question,/improper integral/);
  assert.ok(get(17).question.includes(String.raw`\[f(x)=\cos(x)`),"long product uses the existing scrollable display-math container");
  assert.match(get(19).question,/continuously differentiable/);
  assert.doesNotMatch(get(21).question,/previous question/);
  assert.match(get(25).question,/continuous function/);
  assert.match(get(25).solution,/explicit repair/);
  assert.ok(get(26).question.includes(String.raw`0<t\le3`));
  assert.match(get(28).question,/ordinary improper sense/);
  assert.match(get(30).question,/real odd-root values/);
});

test("one true SVG table serves exactly originals 5 and 6 and preserves every value",()=>{
  assert.deepEqual(batch.filter(q=>q.illustration).map(q=>q.source.questionNumber),[5,6]);
  assert.equal(get(5).illustration,get(6).illustration);
  const {src,width,height}=get(5).illustration;
  assert.deepEqual([width,height],[620,212]);
  const svg=readFileSync(new URL("../public"+src,import.meta.url),"utf8");
  const cells=[...svg.matchAll(/<text\b[^>]*>([^<]+)<\/text>/g)].map(m=>m[1]);
  assert.deepEqual(cells,["x","1","2","3","4","5","f(x)","0","3","5","1","0","f'(x)","5","2","-5","-8","-10","g(x)","4","5","1","3","2","g'(x)","2","10","20","15","20"]);
  assert.match(svg,/<title/);assert.match(svg,/<desc/);assert.doesNotMatch(svg,/<image|data:|foreignObject|<script/);
});

test("sources 1-4 direct limit, antiderivative, chain derivative and impact speed check",()=>{
  near(1-1/1e10,1,1e-9);near(derivative(x=>-Math.cos(x),.7),Math.sin(.7));
  for(const x of [-3,0,2])near(derivative(x=>Math.sqrt(x*x-x+1),x),(2*x-1)/(2*Math.sqrt(x*x-x+1)));
  near(-16*2**2+64,0);near(derivative(t=>-16*t*t+64,2),-64);
  near(Math.abs(-32*2),64);
});

test("sources 5 and 6 use the correct composed lookup and both product-rule terms",()=>{
  const g={1:4,2:5,3:1,4:3,5:2},f={1:0,2:3,3:5,4:1,5:0};
  const fd={1:5,2:2,3:-5,4:-8,5:-10},gd={1:2,2:10,3:20,4:15,5:20};
  near(fd[g[2]]*gd[2],-100);near(fd[4]*g[4]+f[4]*gd[4],-9);
});

test("sources 7-9 first derivative signs, absolute area and globally positive quadratic check",()=>{
  const d=x=>(x-1)**2*(x-2);
  assert.ok(d(.9)<0&&d(1.1)<0&&d(1.9)<0&&d(2.1)>0);
  near(d(1),0);near(d(2),0);near(simpson(Math.abs,-1,1),1);
  for(let x=-10;x<=10;x+=.01)assert.ok(x*x+x+1>=.75);
});

test("source 10 includes both actual tangent branches at x=1",()=>{
  const lower=x=>(1-Math.sqrt(5-4*x))/2,upper=x=>(1+Math.sqrt(5-4*x))/2;
  near(lower(1),0);near(upper(1),1);near(derivative(lower,1),1);near(derivative(upper,1),-1);
  for(const x of [.9,1,1.1])for(const f of [lower,upper])near(x+f(x)**2-f(x),1);
});

test("sources 11 and 12 distance rate and correct half-factor polar area independently check",()=>{
  const D=x=>Math.sqrt(x*x+x**3);
  near(D(3),6);near(derivative(D,3),11/4);near(11/(11/4),4);
  const area=simpson(t=>((4-2*Math.cos(t))**2-(6+2*Math.cos(t))**2)/2,2*Math.PI/3,4*Math.PI/3);
  near(area,20*Math.sqrt(3)-20*Math.PI/3);near(20*3*(20/3),400);
  for(let t=2*Math.PI/3;t<=4*Math.PI/3;t+=.001)assert.ok(4-2*Math.cos(t)>=6+2*Math.cos(t)-1e-12);
});

test("source 13 both symmetry and the forced constant functions give 24, not 12",()=>{
  const f=1,g=2;
  near(f,g/g);near(f,g-1);near(simpson(()=>f,-24,24),48);
  near(simpson(()=>f/g,-24,24),24);near(48/2,24);
  for(const p of [.25,.5,2,4])assert.notEqual(p,(1+1/p)/(1+p));
  assert.equal(get(13).answer,"C");
});

test("sources 14 and 15 logarithmic derivative and convergent improper-upper-bound chain rule check",()=>{
  for(const x of [.3,1,2])near(derivative(x=>x**x,x),x**x*(Math.log(x)+1),1e-7);
  for(const x of [-1,0,1])near(derivative(x=>2*Math.exp(x*x/2),x),2*x*Math.exp(x*x/2));
  near(2*Math.sqrt(Math.exp(1)),2*Math.exp(.5));
});

test("source 16 finite cotangent sums have divergent leading terms of alternating signs",()=>{
  const S=(n,x)=>{let sum=0;for(let k=0;k<=n;k++)sum+=(-1/Math.tan(x))**k;return sum;};
  for(let n=1;n<=10;n++){
    const x=1e-7;
    near(x**n*S(n,x),(-1)**n,2e-7);
    assert.equal(Math.sign(S(n,.001)),n%2?-1:1);
    const z=1/Math.tan(.2);
    near(S(n,.2),(1-(-z)**(n+1))/(1+z),1e-4);
  }
  assert.equal(get(16).answer,"E");
  assert.match(get(16).solution,/do not converge for any/);
});

test("source 17 only twice-differentiated cosine terms survive at zero",()=>{
  const f=x=>{let product=1;for(let k=1;k<=24;k++)product*=Math.cos(k*x);return product;};
  let squares=0;for(let k=1;k<=24;k++)squares+=k*k;
  assert.equal(squares,4900);near(second(f,0,1e-5),-4900,.01);
  assert.equal(2**2*5**2*7**2,squares);
});

test("source 18 coefficient equations classify and verify both polynomial solutions",()=>{
  const a=4/9,b=0,c=0,d=0;
  near(8*a,18*a*a);near(4*b,18*a*b);near(2*c,6*a*c+4*b*b);near(d,2*b*c);
  for(const coefficient of [0,a])for(const x of [-3,0,1,4])near(coefficient*(2*x)**3,(3*coefficient*x*x)*(6*coefficient*x));
  near(a*27,12);assert.match(get(18).solution,/constant or linear polynomial/);
});

test("source 19 both signed exponential solutions satisfy the actual integral identity",()=>{
  for(const C of [-Math.sqrt(2024),Math.sqrt(2024)])for(const x of [-1,0,.5,Math.log(2)]){
    const integral=simpson(t=>2*C*C*Math.exp(2*t),0,x);
    near(C*C*Math.exp(2*x),2024+integral,1e-6);
  }
  near((2*Math.sqrt(2024))*(-2*Math.sqrt(2024)),-8096);
});

test("sources 20 and 21 solve both parameter constraints and establish a strict local maximum",()=>{
  const a=6,b=-10,f=x=>(a*x+b)/(x*x-1);
  near(3*a+b,8);near(-10*a-6*b,0);near(f(3),1);near(derivative(f,3),0);
  near(second(f,3),-.25,1e-6);assert.ok(f(2.9)<1&&f(3.1)<1);
});

test("sources 22 and 23 unit-circle maximal area and exponential equation uniqueness check",()=>{
  const area=t=>Math.abs(Math.sin(t));
  near(area(Math.PI/2),1);
  for(let t=0;t<2*Math.PI;t+=.001)assert.ok(area(t)<=1);
  near(Math.hypot(0-(-1),1),Math.hypot(0-1,1));
  near(Math.exp(0)-0-1,0);
  for(const x of [-10,-1,-.01,.01,1,5])assert.ok(Math.exp(x)-x-1>0);
});

test("source 24 covers genuinely rational functions, constants and negative degrees",()=>{
  const examples=[()=>-2,x=>x*x+1,x=>1/(x*x+1),x=>(x*x+2)/(x**4+3)];
  for(const R of examples){const n=1e6;near(R(n)/R(n+1),1,3e-6);}
  assert.match(get(24).solution,/P\(x\).*Q\(x\)/);
});

test("source 25 continuity is necessary for the intended point-value inference",()=>{
  const c=0;
  near(c**3-2*c*c**2+c*c*c,0);
  assert.deepEqual([c+1,c*c+1,c*c-1,c**3-1],[1,1,-1,-1]);
  for(const value of [1,7,100]){
    // A singleton spike has Riemann-sum contribution tending to zero in every moment.
    const n=1e12;
    for(const k of [0,1,2])near(value*.5**k/n,0,1e-9);
    assert.ok(value>0,"its value at 1/2 need not be zero without continuity");
  }
  assert.match(get(25).solution,/almost everywhere/);
});

test("sources 26 and 27 exclude the undefined endpoint and correct the alternating Taylor expansion",()=>{
  const s=t=>25/(t*t)-5/t,v=t=>5*(t-10)/t**3;
  for(const t of [.1,.5,1,2,3]){near(derivative(s,t,1e-6),v(t),.0001);assert.ok(v(t)<0);}
  assert.ok(!Number.isFinite(s(0)));near(v(10),0);
  for(const x of [-.3,0,.3])near((x**3+2)/(x+1),x*x-x+1+1/(1+x));
  const factorial=n=>n<=1?1:n*factorial(n-1);
  assert.equal(factorial(10),3628800);assert.equal(factorial(10)%3**4,0);assert.notEqual(factorial(10)%3**5,0);
  assert.equal(3+1,4);assert.match(get(27).solution,/five factors/);
});

test("source 28 reciprocal antisymmetry and independent phase substitution verify ordinary improper value 0",()=>{
  const a=2024,F=x=>Math.sin(x-a/x)/x;
  for(const x of [-100,-3,1,7,100])near(F(x),F(-x));
  for(const u of [2,10,50,200])near(F(a/u)*a/u**2,-F(u));
  const split=Math.sqrt(a),R=400,epsilon=a/R;
  near(simpson(F,epsilon,split)+simpson(F,split,R),0,1e-7);
  // Independent substitution t=x-a/x has dx/x=dt/sqrt(t^2+4a).
  for(const t of [-20,-1,0,3,100]){
    const x=(t+Math.sqrt(t*t+4*a))/2;
    near(x-a/x,t);
    const dxdt=(1+t/Math.sqrt(t*t+4*a))/2;
    near(F(x)*dxdt,Math.sin(t)/Math.sqrt(t*t+4*a));
  }
  for(const x of [50,100,500])assert.ok(Math.abs(F(x)-Math.sin(x)/x)<=a/x**2);
  assert.match(get(28).solution,/lower-endpoint limit exists separately/);
});

test("source 29 harmonic block tends to the correctly bounded logarithmic integral",()=>{
  const n=10000;let sum=0;for(let k=1;k<=n;k++)sum+=1/(n+k);
  assert.ok(sum<Math.log(2)&&sum>Math.log(2)-1/n);
  near(simpson(x=>1/(1+x),0,1),Math.log(2));
  near(simpson(x=>1/x,1,2),Math.log(2));
});

test("source 30 rational exponents are real odd-root powers and absolute root limit is below 1",()=>{
  const gcd=(a,b)=>b===0n?(a<0n?-a:a):gcd(b,a%b);
  for(let n=0;n<20;n++){
    const denominator=25n**BigInt(n),numerator=-20n*BigInt(n)*denominator+(-6n)**BigInt(n);
    const reduced=denominator/gcd(numerator,denominator);
    assert.equal(reduced%2n,1n);
    if(n>=1)assert.equal(numerator%2n,0n);
  }
  const n=100,logRoot=Math.log(2024)*(-20+(-.24)**n/n);
  near(logRoot,-20*Math.log(2024));assert.ok(logRoot<0);
  const rho=2024**-20;assert.ok(rho>0&&rho<1);
  assert.ok(Number.isFinite(2024+2024*rho/(1-rho)));
});
