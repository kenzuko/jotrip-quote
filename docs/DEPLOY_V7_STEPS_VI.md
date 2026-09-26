# JoTrip Bespoke V7 - tích hợp và xuất bản

**Trạng thái:** mã nguồn tích hợp sẵn, **CHƯA ĐƯỢC DEPLOY**. Ảnh và footer vẫn ở trạng thái review. Chỉ đưa production khi các gate dưới đây được xác nhận.

## Những gì đã nối
- `/bespoke`: HTML V7 thực sự (CSS/JS tách tệp), font Be Vietnam Pro + Playfair Display, hero và footer duyệt.
- `/bespoke/assets/*`: tài nguyên staging trong namespace riêng; không đụng homepage JoTrip.
- `/bespoke/api/submit`: gửi nhu cầu thực qua same-origin POST tới D1, có consent, idempotency key, origin check và rate limit ở Worker; không lưu PII vào trình duyệt.
- `/quote/p/:token`: snapshot khách đã duyệt, phản hồi từng mục và Word công khai; API nhân viên giữ dưới host `quote.jotrip.vn`.
- Tương thích với tạo báo giá thủ công từ Quote Studio.

## Gate bắt buộc trước deploy
1. Thay hoặc ký duyệt toàn bộ ảnh `public/bespoke/assets/*.webp`: nguồn gốc, đúng địa điểm, quyền dùng thương mại và model release nếu có khách nhận diện được. Không đưa ảnh chưa duyệt vào repo GitHub public.
2. Xác nhận số điện thoại, các nút Zalo/LINE, địa chỉ/email, điều khoản/chính sách quyền riêng tư trong footer. Không đăng placeholder hoặc liên kết sai.
3. Phải có tài khoản Cloudflare của JoTrip đã cấp quyền triển khai. Tạo D1 **preview** riêng, cấu hình `wrangler.jsonc` với ID chính xác, không đưa mật khẩu/token vào GitHub.
4. Kiểm thử Cloudflare preview với dữ liệu giả, Cloudflare Access/MFA và vai trò cho `quote.jotrip.vn`. Chạy D1 migrations, kiểm tra idempotency, rate limit, CSRF, cross-host, leak giá vốn và Word.
5. iPhone Safari thật: mở direct link Zalo/LINE, cuộn, gõ biểu mẫu, gửi, sửa lựa chọn. Kiểm tra hero, text, panel, footer.
6. Chỉ cấu hình Worker route chính xác `jotrip.vn/bespoke*` và `jotrip.vn/quote/p/*` khi app hiện hữu không dùng các route ấy; giữ nguyên toàn bộ homepage/site cũ. Studio route `quote.jotrip.vn/*` độc lập. Dùng rollout preview/canary trước đổi production; kiểm tra rollback.
7. Thay meta `noindex,nofollow` sang `index,follow` sau khi kiểm tra chính sách công khai và SEO.

## Cấu hình CLI (người có quyền Cloudflare)
```
# Chạy trong thư mục jotrip-quote-v1, sau khi cài Node.js:
npm install
npm test
npx wrangler login
# Tạo D1 preview trước, điền database_id vào wrangler.jsonc:
npx wrangler d1 create jotrip-quote-preview-db
npx wrangler d1 migrations apply jotrip-quote-preview-db --remote --env preview
# Cấu hình secrets bằng wrangler secret put, KHÔNG ghi vào repo.
# Kiểm tra routing và account trước khi chạy:
npm run deploy:preview
```

Lệnh trên là hướng dẫn, **không phải xác nhận đã chạy**. Không dùng ảnh staging để xuất bản chính thức. Không merge Draft PR #1 cho đến khi gói local đã đồng bộ và security QA đạt.
