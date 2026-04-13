# TatvaOps Vendor Profile Page

Production-ready vendor profile page for TatvaOps, built with Next.js + React + TypeScript + Tailwind.

## Links

- GitHub repo: [tejasm-tatvaops/vendor-ui](https://github.com/tejasm-tatvaops/vendor-ui)
- Live app (Vercel): [vendor-profilepage.vercel.app](https://vendor-profilepage.vercel.app)
- Deployment URL: [vendor-profilepage-3bi9ydu0h-coooltejasdagr-5865s-projects.vercel.app](https://vendor-profilepage-3bi9ydu0h-coooltejasdagr-5865s-projects.vercel.app)

## Features

- Dynamic vendor profile data from Supabase
- Ratings and review breakdown
- Portfolio with before/after comparison slider
- Pricing tiers, availability, trust score, AI insight
- Certifications gallery with document preview
- Sticky CTA actions and location map
- Loading skeletons, empty states, and error states

## Tech Stack

- Next.js 15 + React 19 + TypeScript
- TailwindCSS
- Supabase JS client

## Project Setup

### 1) Clone and install

```bash
git clone https://github.com/tejasm-tatvaops/vendor-ui.git
cd vendor-ui
npm install
```

### 2) Add environment variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_VENDOR_ID=your_default_vendor_uuid
NEXT_PUBLIC_BOOK_SITE_VISIT_URL=https://your-site-visit-link
NEXT_PUBLIC_CONTACT_TATVAOPS_URL=https://your-contact-link
```

Notes:
- `NEXT_PUBLIC_VENDOR_ID` is used as default if no `vendorId` query param is present.
- You can override vendor at runtime with `?vendorId=<uuid>`.

### 3) Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Build and Preview

```bash
npm run build
npm run preview
```

## Deploy to Vercel

### First-time setup

```bash
npm i -g vercel
vercel login
vercel --prod --name vendor-profilepage
```

### Subsequent deployments

```bash
vercel --prod
```

After deploy, configure the same `NEXT_PUBLIC_*` variables in Vercel Project Settings -> Environment Variables.

## Runtime Wiring

- Vendor resolution:
  - Query param: `?vendorId=<uuid>`
  - Fallback: `NEXT_PUBLIC_VENDOR_ID`
- CTA URLs:
  - `NEXT_PUBLIC_BOOK_SITE_VISIT_URL`
  - `NEXT_PUBLIC_CONTACT_TATVAOPS_URL`

## Available Scripts

- `npm run dev` - start local dev server
- `npm run build` - type-check + production build
- `npm run preview` - preview production build locally
- `npm run lint` - run lint checks
