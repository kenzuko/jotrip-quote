import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const cfg=JSON.parse(readFileSync(new URL('../wrangler.jsonc',import.meta.url),'utf8'));
const root=new URL('../public/bespoke/assets/',import.meta.url);
test('production database is deliberately not bound',()=>{
 assert.equal(cfg.d1_databases[0].database_id,'REPLACE_WITH_D1_UUID');
 assert.equal(cfg.workers_dev,false);
});
test('preview stays locked, no staff access or public intake by default',()=>{
 const e=cfg.env.preview;
 for(const key of ['PREVIEW_LOCK','PRIVACY_NOTICE_APPROVED','ENABLE_STAFF_PREVIEW','ALLOW_PREVIEW_SUBMISSIONS'])assert.ok(key in e.vars);
 assert.equal(e.vars.PREVIEW_LOCK,'true');
 for(const key of ['PRIVACY_NOTICE_APPROVED','ENABLE_STAFF_PREVIEW','ALLOW_PREVIEW_SUBMISSIONS'])assert.equal(e.vars[key],'false');
 assert.ok(cfg.assets.run_worker_first.includes('/bespoke/api/*'));
});
test('approved JoTrip footer contact is present, LINE button hidden',()=>{
 const js=readFileSync(new URL('../public/bespoke/app.js',import.meta.url),'utf8');
 assert.match(js,/tel:\+84817060066/);
 assert.match(js,/phuquoclux@gmail.com/);
 assert.doesNotMatch(js,/class="footer-line"/);
 assert.doesNotMatch(js,/\['line','LINE'\]/);
 assert.equal(js.split("Tôi đồng ý để JoTrip sử dụng thông tin liên hệ nhằm tư vấn chuyến đi của tôi").length,2);
});
test('each staging media slot has its own neutral placeholder',()=>{
 for(const id of ['coast','hero','island','relax','food','family','rachvem','safari','fishing','sunset'])assert.ok(existsSync(new URL(id+'.webp',root)),id);
});
