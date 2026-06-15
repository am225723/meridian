# Meridian Luxury Estate Asset Pack Manual QA

Date: 2026-06-15

## Environment note

Automated real-browser QA could not be completed in this container because no browser executable was available (`chromium`, `chromium-browser`, `google-chrome`, and `firefox` were not found), and no browser automation package (`playwright`, `puppeteer`, or `selenium-webdriver`) was installed. Per the task constraint, no new packages were installed.

Static/render-harness checks were performed where possible:

- `node --check` on the extracted application script from `meridian.html`.
- Local HTTP smoke check using `python3 -m http.server` and fetching `http://127.0.0.1:4173/meridian.html`.
- Luxury Estate asset-file inventory check under `assets/luxury-estate/`.

## Checklist status legend

- **Static covered**: Covered by static inspection or non-browser harness checks in this environment.
- **Requires visual browser confirmation**: Must be confirmed in an actual browser because it depends on rendered UI, image painting, animation, multi-tab synchronization, or console state.

## QA checklist

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Home screen loads with no visible broken images. | Requires visual browser confirmation | Static script syntax and HTTP serving passed; visual image state needs a browser. |
| 2 | Create room works. | Requires visual browser confirmation | Room creation depends on runtime storage/browser interaction. |
| 3 | Join room works in a second tab/window. | Requires visual browser confirmation | Requires two browser tabs/windows and shared room storage. |
| 4 | Host can select Luxury Estate. | Static covered + requires visual browser confirmation | Luxury Estate is the default theme and is present in the theme catalog; browser confirmation should verify click behavior. |
| 5 | Host can select each Designer Style: Architectural Depth, Cinematic Glow, Gallery Minimal. | Static covered + requires visual browser confirmation | All three designer styles are present in the selector; browser confirmation should verify selection state and styling. |
| 6 | Non-host sees the selected theme and designer style. | Static covered + requires visual browser confirmation | Read-only setup renders theme and designer labels; browser confirmation should verify live sync in a second tab/window. |
| 7 | Start game works. | Requires visual browser confirmation | Requires two players in a browser room. |
| 8 | Board texture and tabletop texture display visually. | Static covered + requires visual browser confirmation | `board.svg` and `tabletop.svg` exist under `assets/luxury-estate/textures/`; painting must be visually confirmed. |
| 9 | Player tokens display in lobby player chip, sidebar player list, and board space mini-token. | Static covered + requires visual browser confirmation | Luxury token SVGs exist and rendering paths are wired for lobby, sidebar, and board tokens; visual confirmation still required. |
| 10 | Dice faces display SVGs when not rolling. | Static covered + requires visual browser confirmation | All six Luxury Estate dice SVGs exist; rendered dice face display must be verified in browser. |
| 11 | Dice hide/animate correctly while rolling. | Requires visual browser confirmation | Animation/timing requires browser observation. |
| 12 | Property group icons display on grouped properties. | Static covered + requires visual browser confirmation | Luxury group SVGs exist for all property groups plus railroad and utility; board rendering uses group icons for color properties. |
| 13 | Houses and hotels display SVG assets after building. | Static covered + requires visual browser confirmation | Luxury `villa.svg` and `manor.svg` exist and building rendering uses them; gameplay build flow must be visually confirmed. |
| 14 | Missing assets do not show broken image icons. | Static covered + requires visual browser confirmation | Image tags use an `onerror` fallback that removes failed images; visual browser confirmation should verify no broken-image icons appear. |
| 15 | Title deed modals still show correct rent, mortgage, ownership, and metadata. | Static covered + requires visual browser confirmation | Title deed rendering includes rent tables, mortgage values, ownership text, and theme metadata; values should be checked in browser modals. |
| 16 | Buying, declining, auctioning, rent, cards, jail, trades, and property management still work. | Requires visual browser confirmation | Full gameplay regression requires interactive browser testing. |
| 17 | Mobile viewport remains usable at approximately 390px width. | Requires visual browser confirmation | Requires browser viewport/device emulation. |
| 18 | Console has no errors. | Requires visual browser confirmation | Requires browser developer console or automation console capture. |

## Luxury Estate asset inventory covered statically

Confirmed expected Luxury Estate SVG files are present for:

- Board/tabletop textures.
- Deed, Fortune, and Treasury card backs/frames.
- Dice faces 1–6.
- Property group icons for brown, lightblue, pink, orange, red, yellow, green, darkblue, railroad, and utility.
- Player tokens: crown, compass, key, fox, airship, and lighthouse.
- Buildings: villa and manor.

## Manual browser procedure to complete remaining visual QA

1. Serve the repository locally, for example: `python3 -m http.server 4173`.
2. Open `http://127.0.0.1:4173/meridian.html` in a real browser.
3. Open DevTools Console and keep it visible while testing.
4. On the home screen, enter a host name and create a room.
5. Open a second tab/window to the same URL, enter a different player name, switch to **Join game**, enter the room code, and join.
6. As host, open **Theme** or **AI Designer**, choose **Luxury Estate**, then select each designer style: **Architectural Depth**, **Cinematic Glow**, and **Gallery Minimal**.
7. In the non-host tab, verify the selected Luxury Estate theme and current designer style are reflected in the read-only setup panel.
8. Start the game from the host tab.
9. Verify Luxury Estate board/tabletop textures, tokens, dice SVGs, property group icons, houses/hotels after building, and title deed modal values.
10. Exercise buying, declining, auction, rent, card, jail, trade, and property-management flows.
11. Resize the browser to approximately 390px width and verify the UI remains usable.
12. Confirm there are no console errors and no visible broken-image icons.
