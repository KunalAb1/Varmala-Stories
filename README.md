# Alex Studio — Photography Portfolio (MERN)

A wedding/event photography portfolio site. Stack: MongoDB, Express, React (Next.js), Node —
plus ImageKit for free image hosting/CDN.

```
vsalex-clone/
  backend/    Express API (photos, contact form)
  frontend/   Next.js site (public pages + /admin/upload)
```

## 1. Accounts you need (all free)

1. **MongoDB Atlas** — https://www.mongodb.com/cloud/atlas/register
   - Create a free M0 cluster.
   - Create a database user (username/password).
   - Network Access → allow access from anywhere (0.0.0.0/0) for simplicity.
   - Copy the connection string (looks like `mongodb+srv://user:pass@cluster0.xxxx.mongodb.net/`).
2. **ImageKit.io** — https://imagekit.io/registration
   - After signup, go to Developer Options to get: Public Key, Private Key, URL Endpoint.
3. **Render** — https://render.com (for the backend)
4. **Vercel** — https://vercel.com (for the frontend)

## 2. Run locally first

### Backend
```bash
cd backend
cp .env.example .env
# fill in MONGODB_URI, IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT
npm install
npm run dev
```
Backend runs at http://localhost:5000 — visit it in a browser, you should see `{"status":"ok"}`.

### Frontend
```bash
cd frontend
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000
# fill in NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY and NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
npm install
npm run dev
```
Site runs at http://localhost:3000.

### Add your friend's photos
Go to **http://localhost:3000/admin/upload** — this page isn't linked anywhere on the public
site (bookmark it). Fill in title/category/location, tick "Show on homepage" for a few standout
shots, then upload. It uploads straight to ImageKit and saves the reference in MongoDB.

## 3. Deploy — Backend on Render

1. Push this whole project to a GitHub repo.
2. Render dashboard → New → Web Service → connect the repo.
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add environment variables (same as your `.env`): `MONGODB_URI`, `IMAGEKIT_PUBLIC_KEY`,
   `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`, `FRONTEND_URL` (set this after step 4 below).
7. Deploy. Note the URL Render gives you, e.g. `https://vsalex-backend.onrender.com`.

> Free tier note: Render spins the service down after ~15 min idle. The first request after
> that can take 30–50 seconds to respond. Fine for a low-traffic portfolio site.

## 4. Deploy — Frontend on Vercel

1. Vercel dashboard → Add New → Project → import the same repo.
2. Root Directory: `frontend`
3. Add environment variables: `NEXT_PUBLIC_API_URL` = your Render URL from step 3,
   `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`, `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`.
4. Deploy. You'll get a URL like `https://vsalex.vercel.app`.
5. Go back to Render and set `FRONTEND_URL` to that Vercel URL (needed for CORS), then redeploy
   the backend.

That's it — fully live on free tiers, no domain required. Share the `.vercel.app` link.

## 5. Before sharing it widely

- The `/api/contact` GET route (list of submitted enquiries) is currently open. Before real
  clients start submitting the form, either remove that route or add simple auth — happy to help
  add that when you're ready.
- Swap in your friend's real logo text / photos / bio copy in `app/about/page.js` and
  `app/page.js`.
- Once you're both happy with it, a custom domain is just pointing DNS at Vercel — no other
  changes needed.
