# JoTrip V7 - public read-only visual preview

Owner authorized an unprotected visual-only preview on 26/09/2026. This does NOT authorize live inquiry collection, staff Quote access, final commercial photography, main branch merge, custom domains or changes to jotrip.vn.

Worker: `jotrip-quote-preview`. Existing D1: `jotrip-quote-preview-db` bound as `DB`. Wrangler preview vars: `PREVIEW_LOCK=false`, `PRIVACY_NOTICE_APPROVED=false`, `ALLOW_PREVIEW_SUBMISSIONS=false`, `ENABLE_STAFF_PREVIEW=false`. The public preview is intended only for visual QA with dummy data.

`.github/workflows/deploy-preview.yml` runs tests and a dry-run, verifies the exact preview Worker and D1 UUID, applies create-only remote migrations **only** to preview D1, then deploys with `--env preview`. Requires two encrypted GitHub environment `jotrip-preview` or repository secrets: `CLOUDFLARE_API_TOKEN` (Cloudflare token scoped to edit Workers and D1) and `CLOUDFLARE_ACCOUNT_ID` (Cloudflare **account** ID, not D1 UUID). Never paste secrets in chat, repo files or logs.

If the credentials check fails, the workflow has not run migrations or deployed. Once credentials are set, rerun via the GitHub Actions UI or make a new commit matching the workflow's push paths. Do not use the default Wrangler environment.

Staging images remain pending individual provenance, Phú Quốc location, permission and release approval. Do not activate guest submissions or staff tools until privacy/legal/security and iPhone Safari QA are approved.
