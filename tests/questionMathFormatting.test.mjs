import assert from "node:assert/strict";
import test from "node:test";
import katex from "katex";

import { alphaQuestions } from "../data/questions/alpha.ts";
import { muQuestions } from "../data/questions/mu.ts";
import { thetaQuestions } from "../data/questions/theta.ts";

// Keep this in sync with the math delimiters accepted by MathText.
const mathDelimiter = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/g;
const diagramToken = /\[\[solution-diagram:mu-(?:194|196|201|217|227|302|313|320|325)\]\]/g;

test("every catalog question, choice, and solution renders its LaTeX", () => {
  const divisions = [muQuestions, alphaQuestions, thetaQuestions];
  assert.ok(divisions.every((questions) => questions.length > 0));

  for (const questions of divisions) {
    for (const question of questions) {
      const fields = [
        ["question", question.question],
        ...question.choices.map((choice, index) => [`choice ${index + 1}`, choice]),
        ["solution", question.solution],
      ];

      for (const [field, value] of fields) {
        const label = `${question.division} ${question.id} ${field}`;
        const outsideMath = value.replace(mathDelimiter, "").replace(diagramToken, "");
        assert.doesNotMatch(outsideMath, /\\/, `${label} has undelimited LaTeX`);
        assert.doesNotMatch(
          outsideMath,
          /[A-Za-z0-9)](?:\^|_)[A-Za-z0-9({]/,
          `${label} has unrendered superscript or subscript notation`,
        );

        for (const match of value.matchAll(mathDelimiter)) {
          const display = match[1] !== undefined;
          assert.doesNotThrow(
            () => katex.renderToString(match[1] ?? match[2], {
              displayMode: display,
              throwOnError: true,
              strict: false,
              trust: false,
              maxExpand: 1000,
            }),
            `${label} contains invalid LaTeX: ${match[0]}`,
          );
        }
      }
    }
  }
});
