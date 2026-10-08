import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
function compile(file, dependencies) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(readFileSync(new URL(file, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, { exports, Error, require: name => name in dependencies ? dependencies[name] : require(name) });
  return exports;
}
function nodes(tree) {
  if (!tree || typeof tree !== "object") return [];
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  return [tree, ...nodes(tree.props?.children)];
}
function content(tree) {
  if (tree == null || typeof tree === "boolean") return "";
  if (Array.isArray(tree)) return tree.map(content).join("");
  return typeof tree === "object" ? content(tree.props?.children) : String(tree);
}
const joinAction = () => {};
async function page({ signedIn = false, error } = {}) {
  const Page = compile("../app/multiplayer/join/page.tsx", {
    "next/link": { default: "test-link" },
    "lucide-react": Object.fromEntries(["ArrowLeft", "ArrowRight", "KeyRound", "ShieldCheck"].map(name => [name, "test-icon"])),
    "@/app/multiplayer/actions": { joinPrivateRoomAction: joinAction },
    "@/components/multiplayer/PendingSubmitButton": { default: "pending-submit" },
    "@/lib/supabase/server": { createClient: async () => ({ auth: { getUser: async () => ({ data: { user: signedIn ? { id: "account" } : null } }) } }) },
    "./join.module.css": { default: {} },
  }).default;
  return Page({ searchParams: Promise.resolve({ error }) });
}

test("guest join page displays the 13-plus notice without a checkbox or age questionnaire", async () => {
  const tree = await page(), all = nodes(tree);
  const inputs = all.filter(node => node.type === "input");
  assert.deepEqual(inputs.map(input => input.props.name), ["code", "guestNickname"]);
  assert.deepEqual(inputs.map(input => [input.props.required, input.props.minLength, input.props.maxLength]), [[true, 8, 8], [true, 1, 20]]);
  assert.equal(all.find(node => node.type === "form").props.action, joinAction);
  assert.equal(all.some(node => node.props?.role === "dialog" || node.props?.type === "checkbox"), false);
  assert.match(content(tree), /You must be 13 or older to play, including as a guest/);
  assert.match(content(tree), /By joining, you confirm that you are 13 or older/);
  const button = all.find(node => node.type === "pending-submit");
  assert.equal(button.props.name, "ageConfirmation");
  assert.equal(button.props.value, "13-or-older");
  assert.equal(button.props.disabled, undefined);
  assert.equal(button.props["aria-describedby"], "join-eligibility");
  assert.deepEqual(all.filter(node => node.type === "test-link").map(node => node.props.href), ["/multiplayer", "/terms", "/privacy"]);
});

test("signed-in join page preserves account identity rather than accepting a guest nickname", async () => {
  const tree = await page({ signedIn: true });
  assert.deepEqual(nodes(tree).filter(node => node.type === "input").map(input => input.props.name), ["code"]);
  assert.doesNotMatch(content(tree), /You must be 13 or older|By joining, you confirm/);
  assert.equal(nodes(tree).some(node => node.props?.id === "join-eligibility"), false);
  const button = nodes(tree).find(node => node.type === "pending-submit");
  assert.equal(button.props["aria-describedby"], undefined);
  assert.equal(button.props.name, "ageConfirmation");
  assert.equal(button.props.value, "13-or-older");
});

test("join errors are rendered as text in the dedicated form", async () => {
  const error = '<script>alert("x")</script>';
  const tree = await page({ error });
  const alert = nodes(tree).find(node => node.props?.role === "alert");
  assert.equal(content(alert), error);
  assert.equal(nodes(tree).some(node => node.props?.dangerouslySetInnerHTML), false);
});

function action({ status = "waiting", error } = {}) {
  const calls = [];
  const api = compile("../app/multiplayer/actions.ts", {
    "next/navigation": { redirect: url => { throw new Error(`REDIRECT ${url}`); } },
    "next/cache": { revalidatePath() {} },
    "@/lib/services/multiplayerService": { joinPrivateRoom: async input => {
      calls.push(JSON.parse(JSON.stringify(input)));
      if (error) throw new Error(error);
      return { id: "room-id", status };
    } },
  });
  return { calls, invoke: api.joinPrivateRoomAction };
}
function form(confirmation = "13-or-older") {
  const data = new FormData();
  data.set("code", "ABCD2345");
  data.set("guestNickname", "MathPlayer");
  if (confirmation !== undefined) data.set("ageConfirmation", confirmation);
  return data;
}

test("unacknowledged or invalid acknowledgment never creates a room participant", async () => {
  for (const confirmation of [null, "", "true", "under-13"]) {
    const f = action(), data = form();
    if (confirmation === null) data.delete("ageConfirmation");
    else data.set("ageConfirmation", confirmation);
    await assert.rejects(f.invoke(data), error => error.message.startsWith("REDIRECT /multiplayer/join?error=") && decodeURIComponent(error.message).includes("13 or older"));
    assert.equal(f.calls.length, 0);
  }
});

test("joins without a checkbox preserve lobby, play, and results destinations", async () => {
  for (const [status, suffix] of [["waiting", ""], ["countdown", ""], ["in-progress", "/play"], ["completed", "/results"]]) {
    const f = action({ status });
    await assert.rejects(f.invoke(form()), { message: `REDIRECT /multiplayer/room/room-id${suffix}` });
    assert.deepEqual(f.calls, [{ code: "ABCD2345", guestNickname: "MathPlayer" }]);
  }
});

test("service denials return to the join page without disclosing nickname in the URL", async () => {
  for (const error of ["Room not found.", "This room is full.", "Choose a different nickname."]) {
    const f = action({ error });
    await assert.rejects(f.invoke(form()), { message: `REDIRECT /multiplayer/join?error=${encodeURIComponent(error)}` });
  }
});

test("joining does not forward a browser-supplied identity or eligibility field to the room service", async () => {
  const f = action(), data = form();
  data.set("userId", "another-account");
  data.set("role", "owner");
  await assert.rejects(f.invoke(data), /REDIRECT/);
  assert.deepEqual(f.calls, [{ code: "ABCD2345", guestNickname: "MathPlayer" }]);
});
