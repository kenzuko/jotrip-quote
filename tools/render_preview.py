from pathlib import Path
import base64,subprocess, re
ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/'public/assets'
css=(ASSETS/'site.css').read_text()
js=(ASSETS/'app.js').read_text()
for asset in ASSETS.iterdir():
 if asset.suffix.lower() not in ('.png','.jpg','.jpeg'):continue
 mime='image/png' if asset.suffix.lower()=='.png' else 'image/jpeg'
 uri='data:'+mime+';base64,'+base64.b64encode(asset.read_bytes()).decode()
 css=css.replace("'/assets/"+asset.name+"'", "'"+uri+"'")

for name,code in [('home','entry()'),('bespoke','bespoke()'),('login','login()'),('studio','staff()')]:
 x=subprocess.check_output(['node','--input-type=module','-e',f'import {{{"staff" if name=="studio" else ("entry" if name=="home" else name)}}} from "{ROOT}/src/views.mjs"; process.stdout.write({code});'],text=True)
 x=x.replace('<link href="/assets/site.css" rel="stylesheet"/>','<style>'+css+'</style>')
 x=x.replace('<script src="/assets/app.js" defer></script>','')
 for asset in ASSETS.iterdir():
  if asset.suffix.lower() not in ('.png','.jpg','.jpeg'):continue
  mime='image/png' if asset.suffix.lower()=='.png' else 'image/jpeg'
  uri='data:'+mime+';base64,'+base64.b64encode(asset.read_bytes()).decode()
  x=x.replace('/assets/'+asset.name,uri)
 demo_js=js.replace('sessionStorage','window.__demoStore').replace('crypto.randomUUID()',"'demo-00000000-1111-4444-8888-111111111111'") if name=='bespoke' else ''
 x=x.replace('</header>','</header><div style="background:#fff2cf;color:#654400;text-align:center;padding:8px;font:600 13px Arial,sans-serif">BẢN DEMO CHỈ ĐỂ NGHIỆM THU GIAO DIỆN - KHÔNG LƯU HOẶC GỬI DỮ LIỆU KHÁCH</div>',1)
 x=x.replace('</body>','<script>window.__demoStore={_data:{},getItem(k){return this._data[k]||null},setItem(k,v){this._data[k]=v},removeItem(k){delete this._data[k]}};</script><script>'+demo_js+'</script></body>')
 (ROOT/'docs'/f'PREVIEW-{name}.html').write_text(x)
 print('Created',name,len(x))
