# JoTrip Quote

**Single domain:** `quote.jotrip.vn`  
**Product:** JoTrip Proposals (client) / JoTrip Studio (staff).

This feature branch establishes a secure-first, Vietnamese MVP:
- Public editorial homepage `/`, staff sign-in `/login`, private studio `/studio`.
- Draft quote editor; separate internal costs and explicitly approved public prices.
- Immutable published versions, revocable 256-bit share links `/p/:token`, section-specific guest feedback.
- Genuine editable .docx download from the published client view, not a screenshot.
- No second domain, no default admin password, no public cost API.

## Security / deployment gates

**The repo is currently public. Never commit real clients, supplier tariffs, net costs, API keys, contract files, private contact data, or non-licensed imagery.** Consider changing repo visibility to private before integrating supplier data. Public source code is fine if business data and secrets remain in private D1/R2 bindings.

The public share payload is a strict allowlist built from quote fields. It never contains `internal`, supplier costs, markup, margin, or private notes. Publishing requires confirmation of price, media rights, and terms. Edits create a new draft without changing previously published versions.

### Setup

1. `npm install`; `npm test`
2. `npx wrangler d1 create jotrip-quote-db`. Copy the returned UUID into `wrangler.jsonc` (replace `REPLACE_WITH_D1_UUID`).
3. `npx wrangler d1 migrations apply jotrip-quote-db --local` for local dev, and after review `--remote` for production.
4. Generate a random 16+ byte salt and PBKDF2 hash: `node tools/make-admin-hash.mjs "a-new-strong-password"`. It prints values; never save the password or the output in Git.
5. Configure Worker secrets with `npx wrangler secret put ADMIN_EMAIL`, `ADMIN_PASSWORD_SALT`, `ADMIN_PASSWORD_HASH`.
6. `npm run dev` and verify login -> draft -> save -> approval -> publish -> guest feedback -> revoke -> DOCX.
7. After QA, configure Cloudflare Worker **Custom Domain** `quote.jotrip.vn` only. Do not attach `baogia.jotrip.vn`.

No deployment or DNS changes have been performed by this branch. `wrangler.jsonc` intentionally omits production routes and has a D1 UUID placeholder until the database exists.

## Routes

| Route | Access |
|---|---|
| `/` | Public home (no sensitive data) |
| `/login` | JoTrip staff sign-in |
| `/studio` | Authenticated draft workspace |
| `/p/:token` | Approved client snapshot only |
| `/p/:token/word` | Client Word export for that snapshot |
| `POST /api/p/:token/feedback` | Client per-section feedback; throttled |
| `/api/quotes/*` | Cookie + CSRF, staff only |

**Limits of first build:** staff is one configured admin identity; image uploads, rich visual drag-and-drop, team roles, PDF, native approval signatures, and automatic live supplier rates require subsequent modules. DOCX v1 contains editable text and price tables; client web layout supports approved licensed images once connected to a vetted media store. Never claim an unconfirmed hotel/flight rate is live. No external AI or third-party pricing calls.

## UI and content rules

Use the original JoTrip brand assets without redrawing. Only use actual photographs with verified location and permitted commercial usage; do not turn an AI poster into an uneditable customer document. Mobile customer view is the primary sales surface.

## Local tests

`npm test` exercises the cost calculator, strict public projection, Word XML escaping and ZIP format, token hashing, and security-relevant input validation.
