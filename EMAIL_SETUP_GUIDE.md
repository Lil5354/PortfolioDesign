# EMAIL SETUP - HƯỚNG DẪN CHI TIẾT

## VẤN ĐỀ: Gmail App Password không hoạt động

Lỗi: `535-5.7.8 Username and Password not accepted`

## GIẢI PHÁP 1: Dùng Mailtrap (Khuyến nghị cho Dev)

### Bước 1: Đăng ký Mailtrap
1. Truy cập https://mailtrap.io/
2. Click "Get Started Free"
3. Tạo tài khoản miễn phí

### Bước 2: Lấy SMTP credentials
1. Vào Dashboard → Inboxes
2. Click vào inbox "Test" (hoặc tạo inbox mới)
3. Copy credentials:
   - SMTP Host: `smtp.mailtrap.io`
   - SMTP Port: `2525`
   - Username: `your-mailtrap-username`
   - Password: `your-mailtrap-password`

### Bước 3: Cập nhật .env
```env
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT="2525"
SMTP_USER="your-mailtrap-username"
SMTP_PASS="your-mailtrap-password"
SMTP_FROM="UEF Design Gallery <test@mailtrap.io>"
```

### Bước 4: Test
- Email sẽ đến inbox Mailtrap Dashboard
- Kiểm tra email có mã OTP

---

## GIẢI PHÁP 2: Gmail App Password (nếu muốn dùng Gmail)

### Cần kiểm tra:
1. ✅ Bật 2-Step Verification: https://myaccount.google.com/security
2. ✅ Đã tạo App Password: https://myaccount.google.com/apppasswords
3. ✅ Chọn đúng app: "Mail"
4. ✅ Chọn đúng device: "Other (UEF Portfolio)"

### Quan trọng:
- App Password phải CHÍNH XÁC 16 ký tự
- KHÔNG được có khoảng trắng
- KHÔNG được copy từ trang tạo password (phải copy từ field password)

### Nếu vẫn lỗi:
- Vô hiệu hóa App Password cũ
- Tạo App Password mới
- Kiểm tra xem Gmail có đang bật "Less secure app access" không (TUYỆT ĐỐI KHÔNG bật)

---

## GIẢI PHÁP 3: Dùng SendGrid (Chuyên nghiệp)

### Bước 1: Đăng ký SendGrid
1. Truy cập https://sendgrid.com/
2. Tạo tài khoản Free (300 emails/day)

### Bước 2: Lấy API Key
1. Dashboard → Settings → API Keys
2. Create API Key
3. Copy API Key

### Bước 3: Cập nhật code
Thay đổi `lib/mail.ts` để dùng SendGrid thay vì SMTP

---

## KIỂM TRA SAU KHI SETUP

1. Restart Next.js server: `npm run dev`
2. Test API: `POST http://localhost:3000/api/auth/send-verification`
3. Kiểm tra email đến inbox của bạn

---

## LỖI THƯỜNG GẶP

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-------------|-----------|
| 535-5.7.8 | Password sai | Kiểm tra password, tạo mới |
| Connection timed out | SMTP server lỗi | Kiểm tra internet |
| Email not found | SMTP port sai | Dùng port 587 cho Gmail |
| Authentication failed | 2FA chưa bật | Bật 2FA tại Google Account |
