import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const root=new URL('../public/bespoke/assets/',import.meta.url);
const js=readFileSync(new URL('../public/bespoke/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../public/bespoke/app.css',import.meta.url),'utf8');
test('all V8 mood, experience, hero and editorial assets are real WebP files',()=>{
for(const k of ['coast','hero','island','boat','relax','family','group','couple','sunset-table','food','local-catch','local','rachvem','rach-vem','fishing','big-fishing','safari','vinwonders','show','sunset','journal-reef','journal-night','journal-local','journal-private','journal-boat','snorkeling','local-story-poster','local-story-motion']){
assert.ok(existsSync(new URL(k+'.webp',root)),k);
}
});
test('Internet folder photo provenance is visibly labelled',()=>{
assert.match(js,/const INTERNET_MEDIA=new Set/);
assert.match(js,/Nguồn: Internet/);
assert.match(js,/className='v8-source'/);
assert.match(js,/mediaCredit\(slot\)/);
assert.match(js,/id="credits"/);
});
test('local story, quote flow and accessibility use the supplied footage',()=>{
assert.match(js,/class="screen home-screen local-landing"/);
assert.match(js,/class="home-image local-film"/);
assert.match(js,/Đi cùng người bản địa/);
assert.match(js,/class="v8-footer-banner"/);
assert.match(js,/data-to="review">Tiếp tục tới yêu cầu báo giá/);
assert.ok(existsSync(new URL('local-story-motion.webp',root)));
assert.match(js,/data-act="moodone"/);
assert.match(css,/\/\* JoTrip Bespoke V8/);
assert.match(css,/@media\(max-width:820px\)/);
});