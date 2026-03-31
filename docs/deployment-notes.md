## Recommended Production Setup

- Frontend: Vercel
- Backend: Render Web Service
- Data: Supabase for durable storage

This project is split cleanly for that setup:

- `client/` is a Vite React SPA
- `server/` is a Node/Express API

## Why This Setup Fits Best

- Vercel is a strong fit for the static frontend and React routing
- Render keeps the Express API online with restart handling, logs, and health checks
- This keeps deployment simple without forcing you onto a VPS too early

## Data Persistence

The backend now supports Supabase as the primary data store.

- if `SUPABASE_URL` and a Supabase key are present, the API uses Supabase tables
- if they are missing, the API falls back to local `server/db.json`

That makes rollout safer: you can deploy first, then cut over to Supabase without breaking local development.

## Frontend Deployment On Vercel

Use `client/` as the project root.

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

Set environment variables:

- `VITE_API_BASE=https://your-render-service.onrender.com/api`
- `VITE_PUBLIC_BASE=/`

`client/vercel.json` is included so deep links like `/dashboard` load correctly.

## Backend Deployment On Render

Use `server/` as the service root.

- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/health`

Set environment variables:

- `PORT=5000`
- `CORS_ORIGIN=https://your-frontend.vercel.app`
- `SUPABASE_URL=https://your-project.supabase.co`
- `SUPABASE_ANON_KEY=your-anon-key`
- `SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`

If you later add a custom domain, update `CORS_ORIGIN` to that domain.

`render.yaml` is included to make the backend setup faster.

## Supabase Setup

1. Create a Supabase project.
2. Run `database/schema.sql` in the Supabase SQL editor.
3. Set the Supabase environment variables in Render.
4. From `server/`, run `node scripts/sync-db-to-supabase.mjs` once to import the current `db.json` records.

After that, the backend will start reading and writing durable hosted data instead of local JSON.

## Keep It Online Reliably

- use a paid backend plan if you want less sleeping and better uptime
- add uptime monitoring against `/health`
- keep frontend and backend env vars in sync
- rotate the Supabase service role key if it was ever exposed
