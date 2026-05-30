import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ERROR_MESSAGES: Record<string, { title: string; message: string }> = {
  Configuration: {
    title: 'Lỗi cấu hình',
    message:
      'Hệ thống xác thực đang gặp sự cố cấu hình. Vui lòng thử lại sau hoặc liên hệ quản trị viên.',
  },
  AccessDenied: {
    title: 'Truy cập bị từ chối',
    message:
      'Bạn không có quyền truy cập. Vui lòng thử lại hoặc liên hệ quản trị viên.',
  },
  Verification: {
    title: 'Xác thực thất bại',
    message: 'Token xác thực không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.',
  },
  CredentialsSignin: {
    title: 'Đăng nhập thất bại',
    message: 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.',
  },
  Default: {
    title: 'Đã xảy ra lỗi',
    message:
      'Đã có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại hoặc liên hệ quản trị viên.',
  },
};

export async function GET(request: NextRequest) {
  const error = request.nextUrl.searchParams.get('error') || 'Default';
  const info = ERROR_MESSAGES[error] || ERROR_MESSAGES.Default;

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lỗi xác thực - Portfolio UEF</title>
  <script src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs" type="module" async></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #F8F8F8;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 40px;
    }
    .container {
      text-align: center;
      max-width: 480px;
    }
    .lottie-wrap {
      width: 320px;
      height: 320px;
      max-width: 100%;
      margin: 0 auto;
    }
    .lottie-wrap dotlottie-player {
      width: 100%;
      height: 100%;
    }
    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #212121;
      margin: 24px 0 8px;
    }
    p {
      font-size: 14px;
      color: #666666;
      line-height: 1.6;
      margin: 0 0 32px;
    }
    .buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .btn {
      padding: 12px 32px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      display: inline-block;
      transition: all 0.15s;
    }
    .btn-primary {
      background: #1a4ba8;
      color: #fff;
      border: none;
    }
    .btn-primary:hover {
      background: #0d2e6e;
    }
    .btn-secondary {
      background: #fff;
      color: #212121;
      border: 1px solid #E0E0E0;
    }
    .btn-secondary:hover {
      background: #F0F0F0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="lottie-wrap">
      <dotlottie-player
        src="/wind-field-404.lottie"
        background="transparent"
        speed="1"
        loop
        autoplay
      ></dotlottie-player>
    </div>
    <h1>${info.title}</h1>
    <p>${info.message}</p>
    <div class="buttons">
      <a href="/" class="btn btn-primary">Về trang chủ</a>
      <a href="/#/auth" class="btn btn-secondary">Thử lại</a>
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
