import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import * as jsxRuntime from "react/jsx-runtime";

function renderLobby(visibility, scoringVersion) {
  const lobby = {
    room: { visibility, scoringVersion, status: "waiting", settingsVersion: 1,
      countdownEndsAt: null, capacity: 20, settings: { difficultyBand: "2-4", secondsPerQuestion: 90 } },
    currentPlayer: { isHost: false, lobbyReady: false }, players: [],
  };
  const source = readFileSync(new URL("../components/multiplayer/PrivateLobby.tsx", import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
  } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: name => {
    if (name === "react") return React;
    if (name === "react/jsx-runtime") return jsxRuntime;
    if (name.endsWith("useLobbyConnection")) return { useLobbyConnection: () => ({ lobby, ready: true }) };
    return { default: () => null };
  } });
  return renderToStaticMarkup(React.createElement(exports.default, { initialLobby: lobby }));
}

test("public waiting room explains current scoring", () => {
  const html = renderLobby("public", 2);
  for (const text of ["How scoring works", "1,000 points", "500 speed bonus", "faster you answer", "lose 300 points", "giving up earn 0 points"])
    assert.ok(html.includes(text), text);
});

test("legacy public room does not advertise wrong-answer penalties", () => {
  const html = renderLobby("public", 1);
  assert.ok(html.includes("based on speed and answer order"));
  assert.ok(html.includes("Wrong or blank answers earn 0 points"));
  assert.ok(!html.includes("lose 300 points"));
});

test("private room retains its existing scoring copy", () => {
  const html = renderLobby("private", 2);
  assert.ok(!html.includes("How scoring works"));
  assert.ok(html.includes("Correct: 1,000 + up to 500 speed bonus"));
});
