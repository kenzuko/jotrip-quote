# JoTrip Bespoke + Quote - implementation status (25 September 2026)

Product routes: `jotrip.vn` (existing homepage) -> `jotrip.vn/bespoke` (adaptive inquiry) -> `jotrip.vn/quote/p/:token` (approved proposal); `quote.jotrip.vn` remains staff-only.

This development branch has the validated draft normalization, strict public projection and additional D1 schema. The complete working local implementation (Worker, responsive Bespoke, Studio, client proposal, editable Word export, original JoTrip logo, and staging-only real images) is packaged for the owner as `JOTRIP_BESPOKE_QUOTE_V1_SOURCE_AND_PREVIEW.zip`. It has passed 11 Node unit and integration tests and responsive desktop/mobile screenshot QA in the development environment.

**IMPORTANT:** The full working local implementation has not yet been synchronized into this GitHub branch; no GitHub CI claim or live deployment claim is made. Cloudflare D1 IDs/secrets are placeholders. No production DNS/routes or customer/supplier data have been changed. This public repo must never receive private rates, supplier agreements, personally identifiable guest records or unlicensed images.

Before production: synchronize all tested source files, check original photo usage rights, provision isolated D1 and secrets, enforce MFA and RBAC for staff, validate Cloudflare routing under the existing JoTrip app, run full end-to-end QA, then deploy to a preview domain and have the owner approve before changing production routing.
