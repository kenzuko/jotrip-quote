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
