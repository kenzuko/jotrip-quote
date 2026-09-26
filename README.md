# JoTrip Bespoke + Quote - V7 preview code

**Status: source ready for repository sync and CI; NOT deployed or approved for real customers.** UX V7 approved 25 Sep 2026. Read `docs/SYNC_AND_DEPLOY_GATE.md` and `docs/PRIVACY_REVIEW_CHECKLIST.md` before any release.

Routes: `/bespoke` visual workflow; `/bespoke/api/submit` consented guest request (currently disabled until privacy approval); `/quote/p/:token` immutable approved client proposal with feedback and editable Word; `quote.jotrip.vn` is the intended separate staff origin. Production route integration must not replace the existing `jotrip.vn` homepage or existing services.

The preview Worker and D1 have been created and bound by the owner. The bundled images are **clearly labeled review placeholders** and must be replaced with location-verified, rights-cleared images before visual release. The original JoTrip logo is preserved.

## Local QA

`npm install && npm test`

## Preview environment

Cloudflare Worker `jotrip-quote-preview`, binding `DB`, database `jotrip-quote-preview-db`. Preview is **locked by default**, intake disabled, staff Studio preview disabled. See docs for opening gates after Access + legal and security approval. Full frontend CSS/JS and test/source files belong together in this repo; do not deploy the foundation-only branch.
