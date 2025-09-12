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

## Database (Prisma)

If you haven't set up the database yet, make sure `DATABASE_URL` in your environment points to a Postgres instance.

Run the following to generate the client, create the initial migration and seed the database with example diseases:

```powershell
pnpm prisma generate; pnpm prisma migrate dev --name init; pnpm run prisma:seed
```

The seed script will upsert example diseases: Cholera, Diarrhea, Typhoid and Hepatitis A.

### Running locally (Tailwind)

This project uses Tailwind CSS (v4) via PostCSS. If styles don't appear, ensure dependencies are installed and run the dev server:

```powershell
pnpm install
pnpm dev
```

If your editor flags `@tailwind` or `@apply` as unknown rules, that's the CSS linter — the build will process them correctly when the dev server is running.
