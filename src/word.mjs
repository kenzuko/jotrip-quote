// Minimal dependency-free Word OOXML export from the APPROVED PUBLIC snapshot only.
const enc=new TextEncoder();
export const xml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const p=(v,style='')=>`<w:p>${style?`<w:pPr><w:pStyle w:val="${style}"/></w:pPr>`:''}<w:r><w:t xml:space="preserve">${xml(v)}</w:t></w:r></w:p>`;
const header=(v)=>p(v,'Heading1');
const list=xs=>(xs||[]).map(s=>p('• '+s)).join('');
const cell=x=>`<w:tc><w:tcPr><w:tcW w:w="2500" w:type="dxa"/></w:tcPr>${p(x)}</w:tc>`;
const table=rows=>`<w:tbl><w:tblPr><w:tblBorders><w:bottom w:val="single" w:sz="4"/><w:insideH w:val="single" w:sz="4"/></w:tblBorders></w:tblPr>${rows.map(row=>`<w:tr>${row.map(cell).join('')}</w:tr>`).join('')}</w:tbl>`;
function crc32(bytes){let crc=0xffffffff;for(let b of bytes){crc^=b;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}return(crc^0xffffffff)>>>0}
function put16(a,n){a.push(n&255,(n>>>8)&255)}function put32(a,n){put16(a,n&65535);put16(a,n>>>16)}
function zip(files){const out=[],central=[];let offset=0;for(const [name,body] of files){const n=enc.encode(name),b=enc.encode(body),crc=crc32(b);const local=[];put32(local,0x04034b50);put16(local,20);put16(local,0x0800);put16(local,0);put16(local,0);put16(local,0);put32(local,crc);put32(local,b.length);put32(local,b.length);put16(local,n.length);put16(local,0);out.push(...local,...n,...b);const cen=[];put32(cen,0x02014b50);put16(cen,20);put16(cen,20);put16(cen,0x0800);put16(cen,0);put16(cen,0);put16(cen,0);put32(cen,crc);put32(cen,b.length);put32(cen,b.length);put16(cen,n.length);put16(cen,0);put16(cen,0);put16(cen,0);put16(cen,0);put32(cen,0);put32(cen,offset);central.push(...cen,...n);offset=out.length}const cdOffset=out.length;out.push(...central);const cdSize=out.length-cdOffset;put32(out,0x06054b50);put16(out,0);put16(out,0);put16(out,files.length);put16(out,files.length);put32(out,cdSize);put32(out,cdOffset);put16(out,0);return new Uint8Array(out)}
export function makeWord(publicSnapshot){
 const s=publicSnapshot;
 if(!s||typeof s!=='object'||!Array.isArray(s.days))throw Error('Approved snapshot required');
 const body=[p('JOTRIP  |  TRAVEL PROPOSAL','Brand'),header(s.title),p(s.subtitle),p([s.startDate,s.endDate].filter(Boolean).join(' - ')),p(s.clientSalutation?`Kính gửi ${s.clientSalutation},`:''),p(s.introduction),header('CHƯƠNG TRÌNH')];
 s.days.forEach((d,i)=>{body.push(p(`NGÀY ${i+1}: ${d.title}`,'Heading2'),...String(d.details||'').split('\n').filter(Boolean).map(x=>p(x)));if(d.highlight)body.push(p('Điểm thú vị: '+d.highlight));if(d.caution)body.push(p('Lưu ý: '+d.caution))});
 body.push(header('PHƯƠNG ÁN VÀ GIÁ BÁN'));
 body.push(table([['Phương án','Khách','Giá mỗi khách','Trạng thái'],...(s.options||[]).map(o=>[o.label+' - '+o.hotel,String(o.partySize),Number(o.sellPerGuest).toLocaleString('vi-VN')+' VNĐ',o.priceState==='confirmed'?'Đã kiểm tra':'Tham khảo'])]));
 body.push(header('ĐÃ BAO GỒM'),list(s.inclusions),header('CHƯA BAO GỒM'),list(s.exclusions),header('ĐIỀU KIỆN'),p(s.terms),p(s.notice||''));
 const document=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body.join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="900" w:right="1000" w:bottom="850" w:left="1000"/></w:sectPr></w:body></w:document>`;
 const styles=`<?xml version="1.0" encoding="UTF-8"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/><w:sz w:val="22"/><w:color w:val="213A2C"/></w:rPr><w:pPr><w:spacing w:after="110" w:line="300" w:lineRule="auto"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="Heading 1"/><w:rPr><w:sz w:val="34"/><w:b/><w:color w:val="173F32"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="Heading 2"/><w:rPr><w:sz w:val="26"/><w:b/><w:color w:val="77944C"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Brand"><w:name w:val="Brand"/><w:rPr><w:sz w:val="22"/><w:b/><w:color w:val="77944C"/></w:rPr></w:style></w:styles>`;
 return zip([
  ['[Content_Types].xml','<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>'],
  ['_rels/.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
  ['word/_rels/document.xml.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'],
  ['word/document.xml',document],['word/styles.xml',styles]
 ]);
}
