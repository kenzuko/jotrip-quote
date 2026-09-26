import {pbkdf2Sync,randomBytes} from 'node:crypto';
const pass=process.argv[2];
if (!pass||pass.length<16) { console.error('Usage: npm run hash:admin -- "A-strong-password-16+"');process.exit(1); }
const salt=randomBytes(20);console.log('ADMIN_PASSWORD_SALT='+salt.toString('base64'));
console.log('ADMIN_PASSWORD_HASH='+pbkdf2Sync(pass,salt,310000,32,'sha256').toString('base64'));
console.log('Run wrangler secret put for both; never commit output.');
