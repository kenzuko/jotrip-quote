# JoTrip Bespoke V7 - approved for implementation (25/09/2026)

The owner approved the V7 visual direction, including the full-width photographic hero, responsive mobile layout, interactive Journey Studio, Be Vietnam Pro / Playfair Display typography, original JoTrip branding, image-led mood selection and complete footer.

An integration release candidate was prepared locally from the approved V7 HTML and the existing Quote V1 local reference. It provides `/bespoke` static assets and POST `/bespoke/api/submit`, preserving the separate `quote.jotrip.vn` staff app and client `/quote/p/:token` endpoints. **The actual release-candidate files are not yet synced into this public repository.** Do not merge this branch as though the implementation is complete.

Gates before public release:
- Sync and review the complete working front-end and Quote source (the GitHub branch currently holds only the foundation).
- Verify redistribution/commercial rights and correct locations for every photo. Do not commit review-only media to this public repository.
- Provision Cloudflare Worker, D1, secrets, rate limiting and staff Access/MFA; do not replace the existing jotrip.vn homepage or change DNS without route QA.
- Check footer telephone/contact/legal links, real iPhone Safari, API intake and quote data-exposure tests.
- Keep this PR draft until full CI and staging sign-off. No verified production or preview URL yet.
