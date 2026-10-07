import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("removed recent-list components and their isolated helper stay unused", () => {
  const source = readFileSync(new URL("../components/dashboard/DashboardClient.tsx", import.meta.url), "utf8");
  for (const name of ["RecentActivitySection", "RecentSessionsSection", "SessionMetric"]) {
    assert.ok(!source.includes(name));
    assert.ok(!existsSync(new URL(`../components/dashboard/${name}.tsx`, import.meta.url)));
  }
  assert.ok(source.includes("<TrainerChartsSection trainer={trainer}"));
  const charts = readFileSync(new URL("../components/dashboard/TrainerChartsSection.tsx", import.meta.url), "utf8");
  assert.ok(charts.includes("trainer.recentSessionAccuracy.map"));
  assert.ok(charts.includes("trainer.sessionsByDivision.map"));
});
