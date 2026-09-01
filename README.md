# DK Portfolio – Nuxt 4

Full-stack personal portfolio with an admin panel, backed by a SQLite cloud database.
Work is presented as case studies at `/portfolio/<slug>` rather than a plain image gallery.

## Stack
- **Nuxt 4** – Framework  
- **Turso** (libSQL/SQLite) – Free cloud database  
- **Drizzle ORM** – Database schema & queries  
- **nuxt-auth-utils** – GitHub OAuth admin login  
- **Resend** – Contact form emails  
- **Vercel** – Hosting  

---

## Setup (one-time before first deploy)

### 1. Copy environment variables
```bash
cp .env.example .env
```
Fill in all values in `.env` (see comments inside).

### 2. Create Turso database
```bash
# Install Turso CLI (if not installed)
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Create database
turso db create portfolio-dk

# Get credentials
turso db show portfolio-dk   # → copy the URL
turso db tokens create portfolio-dk  # → copy the token
```
Paste both into `.env` as `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`.

### 3. Create GitHub OAuth App
1. Go to [github.com/settings/developers](https://github.com/settings/developers) → **OAuth Apps** → **New OAuth App**
2. Set:
   - **Homepage URL**: `https://your-domain.com` (or `http://localhost:3000` for local dev)
   - **Authorization callback URL**: `https://your-domain.com/auth/github`
3. Copy **Client ID** and **Client Secret** → paste into `.env`
4. Set `ADMIN_GITHUB_LOGIN` to **your exact GitHub username**

### 4. Create Resend account
1. Go to [resend.com](https://resend.com) → create free account
2. Create an API key → paste as `RESEND_API_KEY`
3. Set `CONTACT_RECIPIENT_EMAIL` to your email

### 5. Push database schema
```bash
npm run db:push
```

### 6. Seed with your portfolio data
```bash
npm run db:seed
```

### 7. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### Option A: Vercel Dashboard (recommended)
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repository
3. Add all environment variables from `.env` in Vercel project settings
4. Deploy!

### Option B: Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

### Custom Domain
In Vercel project → **Settings** → **Domains** → add your domain.  
Then update the GitHub OAuth App callback URL to `https://your-domain.com/auth/github`.

---

## Admin Panel

Visit `/admin` → Login with GitHub (only your GitHub account is allowed).

| Page | What you can do |
|------|----------------|
| `/admin/personal` | Edit name, bio, current role, focus, contact details, links, and the "Selected impact" metrics |
| `/admin/skills` | Add, edit, delete, reorder skills — `category` groups them on the About page |
| `/admin/experience` | Add, edit, delete experience/education timeline entries |
| `/admin/projects` | Add, edit, delete case studies (slug, summary, problem / what I built / outcome, gallery) |
| `/admin/resume` | Update CV/resume download URL |
| `/admin/contacts` | Read contact form submissions |
| `/admin/analytics` | Daily visits/clicks, traffic sources, devices, and a raw event log |

---

## Update Resume PDF
To update the resume PDF:
1. Go to `/admin/resume`
2. Paste a new URL (Google Drive, Dropbox, or upload a new PDF to `public/assets/resume/`)
3. Click Save — the "Download CV" button on the About page updates immediately

---

## Development Commands
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run db:push      # Sync schema to Turso
npm run db:seed      # Seed database with portfolio data
npm run db:studio    # Open Drizzle Studio (DB GUI)
```

---

## Theming

The accent colour is a single CSS custom property in `app/assets/css/style.css`:

```css
:root { --accent: #fa5b0f; }
```

The runtime style switcher and its ten skin stylesheets were removed — change the
token to restyle the site.

---

## Adding a case study

Each project is a case study. Beyond the title and images, fill in:

| Field | What it is |
|-------|-----------|
| `slug` | URL segment — `/portfolio/<slug>` |
| `summary` | One line, shown on the work index card |
| `problem` | What was broken, slow, or missing before |
| `approach` | The design decisions and what you shipped |
| `outcome` | The result — lead with a number where you have one |

Projects with an empty `summary` or `outcome` are flagged in `/admin/projects`,
because the index card looks empty without them.

Backend and tooling projects with no UI to screenshot use hand-drawn SVG covers in
`public/img/projects/`. `AppProjectImage` serves those directly, since Vercel's image
optimiser rejects SVG; raster screenshots still go through `@nuxt/image`.

---

## Local database (try schema changes before touching production)

`npm run db:push` and `npm run db:seed` read `.env`, which points at **production
Turso**. To work against a throwaway SQLite file instead:

```bash
npm run db:push:local   # apply the schema to .data/local.db
npm run db:seed:local   # fill it with the seed content
npm run dev:local       # run the dev server against it
```

`.env.local` is a copy of `.env` with the database URL swapped for
`file:.data/local.db`; both it and `.data/` are gitignored. In dev the
`server/middleware/dev-auth.ts` middleware signs you in automatically, so
`/admin` works locally without the GitHub OAuth round trip.

To reset, delete `.data/local.db` and run the two db commands again.

---

## Analytics

Self-hosted, first-party, and cookie-free. Nothing here asks the visitor for a
permission prompt, and nothing here is shared with a third party.

**What is recorded**, per page view or tracked click:

| Source | Fields |
|--------|--------|
| Request headers | country, region, city (CDN-resolved), referrer |
| User-Agent | browser + major version, OS, device type |
| Page JavaScript | screen and viewport size, pixel ratio, language, timezone, light/dark preference, connection type, CPU cores, device memory, touch points, real page load time |
| URL | path, `utm_source` / `utm_medium` / `utm_campaign` |

**What is deliberately not recorded:** no cookie is set, no raw IP is stored,
and nothing that needs a browser permission (GPS location, camera, microphone,
clipboard, notifications) is touched.

Unique visitors are counted with `visitorHash` — a salted SHA-256 of
IP + User-Agent + the current UTC date. Because the date is part of the input,
the hash changes daily and cannot be used to follow anyone between days. This
is the Plausible/Fathom approach and is what keeps the setup consent-exempt
under most EU readings; storing a raw IP or a persistent cookie would not be.

Set `ANALYTICS_SALT` in the environment (see `.env.example`). Changing it
resets unique-visitor counts but is otherwise harmless.

Bots are filtered by User-Agent, `/admin` is never recorded, and events older
than 180 days are pruned opportunistically on write.

### Tracking a new link

Clicks are auto-classified: outbound links, `mailto:`, `tel:`, and PDF/CV
downloads are picked up with no markup. For anything else, add `data-track`:

```html
<NuxtLink to="/contact" data-track="cta_get_in_touch">Get in touch</NuxtLink>
```

The value is stored verbatim as the event `target` and grouped under
"Clicked links" in the dashboard.
