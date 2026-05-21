"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#F8F8F8",
        padding: 40,
        textAlign: "center",
      }}
    >
      <script
        src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
        type="module"
        async
      />
      <div
        dangerouslySetInnerHTML={{
          __html: `<dotlottie-player src="https://lottie.host/46472292-5dd6-4fb5-b676-f51241b22685/nwetqxzeeI.lottie" background="transparent" speed="1" style="width:320px;height:320px;max-width:100%" loop autoplay></dotlottie-player>`,
        }}
      />
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#212121",
          margin: "24px 0 8px",
        }}
      >
        Trang không tìm thấy
      </h1>
      <p
        style={{
          fontSize: 14,
          color: "#666666",
          maxWidth: 400,
          lineHeight: 1.6,
          margin: "0 0 32px",
        }}
      >
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Vui lòng kiểm
        tra lại đường dẫn.
      </p>
      <Link
        href="/"
        style={{
          padding: "12px 32px",
          borderRadius: 8,
          background: "#077E9E",
          color: "#fff",
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        Về trang chủ
      </Link>
    </div>
  );
}
