# JoTrip Quote - release gate

## Completed in local QA (not production)

- Original brand logo and responsive JoTrip palette; standalone preview entry plus adaptive public wizard.
- Staged photos referenced by local preview; they are NOT certified for publication.
- Schema for public Bespoke leads, private quote drafts, private cost lines, immutable approved snapshots, hashed revocable share tokens and version-specific feedback.
- Strict allowlist projection from private draft to public content, separate host API gates, SameSite + HttpOnly staff sessions, CSRF token, origin checks, rate-limit foundation.
- Local SQLite-backed integration covers lead -> login -> manual/request-based quote -> approved link -> customer comment -> editable Word -> token revoke -> logout.
- Word export is basic but genuinely editable. Final luxury typography, licensed photos and template choice can be upgraded after owner approves web experience.

## Blocking before any production or real data

1. **Cloudflare control:** no connected Cloudflare tool is available in this session. D1 UUID placeholders, secrets, Access/MFA, custom host routes and DNS remain unconfigured.
2. **Existing site:** inspect actual `jotrip.vn` routing so `/bespoke` and `/quote/p/*` can be served by the new Worker while `/` and all existing JoTrip App routes remain intact. Current live site was not accessible for external verification; do not overwrite it.
3. **Admin security:** replace single admin identity with MFA-backed authentication and explicit staff roles: intake, editor, pricing, publisher, administrator. Enforce all roles server-side and audit modifications. Add Cloudflare Turnstile and robust multi-region/distributed abuse limits before inviting public traffic.
4. **Image integrity:** verify license, source, exact Phú Quốc location and promotional usage of bundled real photos; upload only approved assets to public CDN, use private R2 for unpublished media.
5. **Data governance:** define personal data retention, deletion/export, consent copy for Vietnam/Taiwan, production monitoring/backups, and incident-response contacts. These need relevant legal/professional review before production.
6. **Rate validity:** hotel rates for a future travel date must be applicable to guest origin/market, rooming, taxes, stay dates, inventory and offer validity. Never default an unverified quote to confirmed.
7. **Accessibility and performance:** keyboard/screen-reader, color contrast, iPhone 375px/390px and slow network, image lazyload/WebP, 95th-percentile backend latency.
8. **Production QA:** test route separation at actual hosts; attack and leakage testing including Word; session expiry/CSRF/revocation/cache/CDN; concurrent publish/version race; idempotent lead creation under concurrency; host and origin spoofing; real end-to-end operational handoff.

## Integration ownership

- Public frontend can be integrated into the existing JoTrip App or served under `/bespoke` as a Cloudflare path route without changing the homepage implementation.
- Staff `quote.jotrip.vn` is a distinct origin even though the source repo may share the Worker package. Never share staff cookie scope with `jotrip.vn`.
- Sensitive commercial data must NEVER be committed to the public `kenzuko/jotrip-quote` repository or injected into public HTML/JS/Word.
- Guest approval is not a payment, room allocation, booking or service confirmation.
