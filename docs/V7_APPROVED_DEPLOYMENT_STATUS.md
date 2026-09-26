# JoTrip Bespoke V7 - implementation checkpoint, 26/09/2026

**Owner decision:** V7 visual approved for implementation, including shared panoramic hero, responsive mobile, original JoTrip logo, Be Vietnam Pro + Playfair Display, image-led mood selection, evolving Journey Studio and completed footer. Keep the approved Bespoke/Quote architecture and public/private data boundary.

## Verified GitHub source and CI
- Complete **sanitized preview source** synchronized to this public repo branch, commit `b3f25eca7d80628dae464996a9366f90b9429de4`: 59 verified blobs including Worker, V7 CSS/JS, neutral staging graphics, tests, schema and docs. All uploaded blobs were SHA-checked.
- GitHub Actions **push and PR checks passed** at that commit: `https://github.com/kenzuko/jotrip-quote/actions/runs/36215777256` and `https://github.com/kenzuko/jotrip-quote/actions/runs/36215779943`. Includes Node test suite and Wrangler preview dry-run.
- Local `npm test`: 19 tests passed; static JS syntax and desktop/390px simulated browser interaction checks passed. Real iPhone Safari remains pending. Do not infer that the preview is currently deployed.

## Preview Cloudflare resources provisioned by owner
- Worker: `jotrip-quote-preview`, URL `https://jotrip-quote-preview.kenzuko.workers.dev`; **starter Worker currently deployed, V7 not yet deployed**.
- D1: `jotrip-quote-preview-db` (UUID `5242a0ac-9d8a-4013-8cad-806c1e37ef90`) bound as `DB` to the preview Worker.
- `wrangler.jsonc` has `env.preview.name=jotrip-quote-preview` and the verified D1 binding; the root production D1 remains a placeholder; never deploy the default environment.
- Preview gates default CLOSED: `PREVIEW_LOCK=true`, `PRIVACY_NOTICE_APPROVED=false`, `ALLOW_PREVIEW_SUBMISSIONS=false`, `ENABLE_STAFF_PREVIEW=false`. No live intake or staff Studio should be activated during initial deploy.

## Current blockers before preview deployment
1. Owner to protect the **preview-named Worker** using Cloudflare Access (choose **All traffic** because this Worker's workers.dev main deployment is labeled Production in the dashboard; only owner/tester emails allowed). Do not protect only ephemeral Preview URLs.
2. Existing Worker can then be connected to the GitHub repo in Cloudflare Settings > Builds; select `feat/quote-single-domain-mvp` as the build branch and set deploy command `npx wrangler deploy --env preview` (never default `wrangler deploy`). Cloudflare Workers Builds supports matching Wrangler environment names with the existing Worker.
3. Apply inspected, create-only migrations to **preview D1 only** after Access and build connection. No production D1 or live jotrip.vn routes.
4. The public repository includes **neutral placeholder visuals only**. Select and verify each JoTrip-owned photo from Drive (exact Phú Quốc location, photographer/license/consents); publish photos only when approved. Do not represent staging images as real location photographs.
5. Approve multilingual privacy notice and terms before enabling guest submissions, verify public footer and contact links and perform real iPhone Safari QA. Confirm stronger staff roles/MFA and security QA before enabling quote.jotrip.vn.

## Confirmed public contacts (from owner)
- Hotline / Zalo `+84 81 706 0066`; Zalo deep link pending validation.
- `phuquoclux@gmail.com`; website `https://www.jotrip.vn` (NOT a physical street address).
- Hide LINE button until confirmed. Do not invent address or legal-link placeholders.

**PR #1 must remain Draft. Do not merge main or change production DNS.**
