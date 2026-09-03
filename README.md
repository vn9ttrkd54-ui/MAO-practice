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

1. Apply `supabase/migrations/021_ai_tutor_foundation.sql` to the linked Supabase project.
2. Add `OPENAI_API_KEY` as a server-only environment variable locally and in Vercel.
3. Optionally set `OPENAI_TUTOR_MODEL`; it defaults to `gpt-5-mini`.
4. Optionally set `TUTOR_DAILY_MESSAGE_LIMIT` to a positive whole number. When it is omitted, the daily cap remains effectively disabled for testing while the shared budget and rate limits stay active.

The migration starts with a shared pool of 1,000,000 tokens and keeps 25,000 tokens in reserve. Change `token_limit` or reset `tokens_used` in the single `ai_tutor_budget` row when intentionally adjusting the pool. Never expose the OpenAI key through a `NEXT_PUBLIC_` variable.

Before a production launch, set `TUTOR_DAILY_MESSAGE_LIMIT` to the desired per-user cap in Vercel and verify the shared budget row. Tutor conversations are temporary and are cleared when the tutor closes, the page changes, or the tab is hidden.

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
