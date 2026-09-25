# JoTrip Bespoke V7 - approved for implementation (25/09/2026)

The owner approved the V7 visual direction, including the full-width photographic hero, responsive mobile layout, interactive Journey Studio, Be Vietnam Pro / Playfair Display typography, original JoTrip branding, image-led mood selection and complete footer.

An integration release candidate was prepared locally from the approved V7 HTML and the existing Quote V1 local reference. It provides `/bespoke` static assets and POST `/bespoke/api/submit`, preserving the separate `quote.jotrip.vn` staff app and client `/quote/p/:token` endpoints. **The actual release-candidate files are not yet synced into this public repository.** Do not merge this branch as though the implementation is complete.

## Public contact and media confirmation (25/09/2026)

The owner provided the following proposed public-facing contact details for the V7 footer and intake acknowledgment. These are project content inputs, not evidence of deployment:
- Hotline: `+84 81 706 0066` (link: `tel:+84817060066`).
- Zalo: `+84 81 706 0066` (verify public link before using a deep link).
- Email: `phuquoclux@gmail.com` (link: `mailto:phuquoclux@gmail.com`).
- Brand website: `https://www.jotrip.vn`. The owner entered a website URL under an address field; **do not display this as a physical office address**.
- LINE: not confirmed. **Hide the LINE button** rather than adding a placeholder.
- Terms of use and privacy notice: not yet provided. **Do not publish placeholder legal links or enable collection of real customer inquiries** until an appropriate notice is reviewed/approved and the live form is connected safely.

The owner confirmed JoTrip has its own photography on Google Drive. Drive discovery found `JOTRIP_PHUQUOC_IMAGES`, nested `JOTRIP_LICENSED_IMAGES`, and separate image folders, but **folder naming and availability alone do not establish commercial/redistribution permission or authenticate photo location**. Before publishing each selected photo, check individual provenance, permission scope, and actual location. The logo must remain unchanged and should be sourced from the original JoTrip brand assets. Do not commit licensed images without explicit repository redistribution rights.

## Gates before public release

- Sync and review the complete working front-end and Quote source (the GitHub branch currently holds only the foundation).
- Verify redistribution/commercial rights and correct locations for every photo. Do not commit review-only media to this public repository.
- Provision Cloudflare Worker, D1, secrets, rate limiting and staff Access/MFA; do not replace the existing jotrip.vn homepage or change DNS without route QA.
- Verify public footer contacts and links; do not mistake the website for a street address. Draft and approve privacy notice and terms before accepting customer information.
- Check real iPhone Safari, API intake and quote data-exposure tests.
- Keep this PR draft until full CI and staging sign-off. No verified production or preview URL yet.

## Preview D1 provisioned by owner (25/09/2026)

- Cloudflare D1 database **created and confirmed from Dashboard screenshot**: `jotrip-quote-preview-db`.
- Preview D1 UUID: `5242a0ac-9d8a-4013-8cad-806c1e37ef90`.
- Worker `jotrip-quote-preview` has been created as a Cloudflare starter Worker; actual V7 source is not deployed.
- Do not create a duplicate D1. `wrangler.jsonc` on this branch now includes the approved `env.preview` Worker name and D1 binding, while production D1 remains a placeholder. Applying preview migrations and deploying remain pending. **Do not click Deploy on the current GitHub branch**: the implementation files and approved media are not yet synced there.

## Cloudflare preview Worker confirmed by owner (25/09/2026)

- Dashboard screenshot shows `jotrip-quote-preview` created and Cloudflare displaying `jotrip-quote-preview.kenzuko.workers.dev` as its workers.dev URL.
- Only the starter Worker is confirmed; **V7 application source is not deployed** and the URL has not been independently validated as serving V7.
- **Binding confirmed by screenshot:** on the existing Worker, Production > Settings > Bindings shows D1 binding `DB` pointing to `jotrip-quote-preview-db`, UUID `5242a0ac-9d8a-4013-8cad-806c1e37ef90`. The Cloudflare `Production` label is the deployment environment of the **preview-named Worker**, not evidence that jotrip.vn has been updated. Do **not** create a second D1 or attach a production custom domain. Later, a reviewed `wrangler deploy --env preview` will manage bindings via config.
