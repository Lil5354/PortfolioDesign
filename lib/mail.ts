import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const BRAND_COLOR = "#1a4ba8";
const BG_COLOR = "#F8F8F8";
const TEXT_COLOR = "#212121";
const MUTED_COLOR = "#666666";

function emailTemplate({ title, body, code }: { title: string; body: string; code?: string }) {
  return `
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:${BG_COLOR};font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG_COLOR};padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        <tr>
          <td style="padding:36px 32px 0 32px;text-align:center;">
            <img src="https://uef.edu.vn/themes/uef/images/logo-uef.png" alt="UEF" style="height:40px;margin-bottom:8px;" />
            <h1 style="margin:8px 0 0 0;font-size:22px;font-weight:700;color:${BRAND_COLOR};">Design Gallery</h1>
          </td>
        </tr>
        <tr><td style="padding:24px 32px 32px 32px;">
          <h2 style="margin:0 0 12px 0;font-size:18px;font-weight:600;color:${TEXT_COLOR};">${title}</h2>
          <p style="margin:0 0 16px 0;font-size:14px;line-height:1.7;color:${MUTED_COLOR};">${body}</p>
          ${code ? `
          <div style="background:${BG_COLOR};border:1px dashed ${BRAND_COLOR};border-radius:12px;padding:20px;text-align:center;margin:20px 0;">
            <p style="margin:0 0 6px 0;font-size:12px;color:${MUTED_COLOR};text-transform:uppercase;letter-spacing:1px;">Mã xác thực của bạn</p>
            <p style="margin:0;font-size:32px;font-weight:800;color:${BRAND_COLOR};letter-spacing:8px;font-family:monospace;">${code}</p>
            <p style="margin:8px 0 0 0;font-size:11px;color:${MUTED_COLOR};">Mã có hiệu lực trong 10 phút</p>
          </div>` : ""}
          <p style="margin:16px 0 0 0;font-size:12px;color:${MUTED_COLOR};line-height:1.6;">
            Nếu bạn không yêu cầu thao tác này, vui lòng bỏ qua email này.<br />
            © 2024 UEF Design Gallery - Khoa Thiết kế Đồ họa
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendPasswordResetCode(email: string, fullName: string, code: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "UEF Design Gallery <noreply@uef.edu.vn>",
    to: email,
    subject: "Đặt lại mật khẩu - UEF Design Gallery",
    html: emailTemplate({
      title: `Xin chào ${fullName},`,
      body: "Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã xác thực dưới đây để tiến hành đặt lại mật khẩu.",
      code,
    }),
  });
}

export async function sendEmailVerificationCode(email: string, fullName: string, code: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "UEF Design Gallery <noreply@uef.edu.vn>",
    to: email,
    subject: "Xác thực email - UEF Design Gallery",
    html: emailTemplate({
      title: `Xin chào ${fullName},`,
      body: "Cảm ơn bạn đã đăng ký tài khoản tại UEF Design Gallery. Vui lòng sử dụng mã xác thực dưới đây để xác nhận địa chỉ email của bạn.",
      code,
    }),
  });
}
