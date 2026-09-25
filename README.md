# JoTrip Bespoke + Quote

**Stage:** Foundation only. Not ready for production; no frontend or backend implementation yet, no production D1 instance, no deployed website and no DNS changes. The plan is approved, but the service has not passed security or functional QA.

## Approved access paths

- `jotrip.vn`: public editorial homepage / entry to JoTrip experience.
- `jotrip.vn/bespoke`: adaptive inquiry and trip-planning form.
- `jotrip.vn/quote/p/:token`: client-facing approved proposal, per-section feedback, editable Word export.
- `quote.jotrip.vn`: staff-only authenticated Quote Studio with supplier costs, margins, versions and approvals.
- `cms.openphuquoc.com`: contextual destination information links.

The two JoTrip origins require independent cookie and origin controls; no staff cost API is ever called by the public app. Route integration for `jotrip.vn` must be planned with the existing homepage/App, without replacing existing services or prematurely changing DNS.

## Product flow

Public inspiration -> bespoke (quick, deep, or conversational, all with a single data schema) -> reviewed request -> staff creates quote or starts manually -> internal cost review -> publish immutable public snapshot -> customer comments on sections -> revised draft -> new published version -> optional Word export -> acceptance does not imply booking/availability.

For design, use original JoTrip colors (`#77944C`, `#FCBC12`), dark forest `#173F32`, ivory `#F8F5ED`. Use only accurate, licensed real Phú Quốc photography. Preserve the original JoTrip logo/mascot. Support Vietnamese first with `en` and Traditional Chinese `zh-Hant` expansion.

## Code & data boundaries

This repository is currently **public**. Never commit actual customer information, supplier tariffs, internal margins, secrets, or licensed images without redistribution permission. Store operational information in private Cloudflare D1 and private R2 where appropriate. Client HTML, API responses, and Word documents must be generated only from explicit **approved public fields**.

## Committed foundation

- `wrangler.jsonc` template. Its D1 ID is deliberately a placeholder, not a working deployment.
- `migrations/0001_init.sql` initial Quote drafts, versions, share links, guest comments and staff sessions.
- `tools/make-admin-hash.mjs` local tool to generate an admin credential hash; no secrets included.
- `package.json`, `.gitignore`.

**Next implementation milestone:** working screens and endpoints (Bespoke intake, authenticated Quote Studio, publish/revoke, customer feedback, editable Word export), automated leakage/security checks and responsive QA. Do not claim these are implemented merely because their tables and routes appear in this document.

## Deployment gate

Do not deploy until real database/bindings and secrets exist, role and access tests pass, media rights are verified, and the user approves the preview. No external services have been modified by this commit besides this repository branch.
