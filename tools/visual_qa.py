import asyncio
from pathlib import Path
from playwright.async_api import async_playwright
root=Path(__file__).resolve().parents[1]
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  for name,w,h in [('home',1440,930),('bespoke',1440,1000),('bespoke',390,844),('login',1440,900),('studio',1440,900)]:
   page=await b.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   content=(root/'docs'/f'PREVIEW-{name}.html').read_text()
   await page.set_content(content,wait_until='load')
   await page.wait_for_timeout(400)
   outfile=root/'docs'/f'{name}-{w}px.png'
   await page.screenshot(path=str(outfile),full_page=True)
   dims=await page.evaluate('({scrollWidth:document.documentElement.scrollWidth,innerWidth:innerWidth})')
   print('SCREENSHOT',outfile.name,'errors',errors[:2],'dims',dims)
   if name=='bespoke':
    await page.get_by_text('Biển đảo và trải nghiệm riêng',exact=True).click()
    await page.locator('[data-step="0"] [data-next]').click()
    assert await page.locator('[data-step="1"]').is_visible()
    await page.select_option('#party','family')
    assert await page.locator('#childAgeWrap').is_visible()
    await page.locator('[data-step="1"] [data-next]').click()
    assert await page.locator('[data-step="2"]').is_visible()
    await page.locator('.exp button').first.click()
    await page.locator('[data-step="2"] [data-next]').click()
    assert await page.locator('[data-step="3"]').is_visible()
    print('BESPOKE_4_STEP_NAV_OK',w)
   await page.close()
  await b.close()
asyncio.run(main())
