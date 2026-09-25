import { pbkdf2Sync, randomBytes } from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 16) {
  console.error("Usage: node tools/make-admin-hash.mjs '<16+ character password>'");
  process.exit(1);
}
const salt = randomBytes(20);
const hash = pbkdf2Sync(password, salt, 310_000, 32, "sha256");
console.log("ADMIN_PASSWORD_SALT=" + salt.toString("base64"));
console.log("ADMIN_PASSWORD_HASH=" + hash.toString("base64"));
console.log("Use: npx wrangler secret put <NAME>. Do NOT commit this output.");
