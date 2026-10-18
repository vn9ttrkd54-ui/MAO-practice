import assert from "node:assert/strict";
import {readFileSync, readdirSync, statSync} from "node:fs";
import test from "node:test";
import {muQuestions} from "../data/questions/mu.ts";
import {alphaQuestions} from "../data/questions/alpha.ts";
import {thetaQuestions} from "../data/questions/theta.ts";

const renderer = readFileSync(new URL("../components/math/MathText.tsx", import.meta.url), "utf8");
const solutionImages = [...renderer.matchAll(/src: "(\/questions\/[^\"]+)"[\s\S]*?width: (\d+), height: (\d+)/g)]
  .map(([,src,width,height]) => ({src,width:Number(width),height:Number(height)}));
const images = [...[...muQuestions,...alphaQuestions,...thetaQuestions].flatMap(q => q.illustration ? [q.illustration] : []),...solutionImages];
const uniqueImages = [...new Map(images.map(image => [image.src,image])).values()];

test("question 223 integral labels keep limits and integrands in one aligned SVG group", () => {
  const svg=readFileSync(new URL("../public/questions/mu-345-original-solution.svg",import.meta.url),"utf8");
  for(const id of ["forward-integral","inverse-integral"]){
    const group=svg.match(new RegExp('<g id="'+id+'"[\\s\\S]*?</g>'))?.[0];
    assert.ok(group,id);
    assert.match(group,/<path\b[^>]*stroke="#c23b32"/);
    assert.match(group,/<text class="upper-limit" x="22" y="-20"/);
    assert.match(group,/<text class="lower-limit" x="10" y="31"/);
    assert.match(group,/<text class="integrand" x="40" y="8"/);
    assert.doesNotMatch(group,/>∫</);
  }
});

test("every public question and solution illustration is a standalone local vector", () => {
  assert.equal(solutionImages.length,12,"all solution-only diagrams are checked");
  assert.ok(uniqueImages.length >= 18);
  for (const {src,width,height} of images) {
    assert.match(src,/^\/questions\/[\w-]+\.svg$/);
    const svg = readFileSync(new URL("../public"+src,import.meta.url),"utf8");
    assert.match(svg,/<svg\b/);
    assert.match(svg,/<(?:path|polyline|polygon|circle|ellipse|text|line)\b/);
    assert.match(svg,/<title\b/);
    assert.doesNotMatch(svg,/<(?:image|foreignObject|script)\b|\bon\w+\s*=|data:|(?:href|src)=["'](?:https?:|\/\/)/i,src);
    const viewBox = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    assert.ok(viewBox,src);
    if(src.startsWith("/questions/mu-"))assert.ok(Math.abs(Number(viewBox[1])/Number(viewBox[2])-width/height)<.01,src+" aspect ratio");
  }
});

test("question assets contain no unused raster copies", () => {
  const files=readdirSync(new URL("../public/questions/",import.meta.url),{recursive:true});
  assert.deepEqual(files.filter(name=>/\.(png|jpe?g|webp|gif)$/i.test(name)),[]);
});

test("Mu vectors retain the file-size savings without needing the deleted PNGs", () => {
  const legacyIds=new Set(["146","194","196","201","207-210","217","227","238-240","250","302","313","320","325","336-338","345","348","360-362","442-444"]);
  const muImages=uniqueImages.filter(({src})=>legacyIds.has(src.match(/\/mu-(\d+(?:-\d+)?)-/)?.[1]));
  assert.equal(muImages.length,18);
  // Combined size of the 18 original PNGs before their removal.
  const before=554622;
  let after=0;
  for(const {src} of muImages){
    after+=statSync(new URL("../public"+src,import.meta.url)).size;
  }
  assert.ok(after<before/4,"at least 75 percent smaller in aggregate");
});

test("tables preserve every source value and graph endpoint conventions remain explicit", () => {
  const svg=name=>readFileSync(new URL("../public/questions/"+name+".svg",import.meta.url),"utf8");
  const cells=name=>[...svg(name).matchAll(/<text\b[^>]*>([^<]+)<\/text>/g)].map(m=>m[1]);
  assert.deepEqual(cells("mu-336-338-original"),[
    "Coordinate / Value at x","p(x)","p′(x)","p″(x)","x = 1","2","1","1","x = 2","1","4","−1","x = 3","4","3","2",
  ]);
  assert.deepEqual(cells("mu-360-362-original"),[
    "x","−1","0","1","2","f(x)","3","1","7","−1","f′(x)","5","4","−3","0","g(x)","−8","6","2","4","g′(x)","6","0","3","1",
  ]);
  assert.equal((svg("mu-238-240-original").match(/<circle[^>]*fill="white"/g)||[]).length,3);
  assert.match(svg("mu-442-444-original"),/A34 34 0 0 1 93 72/);
  assert.match(svg("mu-442-444-original"),/A34 34 0 0 1 263 72/);
});
