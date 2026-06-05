# DK Portfolio – Nuxt 4

Full-stack personal portfolio with admin panel.  
Same design as the original static site, now fully dynamic with a SQLite cloud database.

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
| `/admin/personal` | Edit name, bio, city, email, social links, stats boxes |
| `/admin/skills` | Add, edit, delete, reorder skill circles |
| `/admin/experience` | Add, edit, delete experience/education timeline entries |
| `/admin/projects` | Add, edit, delete portfolio projects |
| `/admin/resume` | Update CV/resume download URL |
| `/admin/contacts` | Read contact form submissions |

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
