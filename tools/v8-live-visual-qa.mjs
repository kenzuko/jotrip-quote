import {chromium} from 'playwright-core';
import {mkdir,writeFile} from 'node:fs/promises';
const BASE=process.env.JOTRIP_PREVIEW_URL||'https://jotrip-quote-preview.kenzuko.workers.dev';
const DIR='artifacts/v8-visual-qa';
const checks=[];
await mkdir(DIR,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});
async function inspect(page,name,opts={}){
 await page.waitForTimeout(150);
 await page.evaluate(()=>document.querySelectorAll('img[loading="lazy"]').forEach(img=>{img.loading='eager'}));
 await page.evaluate(async()=>{await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,3500))]);await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))});
 const result=await page.evaluate(()=>({screen:document.querySelector('.screen')?.className||'',viewport:innerWidth,documentWidth:document.documentElement.scrollWidth,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src')),internetLabels:document.querySelectorAll('.photo-credit,.v8-source').length,orphanedCredits:[...document.querySelectorAll('.stage-header>.v8-source')].filter(e=>{const photo=e.parentElement.querySelector('.stage-cover');return photo&&getComputedStyle(photo).display==='none'&&getComputedStyle(e).display!=='none'}).length,mainHeading:document.querySelector('h1')?.textContent||''}));
 await page.screenshot({path:`${DIR}/${name}.png`,fullPage:true,animations:'disabled',timeout:30000});
 if(result.documentWidth>result.viewport+2)throw Error(`${name}: horizontal overflow ${result.documentWidth}px vs viewport ${result.viewport}px`);
 if(result.orphanedCredits)throw Error(`${name}: photo attribution overlaps mobile text`);
 if(result.brokenImages.length)throw Error(`${name}: broken images: ${result.brokenImages.join(', ')}`);
 if(opts.internet&&result.internetLabels<opts.internet)throw Error(`${name}: Internet source badges missing`);
 checks.push({name,...result});
}
for(const viewport of [{name:'desktop',width:1440,height:900},{name:'iphone',width:390,height:844},{name:'compact',width:320,height:720}]){
 const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1,isMobile:viewport.name!=='desktop',hasTouch:viewport.name!=='desktop'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url=BASE+'/bespoke';
 const res=await page.goto(url,{waitUntil:'domcontentloaded',timeout:35000});
 if((!res||res.status()!==200))throw Error(`${viewport.name}: GET /bespoke status ${res?.status()}`);
 await page.locator('.homehero').waitFor();
 if((await page.locator('.rightnav a.talk[href="tel:+84817060066"]').count())!==1)throw Error('Preview header CTA must use real JoTrip phone link, not inactive consultation');
 const logoDiagnostic=await page.locator('.app-header .brand').evaluate(async btn=>{
 const img=btn.querySelector('img');
 const attributes=e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();return{border:c.border,background:c.backgroundColor,outline:c.outline,boxShadow:c.boxShadow,display:c.display,objectFit:c.objectFit,width:r.width,height:r.height,src:e.currentSrc||undefined,naturalSize:e.naturalWidth&&[e.naturalWidth,e.naturalHeight]}};
 const raw=await fetch(img.currentSrc,{cache:'no-store'}).then(x=>x.arrayBuffer());
 const hash=await crypto.subtle.digest('SHA-256',raw);
 return{button:attributes(btn),image:attributes(img),assetBytes:raw.byteLength,sha256:Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,'0')).join('')};
 });
 console.log('LOGO_DIAGNOSTIC',viewport.name,JSON.stringify(logoDiagnostic));
 if(!logoDiagnostic.button.border.startsWith('0px')||!logoDiagnostic.button.background.includes('0)'))throw Error(`${viewport.name}: logo is still framed by a button background/border`);
 if(logoDiagnostic.sha256!=='820fe71cfb1a5b29ab1daf8723f90c57f7a29b9039121072bbf32248fad2f3f4')throw Error('Preview logo differs from the approved transparent original');
 if(await page.locator('#app [style]').count())throw Error(`${viewport.name}: inline style blocked by site CSP remains in rendered page`);
 if(viewport.name==='iphone'&&!(await page.locator('.local-film img').isVisible()))throw Error('Mobile opening story image should be visible');
 await inspect(page,`${viewport.name}-home`);
 if(viewport.name==='desktop'||viewport.name==='iphone'){
  await page.locator('.home-ctas [data-act="go"][data-to="mood"]').click();
  await page.locator('.mood-grid').waitFor();
  if(viewport.name==='iphone'&&!(await page.locator('.mood-card .mood-title-compact').first().isVisible()))throw Error('Mobile mood cards should show short legible titles');
  await inspect(page,`${viewport.name}-moods`,{internet:1});
  await page.locator('.mood-card[data-id="island"]').click();
  if(viewport.name==='iphone'){
   await page.locator('.mobile-story').waitFor();
  }
  await inspect(page,`${viewport.name}-journey`);
  await page.locator('button[data-act="go"][data-to="details"]:visible').first().click();
  await page.locator('main.stage').waitFor();
  await inspect(page,`${viewport.name}-details`);
  await page.locator('button[data-act="set"][data-key="party"][data-value="family"]').click();
  await page.locator('#children').waitFor();
  await inspect(page,`${viewport.name}-family`);
  await page.locator('button[data-act="go"][data-to="builder"]:visible').first().click();
  await page.locator('.experience-grid').waitFor();
  await inspect(page,`${viewport.name}-experiences`);
  await page.locator('.experience-grid button[data-act="exp"]').first().click();
  await page.locator('button[data-act="go"][data-to="review"]:visible').first().click();
  await page.locator('.review-grid').waitFor();
  await page.locator('.v8-demo-note').waitFor();
  if(await page.locator('#name, #contact, button[data-act="submit"]').count())throw Error('Read-only preview must not display lead collection fields');
  await inspect(page,`${viewport.name}-review`);
 }
 if(errors.length)throw Error(`${viewport.name}: uncaught page errors: ${errors.join('; ')}`);
 await page.close();
}
await browser.close();
await writeFile(`${DIR}/results.json`,JSON.stringify({base:BASE,checkedAt:new Date().toISOString(),checks},null,2));
console.log('V8 LIVE VISUAL QA PASS',checks.map(x=>x.name).join(', '));
