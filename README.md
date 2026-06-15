# Meridian

Meridian is a static browser game served from `public/index.html` with hosted multiplayer room storage provided by Vercel API routes and a Vercel Marketplace KV-compatible Redis store.

## Project layout

- `public/index.html` — the static frontend app.
- `public/assets/` — all theme, token, dice, card, texture, and building assets. The app loads them with `/assets`-relative paths.
- `api/room-get.js` — reads room state from Redis by key, for example `room:ABCDE`.
- `api/room-set.js` — writes room state to Redis and refreshes the inactive-room TTL.
- `api/kv.js` — shared Redis REST helper and room-key validation.

## Local development

1. Install the Vercel CLI dependency:

   ```sh
   npm install
   ```

2. Start the local Vercel dev server:

   ```sh
   npm run dev
   ```

3. Open the local URL printed by Vercel, usually `http://localhost:3000`.

If Redis environment variables are not configured locally, the browser storage adapter automatically falls back to `localStorage`. That fallback is intended only for local development or backend outages; it does not create shared multiplayer rooms across devices.

## Vercel deployment

1. Create or select a Vercel project for this repository.
2. Add a KV-compatible Redis database from the Vercel Marketplace. Upstash Redis works with the REST API variables used by these routes.
3. Connect the store to the Vercel project or manually add the required environment variables listed below.
4. Deploy the project with Vercel. Vercel serves `public/index.html` as the static app and exposes the API routes under `/api`.

## Required environment variables

Set these in Vercel Project Settings → Environment Variables, or link a Marketplace KV/Redis integration that provides them:

- `KV_REST_API_URL` — Redis REST endpoint. `UPSTASH_REDIS_REST_URL` is also accepted.
- `KV_REST_API_TOKEN` — Redis REST token. `UPSTASH_REDIS_REST_TOKEN` is also accepted.

Optional:

- `ROOM_TTL_SECONDS` — inactive room expiration in seconds. Defaults to `86400` seconds (24 hours).

## Setting up Upstash Redis / Vercel Marketplace KV

1. In Vercel, open the project dashboard.
2. Go to the Marketplace/Storage area and create an Upstash Redis or KV-compatible Redis store.
3. Attach the store to the Meridian project so Vercel injects the Redis REST URL and token.
4. Confirm the deployment environment has `KV_REST_API_URL` and `KV_REST_API_TOKEN` (or the `UPSTASH_REDIS_REST_*` equivalents).
5. Redeploy after adding or changing environment variables.

## Multiplayer storage behavior

- The frontend calls `window.storage.get('room:' + code)` and `window.storage.set('room:' + code, state)`.
- The browser-side adapter sends those calls to `/api/room-get` and `/api/room-set`.
- API routes store room JSON under keys such as `room:ABCDE` in Redis.
- Every successful write refreshes the TTL so inactive rooms expire automatically after 24 hours by default.
- If the API is missing or unavailable, reads and writes fall back to browser `localStorage` so local testing can continue.

## Manual verification checklist

After deploying or running locally with Redis configured:

- Static assets load from `/assets` without 404s.
- Creating a room stores `room:<CODE>` in Redis.
- Joining that room from a second browser, profile, or device loads the same room state.
- Room state persists and updates across multiple tabs through the existing polling loop.
- Disabling or omitting the backend causes local `localStorage` fallback instead of a hard failure.
