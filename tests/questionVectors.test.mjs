import assert from "node:assert/strict";
import {readFileSync, statSync} from "node:fs";
import test from "node:test";
import {muQuestions} from "../data/questions/mu.ts";
import {alphaQuestions} from "../data/questions/alpha.ts";
import {thetaQuestions} from "../data/questions/theta.ts";

const renderer = readFileSync(new URL("../components/math/MathText.tsx", import.meta.url), "utf8");
const solutionImages = [...renderer.matchAll(/src: "(\/questions\/[^\"]+)"[\s\S]*?width: (\d+), height: (\d+)/g)]
  .map(([,src,width,height]) => ({src,width:Number(width),height:Number(height)}));
const images = [...[...muQuestions,...alphaQuestions,...thetaQuestions].flatMap(q => q.illustration ? [q.illustration] : []),...solutionImages];
const uniqueImages = [...new Map(images.map(image => [image.src,image])).values()];

test("every public question and solution illustration is a standalone local vector", () => {
  assert.equal(solutionImages.length,10,"all solution-only diagrams are checked");
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

test("each new Mu vector is smaller than its retained, unreferenced source PNG", () => {
  const muImages=uniqueImages.filter(({src})=>/mu-.*(?:original|solution)\.svg$/.test(src));
  assert.equal(muImages.length,18);
  let before=0,after=0;
  for(const {src} of muImages){
    const vector=statSync(new URL("../public"+src,import.meta.url)).size;
    const raster=statSync(new URL("../public"+src.replace(/\.svg$/,".png"),import.meta.url)).size;
    assert.ok(vector<raster,src);
    before+=raster;after+=vector;
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
