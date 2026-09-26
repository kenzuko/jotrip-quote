# V7 deployment gate - 25/09/2026

UX V7 is approved. This package maps the HTML to `jotrip.vn/bespoke`, maintains `jotrip.vn/quote/p/:token` and `quote.jotrip.vn` without replacing the existing homepage, and POSTs actual consented customer requests to `/bespoke/api/submit`.

## Before production release
- Obtain actual Cloudflare account access and configure Worker routes for `/bespoke*` and `/quote/p/*`, plus staff host. Keep existing jotrip.vn homepage routing intact.
- Create production D1, apply migrations, set admin credentials, add real rate-limit salt and Cloudflare Access/MFA on staff host.
- Audit full local Quote reference against GitHub branch before syncing. Preserve public-approved quote snapshots with NO costs, margins or supplier data.
- Verify all public photos and location captions plus JoTrip logo use, remove/replace unverified material. Photo assets in this artifact are **review-only**.
- Confirm footer phone/social links and privacy policy URL. Do not publish placeholders.
- Review responsive UI in real iPhone Safari, accessibility and complete submission/quote flow on preview D1 with test data.
- Disable noindex only after release QA. Do not commit unlicensed media to public GitHub.

## Deployment status
Release candidate **not deployed**, cannot safely be deployed without Cloudflare configuration and media/identity checks.
