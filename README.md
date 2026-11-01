# Mathematics Daily

Mathematics Daily is a mathematics practice website for high-school competitors, coaches, and teachers ages 13 and older. It combines a searchable question bank, adaptive practice, daily challenges, a guided AI tutor, and real-time multiplayer competition.

The approved bank currently contains **1,272 questions** across **Mu (Calculus), Alpha (Precalculus), and Theta (Algebra II)**, with worked solutions, source credits, difficulty/topic/method labels, and SVG illustrations where needed.

## Working demonstration

**[Open Mathematics Daily](https://www.mathematicsdaily.com/)**

- [Question Bank](https://www.mathematicsdaily.com/practice/question-bank): choose a division, filter questions, and open a problem and its solution.
- [Daily Trainer](https://www.mathematicsdaily.com/practice/trainer): practice with adaptive difficulty.
- [Daily Challenge](https://www.mathematicsdaily.com/challenge): division-specific daily questions and streaks.
- [Multiplayer](https://www.mathematicsdaily.com/multiplayer): public matches and private rooms. A match needs other participants.

Guest practice is available. Saving account progress and streaks requires signing in; Llama Tutor is available to signed-in users on individual Question Bank pages at desktop widths. Reviewers do not need production database or hosting-dashboard access.

## Technical architecture

The project is a single Next.js application with separate interface components, application services, and database migrations.

| Layer | How it works | Source |
| --- | --- | --- |
| Interface | Next.js App Router, React, and TypeScript; Tailwind CSS and CSS Modules for styling; KaTeX for mathematics. | [`app/`](app/), [`components/`](components/) |
| Content | Typed question catalogs and SVG figures. Listing pages send lightweight metadata; individual pages load the selected problem. | [`data/questions/`](data/questions/), [`lib/questionBankListing.ts`](lib/questionBankListing.ts), [`public/questions/`](public/questions/) |
| Services and storage | Next.js server routes and service modules handle sensitive operations. Supabase provides Auth, PostgreSQL, row-level policies, and transactional database functions for progress and gameplay. | [`lib/services/`](lib/services/), [`app/api/`](app/api/), [`supabase/migrations/`](supabase/migrations/) |
| Multiplayer | Realtime notifications trigger refreshed snapshots. The server/database determines membership, timing, scoring, and match completion; recovery reads handle missed events. | [`lib/multiplayerRealtime.ts`](lib/multiplayerRealtime.ts), [`lib/multiplayerRecovery.ts`](lib/multiplayerRecovery.ts) |
| Llama Tutor | Server-side OpenAI Responses API calls combine teaching instructions, the current question, and question-specific curriculum guidance where provided. Official answers and solutions enter the prompt after reveal. | [`lib/aiTutor.ts`](lib/aiTutor.ts), [`lib/tutorGuidance.ts`](lib/tutorGuidance.ts), [`lib/tutorInstructions.ts`](lib/tutorInstructions.ts) |

Vercel hosts the application. Supabase stores account and gameplay records separately from the source repository. Privileged database and AI keys remain server-side.

## Development history

Before public release on November 1, 2026, the repository history was sanitized to remove permission-restricted question content, local Supabase connection metadata, and personal email addresses. All 707 existing commits, their messages, authors' display names, dates, and order were retained; commit IDs changed. Withheld question references now contain only editorial metadata. The latest tree also includes the corresponding publication notes and test adjustments. This cleanup does not establish permission to redistribute third-party question material beyond its recorded terms.

These milestones describe the development recorded in the [Git history](https://github.com/vn9ttrkd54-ui/MAO-practice/commits/main):

| Period | Recorded work |
| --- | --- |
| July 2026 | Next.js scaffold and navigation prototype, followed by the first Trainer version and dashboard progress sections. |
| August 2026 | Supabase authentication, persistent progress and bookmarks, daily challenge services, and multiplayer schemas and private-room setup. |
| September 2026 | Curriculum-guided Llama Tutor, staged hints and work-checking, usage accounting, retry-safe practice attempts, and account recovery improvements. |
| October 2026 | Multiplayer recovery and handoff improvements; lighter Question Bank browsing; isolated Trainer timer rendering; reviewed catalogs, SVG figures, and source credits; New York challenge dates and community problem submissions. |

### Engineering problems and changes

- **Heavy question listings:** separated metadata from full problems, rendered tiles in batches, and prefetched on intent. See [Question Bank performance](docs/performance-stage-3.md).
- **Missed multiplayer events and slow transitions:** paired notifications with authoritative snapshots, coalesced reads, bounded recovery polling, and transactional scoring. See [lobby recovery](docs/multiplayer-lobby-recovery.md) and [faster handoffs](docs/multiplayer-fast-handoffs.md).
- **Uncertain tutor requests:** bounded automatic retries and used durable usage reservations so a timeout does not automatically refund potentially billed work. See [reliability](docs/performance-stage-5.md) and [accounting](docs/tutor-accounting-rollout.md).
- **Inconsistent day boundaries:** daily challenge dates use `America/New_York`, including daylight-saving changes, through the [shared date helper](lib/challengeDate.ts) and matching SQL migration.

The linked reports describe their own validation scope. Local tests and simulated clients do not establish production concurrency capacity.

## How to run locally

Use **Node.js 24**, npm, and a separate Supabase development project.

```bash
git clone https://github.com/vn9ttrkd54-ui/MAO-practice.git
cd MAO-practice
npm ci
```

Apply the reviewed SQL prerequisites from [`supabase/migrations/`](supabase/migrations/) in dependency order and configure Supabase Auth for your local URL. This repository does not provide a one-command, fully seeded database bootstrap. Existing installations require coordinated app/database updates; follow the [practice](docs/practice-attempt-rollout.md), [timing](docs/practice-timing-rollout.md), [recovery](docs/recovery-rollout.md), [Auth](docs/supabase-auth-settings.md), and [multiplayer](docs/multiplayer-fast-handoffs.md) guides rather than blindly pushing pending migrations to production.

Create an untracked `.env.local` using your development project's credentials:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_DEVELOPMENT_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY=YOUR_DEVELOPMENT_SERVER_SECRET_KEY
```

Only the URL and publishable key belong in browser configuration. Keep server secrets, `.env.local`, and real account/database exports out of Git. Optional Google sign-in requires its provider and redirect URLs to be configured separately.

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000). For a production build, run `npm run build`, then `npm start`. The live demonstration is the quickest way to review the project without provisioning services.

### Optional: Llama Tutor

Add `OPENAI_API_KEY` as a server-only environment variable. Optional settings are `OPENAI_TUTOR_MODEL` (default `gpt-5-mini`) and `TUTOR_DAILY_MESSAGE_LIMIT` (default `15`). The tutor also requires its migrations through `046_ai_tutor_daily_slots.sql`; follow the [accounting rollout](docs/tutor-accounting-rollout.md) and [daily-slot rollout](docs/tutor-daily-slots-rollout.md) for existing installations.

Initial migrations seed a shared pool of 1,000,000 tokens with a 25,000-token reserve. Accounting includes confirmed usage and conservative holds for uncertain requests. Never reset usage or delete ledger rows to refill it: review outstanding reservations and adjust the limit deliberately. This application budget is not a provider billing cap. Conversations are temporary and clear when the tutor closes, the page changes, or the tab is hidden.

## Verification

```bash
npm run lint
node --experimental-strip-types --test tests/*.test.mjs
npm run build -- --webpack
```

Additional checks live in [`tests/`](tests/). After building and installing Chromium with `npx playwright install chromium`, run `node --experimental-strip-types tests/stageThree.next.browser.mjs` for local Question Bank navigation checks. Browser fixtures use synthetic data; database suites generally require a separately installed PGlite module as specified by each script. Live multiplayer/load scripts are separate and can modify their target environment.

## Credits and external sources

- **Development:** Orlando Science Mu Alpha Theta. Participating Mu Alpha Theta National Student Delegates contributed to the question bank.
- **Student delegate endorsements:** Mu Alpha Theta National Student Delegates and Florida Association of Mu Alpha Theta Student Delegates, as listed on the [Credits page](https://www.mathematicsdaily.com/credits). These are student delegate endorsements, not an endorsement by the national organization.
- **Question sources:** Selected Mu Alpha Theta and Florida Association of Mu Alpha Theta competition materials are reproduced or adapted under the project's recorded permissions, with per-question attribution. Restricted National Convention Mu sets are withheld from the application pending clear publication permission; see the [publication policy](docs/mu-national-permission.md). Question rights remain with their respective creators.
- **Libraries and services:** [Next.js](https://nextjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [Supabase](https://supabase.com/), [KaTeX](https://katex.org/), [Lucide](https://lucide.dev/), [Geist fonts](https://vercel.com/font), [Vercel](https://vercel.com/), and the [OpenAI API](https://developers.openai.com/api/docs/). Testing uses [Playwright](https://playwright.dev/) and, for isolated database suites, [PGlite](https://pglite.dev/). Dependency versions are in [`package.json`](package.json) and [`package-lock.json`](package-lock.json).

Mathematics Daily is an independent educational project and is not affiliated with, sponsored by, or endorsed by Mu Alpha Theta as an organization. Question permissions do not imply a blanket license to redistribute all repository materials.
