# JoTrip Bespoke V8 - LIVE visual preview status

**Last verified:** 26/09/2026, GitHub Actions run [36223797968](https://github.com/kenzuko/jotrip-quote/actions/runs/36223797968). All jobs passed, including remote preview D1 migrations, Worker asset deployment and **live HTTP smoke checks**.

- Visual preview: https://jotrip-quote-preview.kenzuko.workers.dev/bespoke
- Worker: `jotrip-quote-preview`, binding `DB` to existing `jotrip-quote-preview-db`. No changes to `jotrip.vn`, production DNS, default Wrangler environment or `main` branch. PR #1 remains **Draft**.
- GitHub Actions preview release at source `32b5a413b6e7defd335fd2d8b0fc76886d9e9dd1`: **23 tests passed, 0 failed**; preview dry run, remote migrations and actual deployment succeeded.
- Smoke checks after deployment verified live `/bespoke` HTML; JS; CSS; `/bespoke/assets/coast.webp` and `journal-private.webp` full-size assets; `POST /bespoke/api/submit` returned **503** (intake closed); `GET /api/staff/quotes` returned **403** (Studio closed).

## V8 visual change register

26 optimized photo slots (about 6.7 MB WebP combined) were sourced from the two Google Drive folders explicitly supplied by the owner. Hero, five mood cards, journey previews, experience cards, four editorial photo surfaces, and photo-backed closing CTA/footer now use actual supplied photos. The three subsequent guided screens (details, experience builder, review) have image headers. The desktop and 390px-mobile local Chromium flows were simulated without page script errors.

For every hero/mood/experience visual whose source is the owner's `JOTRIP_INTERNET_IMAGES`, the page displays **Nguồn: Internet**. A source register with exact original Drive IDs and slot names is [PHOTO_SOURCE_V8.md](PHOTO_SOURCE_V8.md). Attribution is source disclosure, **not** verification of copyright or photo-subject consent. Check these before selling the website commercially.

## Remaining release gates

- Preview is **read-only**: `PREVIEW_LOCK=false`, `PRIVACY_NOTICE_APPROVED=false`, `ALLOW_PREVIEW_SUBMISSIONS=false`, `ENABLE_STAFF_PREVIEW=false`. No live customer PII or staff Studio.
- Do not interpret Chrome responsive emulation as a test on actual iPhone Safari; owner hardware review remains outstanding.
- Commercial image rights and releases where recognizable guests appear, localization, privacy notice, terms, MFA / staff access controls and production D1 / routing remain separate launch decisions.
- Keep current `jotrip.vn` homepage unchanged until separately approved. No silent merge or DNS changes.
