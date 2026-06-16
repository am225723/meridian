# Meridian Multiplayer QA

Date: 2026-06-16

## Environment note

Final QA was run from the repository container against the static app and API-route code. A full deployed-device browser pass could not be completed from this environment because:

- No browser executable was available (`chromium`, `chromium-browser`, `google-chrome`, and `firefox` were not found).
- Browser automation packages (`playwright`, `puppeteer`, and `selenium-webdriver`) were not installed, and `npx playwright --version` was blocked by the npm registry with `403 Forbidden`.
- Vercel production logs could not be queried because the CLI had no existing credentials and the login request to `vercel.com` failed with DNS `EAI_AGAIN`.
- Upstash/Vercel Redis environment variables were not present in the container, so live Redis key creation and TTL inspection could not be performed here.

No gameplay changes were made during this QA pass.

## Automated checks completed

- `npm run check` passed and validated the API route JavaScript with `node --check api/*.js`.
- Extracted the inline application script from `public/index.html` and validated it with `node --check /tmp/meridian-index-script.js`.
- Mocked the Redis REST API and verified `api/room-set.js` sends `['SET', 'room:ABCDE', '{"rev":1}', 'EX', '86400']`, confirming `room:CODE` key format and the default 24-hour TTL command.
- Mocked the Redis REST API and verified `api/room-get.js` sends `['GET', 'room:ABCDE']` and returns the stored value.
- Confirmed the expected Luxury Estate asset inventory exists: board/tabletop textures, card assets, six dice faces, ten group icons, six player tokens, and house/hotel building assets.
- Served `public/` locally with `python3 -m http.server 4175` and fetched `/` plus `/assets/luxury-estate/tokens/crown.svg` successfully.

## Checklist status legend

- **Passed static/API**: Verified by code inspection, syntax checks, mocked API contract checks, or local HTTP fetches.
- **Blocked in container**: Requires live browser/device automation, Vercel credentials/log access, or live Upstash credentials unavailable in this container.

## QA checklist

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Create room works. | Passed static/API; blocked for live browser | Frontend saves rooms as `room:` plus uppercase code; API accepts `room:` keys and writes to Redis with `SET ... EX 86400`. Live click flow needs a browser. |
| 2 | Join room works from a second device. | Passed static inspection; blocked for live browser | Join loads the same `room:CODE`, appends a player during lobby, saves, and starts polling. Cross-device confirmation needs a deployed browser session. |
| 3 | Starting game updates all players. | Passed static inspection; blocked for live browser | Starting the game increments `rev`, saves room state, and polling compares `remote.rev` to update other clients. Live confirmation needs two browser clients. |
| 4 | Refresh/rejoin works during active game. | Passed static inspection; blocked for live browser | Room links and last-session restore include room code, player ID, and player name; active games restore to the game screen when the player still exists. Live refresh confirmation needs a browser. |
| 5 | Copy room link restores the correct player. | Passed static inspection; blocked for live browser | Copy links include `#ROOM:PLAYER_ID:PLAYER_NAME`, and initialization restores that exact player ID. Clipboard/link behavior needs browser confirmation. |
| 6 | Tokens appear in lobby, sidebar, and board. | Passed static inspection/assets; blocked for visual browser | Token rendering uses the active asset pack for player chips and board mini-tokens, and all Luxury Estate token SVGs are present. Visual rendering needs a browser. |
| 7 | Tokens move after rolling. | Passed static inspection; blocked for visual browser | Rolling updates player position and board mini-tokens have the `tokenMove` animation. Visual movement needs a browser. |
| 8 | Dice, cards, rent, buying, auctions, jail, trades, and property management still work. | Passed static inspection; blocked for interactive browser | The relevant action handlers and state transitions are present. Full gameplay regression needs interactive browser testing. |
| 9 | Board labels do not shift during play. | Blocked in container | Requires visual comparison while playing in a browser. |
| 10 | No broken images. | Passed static/assets and HTTP fetch; blocked for visual browser | Luxury Estate assets exist and image tags remove themselves on load error. Visual confirmation needs a browser. |
| 11 | No console errors. | Blocked in container | Requires a browser console or browser automation. Static script syntax passed. |
| 12 | No 503s in Vercel logs. | Blocked in container | Vercel CLI log query could not authenticate or reach `vercel.com` from this container. |
| 13 | Upstash room keys are created as `room:CODE` and expire after 24 hours. | Passed API contract; blocked for live Upstash inspection | Mocked API confirmed `SET room:ABCDE ... EX 86400`; live Upstash key/TTL inspection needs production credentials. |

## Recommended remaining live pass

Run this against the deployed Vercel URL with two real browsers/devices and authenticated Vercel/Upstash access:

1. Open Browser A, create a room, and confirm a `room:CODE` key appears in Upstash with TTL near `86400` seconds.
2. Open Browser B or a second device, join with the same code, and confirm both lobbies show both players and their tokens.
3. Copy Browser A's room link, open it in a fresh Browser A profile/tab, and confirm it restores the host player rather than creating a new player.
4. Start the game and confirm Browser B automatically enters the active game after polling.
5. Refresh both browsers during the active game and confirm each restores the correct player and current game state.
6. Exercise rolling, buying, declining/auctioning, paying rent, card draws, jail, trades, building/selling houses, mortgaging/unmortgaging, and bankruptcy/debt flows.
7. Watch board labels and token positions during movement to confirm labels remain stable and tokens visibly move.
8. Keep DevTools Console and Network open to confirm no console errors, no broken image requests, and no unexpected failed `/api/room-get` or `/api/room-set` responses.
9. Query Vercel logs for status `503` over the QA window and confirm no results.
