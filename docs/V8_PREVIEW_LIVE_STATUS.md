# JoTrip Bespoke V8 - LIVE visual preview status

**Last verified:** 26/09/2026, GitHub Actions run [36223797968](https://github.com/kenzuko/jotrip-quote/actions/runs/36223797968). All jobs passed, including remote preview D1 migrations, Worker asset deployment and **live HTTP smoke checks**.

- Visual preview: https://jotrip-quote-preview.kenzuko.workers.dev/bespoke
- Worker: `jotrip-quote-preview`, binding `DB` to existing `jotrip-quote-preview-db`. No changes to `jotrip.vn`, production DNS, default Wrangler environment or `main` branch. PR #1 remains **Draft**.
- GitHub Actions preview release at source `32b5a413b6e7defd335fd2d8b0fc76886d9e9dd1`: **23 tests passed, 0 failed**; preview dry run, remote migrations and actual deployment succeeded.
- Smoke checks after deployment verified live `/bespoke` HTML; JS; CSS; `/bespoke/assets/coast.webp` and `journal-private.webp` full-size assets; `POST /bespoke/api/submit` returned **503** (intake closed); `GET /api/staff/quotes` returned **403** (Studio closed).

## V8 visual change register

26 optimized photo slots (about 6.7 MB WebP combined) were sourced from the two Google Drive folders explicitly supplied by the owner. Hero, five mood cards, journey previews, experience cards, four editorial photo surfaces, and photo-backed closing CTA/footer now use actual supplied photos. The three subsequent guided screens (details, experience builder, review) have image headers. The desktop and 390px-mobile local Chromium flows were simulated without page script errors.

For every hero/mood/experience visual whose source is the owner's `JOTRIP_INTERNET_IMAGES`, the page displays **Nguồn: Internet**. A source register with exact original Drive IDs and slot names is [PHOTO_SOURCE_V8.md](PHOTO_SOURCE_V8.md). Attribution is source disclosure, **not** verification of copyright or photo-subject consent. Check these before selling the website commercially.

## Remaining release gates

- Preview is **read-only**: `PREVIEW_LOCK=false`, `PRIVACY_NOTICE_APPROVED=false`, `ALLOW_PREVIEW_SUBMISSIONS=false`, `ENABLE_STAFF_PREVIEW=false`. No live customer PII or staff Studio.
- Do not interpret Chrome responsive emulation as a test on actual iPhone Safari; owner hardware review remains outstanding.
- Commercial image rights and releases where recognizable guests appear, localization, privacy notice, terms, MFA / staff access controls and production D1 / routing remain separate launch decisions.
- Keep current `jotrip.vn` homepage unchanged until separately approved. No silent merge or DNS changes.

## V8.3 - Hoàn thiện giao diện và kiểm tra trực tiếp (26/09/2026, 14:30 UTC+7)

- Hoàn thiện 26 vị trí ảnh WebP thật, gồm hero, thẻ gu, Journey Studio, toàn bộ trải nghiệm, 4 ảnh biên tập, CTA và footer. Ảnh từ thư mục Internet hiển thị nhãn **Nguồn: Internet**; lưu nguồn từng ảnh trong `PHOTO_SOURCE_V8.md`. Nhãn nguồn không thay thế quyền khai thác thương mại.
- Phát hiện và sửa lỗi nhãn **Nguồn: Internet** nổi đè lên chữ khi ảnh tiêu đề bị CSS ẩn trên một số kích thước màn hình. Nhãn giờ chỉ xuất hiện khi ảnh tương ứng thực sự hiển thị; ảnh banner các bước có nhãn nằm ngay trên ảnh.
- Trên **preview công khai**, bước cuối nay hiện thông báo rõ **đây là bản xem thử, chưa nhận dữ liệu cá nhân** cùng hai cách liên hệ thật (gọi `0817 060 066` và `phuquoclux@gmail.com`), thay vì để người xem điền biểu mẫu rồi nhận lỗi 503. Production form code vẫn được giữ riêng, chưa bật. API tiếp tục trả 503 cho guest submit và 403 cho staff.
- [Chrome QA 1440px desktop / 390px mobile / 320px compact](https://github.com/kenzuko/jotrip-quote/actions/runs/36226939847): tất cả kiểm tra hành trình và ảnh đạt, 15 screenshot tự động, không ảnh hỏng, không tràn ngang, không lỗi JavaScript, nút điều hướng mobile hoạt động. Đây là **Chrome mô phỏng iPhone**, không phải thử trên Safari thiết bị thật.
- [GitHub Actions preview deploy cuối](https://github.com/kenzuko/jotrip-quote/actions/runs/36226937807): PASS gồm Node tests, Wrangler dry run, preview D1 migrations, upload Worker/assets và HTTP smoke sau deploy. Tại cuối mốc này, bản xem thử cập nhật ở `https://jotrip-quote-preview.kenzuko.workers.dev/bespoke`.
- PR #1 giữ **Draft**; `main`, `jotrip.vn`, DNS production, form nhận khách và Quote Studio vẫn giữ nguyên hoặc khóa như trước.
