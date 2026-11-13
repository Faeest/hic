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

## Ops notes

### Image uploads
`ImageField` downscales to a 2000px longest edge and re-encodes to WebP (q=0.82)
in the browser before uploading, so a 4 MB camera JPEG lands in the `media`
bucket at a few hundred KB. SVG and GIF are passed through untouched, and files
under 400 KB are left alone. The server still enforces the 10 MB bucket limit.

### Keeping Supabase awake

Free Supabase projects pause after ~7 days without activity. Three layers, in
order of reliability:

1. **GitHub Actions (primary)** — `.github/workflows/keepalive.yml` runs daily on
   GitHub's infrastructure, so it keeps working when the VPS is down. It needs two
   repository secrets: `SUPABASE_URL` and `SUPABASE_ANON_KEY` (Settings → Secrets
   and variables → Actions). Trigger it once from the Actions tab to confirm.
   Note: GitHub disables scheduled workflows after ~60 days without repo activity.
2. **systemd user timer on the VPS (fallback)** — `deploy/keepalive.sh` calls the
   Supabase REST API directly, so it does not depend on the app being up. The box
   has no `crontab` (fish shell, systemd only; `hic.service` is a user unit):

   ```bash
   cp deploy/hic-keepalive.{service,timer} ~/.config/systemd/user/
   systemctl --user daemon-reload
   systemctl --user enable --now hic-keepalive.timer
   systemctl --user list-timers hic-keepalive.timer
   ```

3. **`GET /api/keepalive`** — the in-app endpoint (one trivial query, optional
   `KEEPALIVE_TOKEN`). Useful for uptime checks; the cron layers do not need it.

### Media library

`/admin/media` lists every object in the `media` bucket (one folder level, newest
first) with size, folder and date, plus copy-URL and permanent delete. Deleting a
file that a row still references leaves a broken image — the confirm dialog says
so.
