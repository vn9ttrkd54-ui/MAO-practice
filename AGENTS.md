<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Mu Question Publication and Label Calibration

The 2026, 2025, 2024, and 2023 MAO National Convention Mu Individual sets are withheld pending clear publication permission. Their unnumbered records are in `data/question-references/muNationals.ts`; read `data/question-references/README.md` before adding or relabeling Mu questions.

Use these internal references to calibrate difficulty (1-5), topic, and method labels for newly supplied approved questions. Do not import the reference file into application code, expose it through any catalog/API/UI, copy its questions into the public catalog, or assign it public question numbers. Restoring publication requires an explicit user instruction confirming permission.

Keep public Mu display numbers consecutive from 1, but preserve established IDs and original-source credit numbers independently. Do not delete or reassign stored progress, bookmarks, or history when display numbers change.

## Question Illustrations

Create standalone SVGs for all question and solution diagrams, graphs, and tables. Use actual vector paths, shapes, and text, never PNGs embedded inside SVGs. Preserve source geometry, values, endpoint conventions, labels, and accessible descriptions. Reuse one SVG when several questions share the same source figure. Keep solution-only diagrams behind solution reveal. Run `tests/questionVectors.test.mjs` and check desktop/mobile rendering when adding or changing an illustration. Do not retain unused raster copies in `public/questions`; source PDFs and Git history preserve provenance.
