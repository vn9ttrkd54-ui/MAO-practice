import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import katex from 'katex';
import { SourceMapConsumer } from 'source-map-js';

const require = createRequire(import.meta.url);
const compiled = ts.transpileModule(readFileSync(new URL('../../components/math/MathText.tsx', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;
const compiledModule = { exports: {} };
vm.runInNewContext(compiled, { require, module: compiledModule, exports: compiledModule.exports });
const MathText = compiledModule.exports.default;
const render = text => renderToStaticMarkup(React.createElement(MathText, null, text));
const basicMap = { version: 3, sources: ['fixture.ts'], names: [], mappings: 'AAAA', sourcesContent: ['const value = 1;'] };
const indexedMap = (map, line = 0) => ({ version: 3, sections: [{ offset: { line, column: 0 }, map }] });

test('installed runtime packages match the reviewed security patches, not just lock metadata', () => {
  const lock = JSON.parse(readFileSync(new URL('../../package-lock.json', import.meta.url), 'utf8'));
  for (const [name, version] of [['katex', '0.18.2'], ['source-map-js', '1.2.2']]) {
    assert.equal(require(`${name}/package.json`).version, version);
    const entries = Object.entries(lock.packages).filter(([path]) => path.endsWith(`/node_modules/${name}`) || path === `node_modules/${name}`);
    assert.ok(entries.length > 0);
    for (const [path, entry] of entries) assert.equal(entry.version, version, path);
  }
});

test('KaTeX ignores inherited trust options instead of creating an untrusted link', () => {
  const html = katex.renderToString(String.raw`\href{https://example.invalid/untrusted}{x}`, Object.create({ trust: true }));
  assert.doesNotMatch(html, /<a\b|href="https:\/\/example\.invalid/);
});

test('actual MathText keeps inline math, display math and accessible MathML', () => {
  const html = render(String.raw`Inline \(x^2\). Display \[\int_0^1 x^2\,dx=\frac13\].`);
  assert.match(html, /class="katex"/);
  assert.match(html, /katex-display/);
  assert.match(html, /<math\b/);
  assert.doesNotMatch(html, /katex-error/);
});

test('actual MathText escapes raw HTML and blocks remote links, images and HTML extensions', () => {
  const html = render(String.raw`<script>alert(1)</script> \(\href{https://example.invalid/x}{x}\) \(\includegraphics{https://example.invalid/x.png}\) \(\htmlClass{unsafe-test}{x}\)`);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script\b|<img\b|<a\b|class="unsafe-test"/);
});

test('actual MathText still bounds recursive macros and renders a safe error fallback', () => {
  const html = render(String.raw`\(\def\loop{\loop}\loop\)`);
  assert.match(html, /katex-error/);
  assert.doesNotMatch(html, /<script\b/);
});

test('source maps still resolve normal and nested mappings', () => {
  for (const map of [basicMap, indexedMap(indexedMap(basicMap))]) {
    const consumer = new SourceMapConsumer(map);
    assert.deepEqual(consumer.sources, ['fixture.ts']);
    assert.equal(consumer.sourceContentFor('fixture.ts'), 'const value = 1;');
  }
  assert.deepEqual(new SourceMapConsumer(basicMap).originalPositionFor({ line: 1, column: 0 }),
    { source: 'fixture.ts', line: 1, column: 0, name: null });
});

test('source maps reject oversized and nested cumulative offsets before expanding them', () => {
  // Tiny local inputs only: never serialize or allocate the represented lines.
  assert.throws(() => new SourceMapConsumer(indexedMap(basicMap, 10_000_001)), /must not exceed/);
  assert.throws(() => new SourceMapConsumer(indexedMap(indexedMap(basicMap, 6_000_000), 6_000_000)), /including offsets of nested sections/);
  for (const line of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => new SourceMapConsumer(indexedMap(basicMap, line)), /non-negative integers/);
  }
});
