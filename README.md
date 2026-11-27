# The Hype Social | Digital Marketing Agency Platform

Production web platform for **The Hype Social** (Surat, Gujarat, India) built with the original editorial frontend UI, **Supabase** (Cloud PostgreSQL, Auth & Row-Level Security), and **Vercel** hosting.

---

## Project Structure

- `public/` — Static frontend (`index.html`, `css/style.css`, `js/app.js`, `images/`)
- `api/config.js` — Vercel serverless endpoint exposing public Supabase config (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)
- `supabase/schema.sql` — Complete PostgreSQL schema, triggers, RLS policies, and starter seed data
- `server.js` — Zero-dependency local development server (`npm start`)
- `vercel.json` — Vercel static output & security headers config

---

## Step 1: Set Up Supabase (Free Cloud Database & Auth)

1. Go to [supabase.com](https://supabase.com) and create a free account & new project (e.g. `hypesocial-prod`).
2. Open **SQL Editor -> New Query**, paste the contents of `supabase/schema.sql`, and click **Run**.
   - This creates `profiles`, `services`, `works`, `briefs`, and `contact_messages` tables, enables Row-Level Security (RLS), and seeds starter services & case studies.
3. Go to **Project Settings -> API** and copy:
   - **Project URL** (`SUPABASE_URL`)
   - **anon / public key** (`SUPABASE_ANON_KEY`)
4. To create your Agency Admin account:
   - Sign up on the website's **Sign In -> Create Client Account** tab using your admin email.
   - In Supabase **SQL Editor**, run:
     ```sql
     UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin-email@domain.com';
     ```

---

## Step 2: Run Locally (Optional Preview)

1. Copy `.env.example` to `.env` and fill in `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
2. Start the local server:
   ```bash
   npm start
   ```
3. Open `http://localhost:3000`.

---

## Step 3: Push to GitHub & Auto-Deploy on Vercel (Free Hosting)

1. Initialize and push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial Hype Social production build"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/hypesocial-official.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, and click **Add New -> Project**.
3. Import your `hypesocial-official` repository.
4. Under **Environment Variables**, add:
   - `SUPABASE_URL` = your Supabase Project URL
   - `SUPABASE_ANON_KEY` = your Supabase anon public key
5. Click **Deploy**.
   - Every future `git push` to GitHub will automatically rebuild and update your live Vercel site, while all user logins, briefs, services, and contact inquiries stay synced in Supabase.
