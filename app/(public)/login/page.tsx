"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main>
      <h1>Đăng nhập</h1>
      <p>Sử dụng tài khoản Google @uef.edu.vn</p>
      <button onClick={() => signIn("google", { callbackUrl: "/" })}>
        Đăng nhập với Google
      </button>
    </main>
  );
}
