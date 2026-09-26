// Strictly limited fields leave the internal commercial ledger server-side.
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const text = (value, max = 300) => String(value ?? '').trim().slice(0, max);
export const positive = (value, max = 1e10) => Number.isFinite(Number(value)) ? Math.min(max, Math.max(0, Math.round(Number(value)))) : 0;
export const choice = (value, opts, fallback='') => opts.includes(value) ? value : fallback;
const arr = (x, max=20) => Array.isArray(x) ? x.slice(0,max) : [];
export const allowedPhoto = value => /^\/assets\/[a-z0-9._-]{4,90}\.(jpg|jpeg|png|webp)$/i.test(String(value||'')) ? String(value) : '';
export function normalizeRequest(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw Error('Thông tin không hợp lệ');
  const contact = text(input.contact, 160);
  if (!contact || !input.consent) throw Error('Vui lòng điền thông tin liên hệ và đồng ý cho JoTrip sử dụng để tư vấn.');
  if (contact.length < 5) throw Error('Thông tin liên hệ chưa đủ rõ.');
  return {
    route: choice(input.route,['quick','deep','story'],'quick'),
    name: text(input.name,90), contact,
    contactMethod: choice(input.contactMethod,['email','phone','zalo','line','whatsapp'],'email'),
    locale: choice(input.locale,['vi','en','zh-Hant'],'vi'),
    feelings: arr(input.feelings,8).map(v=>text(v,50)).filter(Boolean),
    party: choice(input.party,['couple','family','friends','company','other','unknown'],'unknown'),
    adults: positive(input.adults,300), children: positive(input.children,100),
    childAgeBands: arr(input.childAgeBands,4).map(v=>text(v,15)),
    date: text(input.date,50), nights: positive(input.nights,30),
    budget: positive(input.budget,1e11), budgetBasis: choice(input.budgetBasis,['per_person','whole_group','unknown'],'unknown'),
    flightIncluded: choice(input.flightIncluded,['yes','no','unknown'],'unknown'),
    accommodation: text(input.accommodation,100), pace: choice(input.pace,['slow','balanced','active','unknown'],'unknown'),
    experiences: arr(input.experiences,16).map(v=>text(v,60)).filter(Boolean),
    mustHave: text(input.mustHave,700), avoid: text(input.avoid,700),
    notes: text(input.notes,2000), consentVersion:'2026-09-25-v1'
  };
}
export function normalizeDraft(input) {
  if (!input || typeof input!=='object' || Array.isArray(input)) throw Error('Bản nháp không hợp lệ');
  const title = text(input.title,140);
  if (!title) throw Error('Tên hành trình không được bỏ trống');
  return {
    title, clientSalutation:text(input.clientSalutation,90), subtitle:text(input.subtitle,200),
    startDate:text(input.startDate,35), endDate:text(input.endDate,35),
    introduction:text(input.introduction,1700),
    days:arr(input.days,21).map((d,i)=>({key:`day-${i+1}`,title:text(d?.title,160),details:text(d?.details,2600),highlight:text(d?.highlight,340),caution:text(d?.caution,340),photo:allowedPhoto(d?.photo)})),
    options:arr(input.options,12).map((o,i)=>({key:`option-${i+1}`,label:text(o?.label,100),hotel:text(o?.hotel,110),partySize:positive(o?.partySize,300),sellPerGuest:positive(o?.sellPerGuest),priceState:choice(o?.priceState,['indicative','confirmed'],'indicative')})),
    inclusions:arr(input.inclusions,24).map(s=>text(s,260)),exclusions:arr(input.exclusions,24).map(s=>text(s,260)),
    terms:text(input.terms,2400), validUntil:text(input.validUntil,35),
    internal:{lines:arr(input.internal?.lines,150).map(l=>({name:text(l?.name,130),qty:positive(l?.qty,100000),unitCost:positive(l?.unitCost),basis:choice(l?.basis,['fixed','per_guest','per_room_night'],'fixed')})),notes:text(input.internal?.notes,2000)}
  };
}
export function computeInternal(draft, guests, rooms, nights) {
  const n=Math.max(1,positive(guests,300)),r=positive(rooms,300),d=positive(nights,30);
  const lines=(draft.internal?.lines??[]).map(l=>({name:l.name,total:l.qty*l.unitCost*(l.basis==='per_guest'?n:l.basis==='per_room_night'?r*d:1)}));
  return {totalCost:lines.reduce((a,l)=>a+l.total,0),lines};
}
export function approvePublic(draft) {
  const clean=normalizeDraft(draft);
  if (!clean.days.length || !clean.days.some(d=>d.title&&d.details)) throw Error('Chưa có lịch trình để công bố');
  if (!clean.options.some(o=>o.sellPerGuest>0&&o.partySize>0)) throw Error('Chưa có giá bán để công bố');
  // Construct from scratch. Never serialize draft or spread any internal keys.
  return Object.freeze({
    title:clean.title,clientSalutation:clean.clientSalutation,subtitle:clean.subtitle,
    startDate:clean.startDate,endDate:clean.endDate,introduction:clean.introduction,
    days:clean.days,options:clean.options,inclusions:clean.inclusions,exclusions:clean.exclusions,
    terms:clean.terms,validUntil:clean.validUntil,notice:'Đề xuất chưa xác nhận đặt chỗ. Lịch hoạt động, quỹ phòng và dịch vụ theo xác nhận cuối cùng của JoTrip.'
  });
}
export async function sha256(value) {
  const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(value)));
  return [...new Uint8Array(bytes)].map(n=>n.toString(16).padStart(2,'0')).join('');
}
export function token(bytes=32) {const b=crypto.getRandomValues(new Uint8Array(bytes));return [...b].map(n=>n.toString(16).padStart(2,'0')).join('');}
export function publicCode() {return crypto.randomUUID().split('-')[0].toUpperCase();}
