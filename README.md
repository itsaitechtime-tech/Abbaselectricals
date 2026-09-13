# Barq Lumi — marketing site

Public brand: **Barq Lumi** (Instagram @barqlumi). Legal entity: **ABBAS AHMED SANITARY & ELECTRIC WARE TR LLC**. Trading/domain: Abbas Electricals / abbaselectricals.com.

- Stack: Next.js App Router, TypeScript, Tailwind CSS v4
- Output: static export (`output: 'export'`) → `out/`
- Canonical: https://www.abbaselectricals.com

## Local preview

```bash
npm install
npm run build
npx serve out
```

Or during development:

```bash
npm run dev
```

Open the printed local URL (typically `http://localhost:3000` for `next dev`, or the port `serve` reports).

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/services/` | Services |
| `/projects/` | Projects |
| `/about/` | About |
| `/contact/` | Contact |

## Deploy notes

Build artefacts live in `out/`. Deploy that folder to any static host (Vercel, Cloudflare Pages, S3, etc.).

### Zoho DNS (later — do not implement here)

When go-live is approved, in Zoho Domains / DNS:

- `@` → **A** record to the host IP (or Zoho **ALIAS** / ANAME if the host supports it)
- `www` → **CNAME** to the host target

DNS is intentionally out of scope for this Phase 1 build.

## Facts on the site

- Tel: 055 341 8850 (`tel:+971553418850`)
- WhatsApp: 052 850 0094 (`https://wa.me/971528500094`)
- Email: Info@abbaselectricals.com
- Instagram: @barqlumi
- Address: Muweilah, Sharjah, UAE · P.O. Box 68444
- VAT TRN (footer only): 100044362000003

No trade license number is published.
