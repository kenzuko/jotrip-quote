# V7 safe-source synchronization and release gate

## Repo branch

`kenzuko/jotrip-quote`, `feat/quote-single-domain-mvp`, PR #1 stays Draft. The root of this folder is the repository root.

1. Upload **the contents of this directory** to that branch, retaining relative paths. Do not commit a ZIP as the entire implementation.
2. Wait for GitHub CI, which runs `npm test` and a Wrangler preview dry run; investigate failures before proceeding.
3. Configure Cloudflare Access for `jotrip-quote-preview.kenzuko.workers.dev` so only invited reviewers can see the site. Leave `PREVIEW_LOCK=true` and `PRIVACY_NOTICE_APPROVED=false` until security/notice review.
4. Run preview migrations only after inspecting changes: `npx wrangler d1 migrations apply jotrip-quote-preview-db --remote --env preview`.
5. Deploy using `npx wrangler deploy --env preview` only after the above are satisfied; verify with fake test records and strict public/internal data separation. No custom domain or DNS change.
6. Replace placeholder WebP pictures with individually approved real Phú Quốc photography in a separate controlled asset delivery; never commit licensed photos to a public repository unless redistribution rights also cover public source distribution.
7. Do not merge PR #1 or publish live `jotrip.vn` routes before real iPhone Safari and staff Access/MFA QA.

## Correct preview environment

- Worker: `jotrip-quote-preview`
- D1 binding: `DB`
- D1 database: `jotrip-quote-preview-db`
- UUID: `5242a0ac-9d8a-4013-8cad-806c1e37ef90`
- This account's Cloudflare dashboard may label the *preview-named Worker* deployment `Production`; that is NOT `jotrip.vn` production.

No password, API token or customer/supplier data belongs in this public repository.
