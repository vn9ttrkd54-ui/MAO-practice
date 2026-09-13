This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Llama Tutor setup

The desktop Question Bank tutor requires:

1. Apply the reviewed migrations in order through `046_ai_tutor_daily_slots.sql` to the intended Supabase project. For an existing live tutor, use the [gated rollout](docs/tutor-accounting-rollout.md) and [daily-slot rollout](docs/tutor-daily-slots-rollout.md); do not replace accounting functions while old tutor requests are still running. Existing practice deployments also require the [attempt rollout](docs/practice-attempt-rollout.md) and [bounded timing rollout](docs/practice-timing-rollout.md). Recovery changes require the [recovery rollout](docs/recovery-rollout.md). Coordinate the app and database updates, not a blind migration push. After deployment, review the [non-CAPTCHA Auth settings](docs/supabase-auth-settings.md) before enabling provider password rules.
2. Add `OPENAI_API_KEY` as a server-only environment variable locally and in Vercel.
3. Optionally set `OPENAI_TUTOR_MODEL`; it defaults to `gpt-5-mini`.
4. Optionally set `TUTOR_DAILY_MESSAGE_LIMIT` to a whole number from 1 to 1,000. It defaults to 15 messages per user per day.

The initial migration starts with a shared pool of 1,000,000 tokens and keeps 25,000 tokens in reserve. Migration 041 makes `tokens_used` include both confirmed usage and conservative estimates for requests whose usage is unknown. Expired concurrency leases do not refund these estimates. Never reset `tokens_used` or delete ledger rows to refill the pool: doing so can erase outstanding spend or break later settlement. Intentionally adjust `token_limit` after checking provider usage and outstanding holds instead. The token pool is not a dollar-denominated provider billing cap. Never expose the OpenAI key through a `NEXT_PUBLIC_` variable.

Migration 046 also holds a daily message slot for unresolved requests after their concurrency lease expires. Known failures release uncounted slots; uncertain outcomes keep them until resolved. The allowance shown by the tutor includes these pending slots. No paid Supabase upgrade or CAPTCHA is needed for this change.

Before a production launch, verify the daily limit and shared budget row. Tutor conversations are temporary and are cleared when the tutor closes, the page changes, or the tab is hidden.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
