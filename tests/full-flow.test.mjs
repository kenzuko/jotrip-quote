import test from 'node:test';import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {pbkdf2Sync,randomBytes} from 'node:crypto';
import worker from '../src/worker.mjs';
class D1{
 constructor(){this.sqlite=new DatabaseSync(':memory:');for(const m of ['0001_init.sql','0002_bespoke.sql'])this.sqlite.exec(readFileSync(new URL('../migrations/'+m,import.meta.url),'utf8'))}
 prepare(sql){return new Statement(this.sqlite,sql)}
 async batch(stmts){this.sqlite.exec('BEGIN');try{const res=stmts.map(s=>s.execute('run'));this.sqlite.exec('COMMIT');return res}catch(e){this.sqlite.exec('ROLLBACK');throw e}}
}
class Statement{
 constructor(db,sql){this.db=db;this.sql=sql;this.args=[]}
 bind(...v){this.args=v;return this}
 execute(kind){const s=this.db.prepare(this.sql);return kind==='run'?{success:true,meta:s.run(...this.args)}:kind==='all'?{results:s.all(...this.args)}:s.get(...this.args)}
 async first(){return this.execute('first')||null}
 async all(){return this.execute('all')}
 async run(){return this.execute('run')}
}
const password='example-password-21-strong',salt=randomBytes(20);
const env={DB:new D1(),PREVIEW_MODE:'true',PREVIEW_LOCK:'false',ENABLE_STAFF_PREVIEW:'true',ALLOW_PREVIEW_SUBMISSIONS:'true',PRIVACY_NOTICE_APPROVED:'true',PUBLIC_HOST:'jotrip.vn',STAFF_HOST:'quote.jotrip.vn',ADMIN_EMAIL:'admin@jotrip.test',ADMIN_PASSWORD_SALT:salt.toString('base64'),ADMIN_PASSWORD_HASH:pbkdf2Sync(password,salt,310000,32,'sha256').toString('base64'),RATE_LIMIT_SALT:'testing-only-not-real'};
const root='http://localhost:8787';
function request(path,method='GET',body=null,headers={}){return new Request(root+path,{method,headers:{...(body?{'content-type':'application/json',origin:root}:{}),...headers},body:body?JSON.stringify(body):undefined})}
async function req(path,method='GET',body=null,headers={}){const res=await worker.fetch(request(path,method,body,headers),env);const ct=res.headers.get('content-type')||'';const data=ct.includes('json')?await res.json():ct.includes('text')?await res.text():await res.arrayBuffer();return {res,data}}
const draft={title:'Phú Quốc 5 ngày 4 đêm',clientSalutation:'Đoàn Đài Loan',introduction:'JoTrip thiết kế riêng',days:[{title:'Đón sân bay',details:'Đón khách, nhận phòng, nghỉ ngơi.',photo:''}],options:[{label:'Seashells',hotel:'Seashells Phú Quốc',partySize:20,sellPerGuest:15000000,priceState:'indicative'}],inclusions:['Xe riêng','HDV'],exclusions:['Vé bay'],terms:'Giá tạm tính',internal:{lines:[{name:'TOP SECRET NET COST',qty:20,unitCost:8100000,basis:'fixed'}],notes:'TOP SECRET MARGIN 99%'}};
test('Integrated business path: bespoke -> staff login -> draft -> published client snapshot -> feedback -> Word -> revoke',async()=>{
 const key='request-'+crypto.randomUUID();
 const input={name:'Khách thử nghiệm',contact:'taiwan@example.test',consent:true,requestKey:key,party:'family',feelings:['Biển đảo'],experiences:['Cano riêng'],adults:20,children:0,date:'01/2027'};
 let a=await req('/bespoke/api/submit','POST',input);assert.equal(a.res.status,201);const code=a.data.code;assert.match(code,/^BQ-/);
 a=await req('/bespoke/api/submit','POST',input);assert.equal(a.data.code,code);assert.equal(a.data.duplicate,true);
 a=await req('/api/staff/quotes');assert.equal(a.res.status,401);
 a=await req('/api/staff/login','POST',{email:'admin@jotrip.test',password:'wrong'});assert.equal(a.res.status,401);
 a=await req('/api/staff/login','POST',{email:'admin@jotrip.test',password});assert.equal(a.res.status,200);const cookie=a.res.headers.get('set-cookie').split(';')[0];assert.ok(cookie.startsWith('jq_staff_preview='));
 const {data:me}=await req('/api/staff/me','GET',null,{cookie});const headers={cookie,'x-csrf-token':me.csrf};
 const leads=await req('/api/staff/requests','GET',null,{cookie});assert.equal(leads.data.requests.length,1);const leadId=leads.data.requests[0].id;
 a=await req('/api/staff/quotes','POST',{draft,requestId:leadId},{cookie});assert.equal(a.res.status,403); // CSRF mandatory
 a=await req('/api/staff/quotes','POST',{draft,requestId:leadId},headers);assert.equal(a.res.status,201);const id=a.data.id;
 a=await req('/api/staff/quotes/'+id,'GET',null,{cookie});assert.equal(a.data.quote.draft.internal.lines[0].name,'TOP SECRET NET COST');
 a=await req('/api/staff/quotes/'+id+'/publish','POST',{approvePrice:false,approveMedia:true},headers);assert.equal(a.res.status,400);
 a=await req('/api/staff/quotes/'+id+'/publish','POST',{approvePrice:true,approveMedia:true,daysValid:30},headers);assert.equal(a.res.status,201);const publishedLink=a.data.url,pathname=new URL(publishedLink).pathname;assert.match(pathname,/^\/quote\/p\/[a-f0-9]{64}$/);
 a=await req(pathname);assert.equal(a.res.status,200);assert.ok(!a.data.includes('TOP SECRET'));
 a=await req(pathname+'/feedback','POST',{section:'day-1',guestName:'Client',note:'Xin đổi lịch ngày đầu'});assert.equal(a.res.status,201);
 a=await req('/api/staff/quotes/'+id+'/feedback','GET',null,{cookie});assert.equal(a.data.feedback[0].note,'Xin đổi lịch ngày đầu');
 const word=await req(pathname+'/word');assert.equal(word.res.status,200);assert.equal(Buffer.from(word.data).subarray(0,2).toString(),'PK');assert.ok(!Buffer.from(word.data).includes(Buffer.from('TOP SECRET')));
 const db=env.DB.sqlite;const hash=db.prepare('SELECT token_hash FROM share_links WHERE quote_id=?').get(id).token_hash;
 a=await req('/api/staff/quotes/'+id+'/revoke','POST',{tokenHash:hash},headers);assert.equal(a.res.status,200);
 a=await req(pathname);assert.equal(a.res.status,404);
 a=await req('/api/staff/logout','POST',{},headers);assert.equal(a.res.status,200);
 a=await req('/api/staff/requests','GET',null,{cookie});assert.equal(a.res.status,401);
});
