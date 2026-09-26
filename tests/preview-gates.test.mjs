import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.mjs';
const host='https://jotrip-quote-preview.kenzuko.workers.dev';
test('preview access stays locked unless owner explicitly opens it', async()=>{
 const r=await worker.fetch(new Request(host+'/bespoke'),{PREVIEW_MODE:'true'});
 assert.equal(r.status,503);
 assert.match(await r.text(),/chưa nhận thông tin khách/);
});
test('unrelated workers.dev host is not treated as JoTrip preview', async()=>{
 const r=await worker.fetch(new Request('https://different.kenzuko.workers.dev/bespoke'),{PREVIEW_MODE:'true'});
 assert.equal(r.status,404);
});
test('privacy approval required before receiving a lead', async()=>{
 const r=await worker.fetch(new Request(host+'/bespoke/api/submit',{method:'POST',headers:{origin:host},body:'{}'}),{PREVIEW_MODE:'true',PREVIEW_LOCK:'false',DB:{}});
 assert.equal(r.status,503);
 assert.match(await r.text(),/chưa mở/);
});
test('staff preview stays off even when visual preview opens', async()=>{
 const r=await worker.fetch(new Request(host+'/api/staff/quotes'),{PREVIEW_MODE:'true',PREVIEW_LOCK:'false',DB:{}});
 assert.equal(r.status,403);
});

test('unmigrated D1 is not needed for read-only Bespoke visual preview', async()=>{
 const requested=[];
 const ASSETS={fetch:async req=>{requested.push(new URL(req.url).pathname);return new Response('<h1>JoTrip Bespoke V7 visual preview</h1>',{status:200,headers:{'content-type':'text/html'}})}};
 const r=await worker.fetch(new Request(host+'/bespoke'),{PREVIEW_MODE:'true',PREVIEW_LOCK:'false',PRIVACY_NOTICE_APPROVED:'false',ALLOW_PREVIEW_SUBMISSIONS:'false',ENABLE_STAFF_PREVIEW:'false',ASSETS,DB:{}});
 assert.equal(r.status,200);
 assert.deepEqual(requested,['/bespoke/index.html']);
 assert.match(await r.text(),/JoTrip Bespoke V7/);
});
