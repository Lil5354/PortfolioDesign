import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  const names = [
    "authjs.session-token", "__Secure-authjs.session-token",
    "authjs.csrf-token", "__Secure-authjs.csrf-token",
    "authjs.callback-url", "__Secure-authjs.callback-url",
    "next-auth.session-token", "__Secure-next-auth.session-token",
    "next-auth.csrf-token", "__Secure-next-auth.csrf-token",
    "next-auth.callback-url",
  ];
  const isSecure = process.env.NODE_ENV === "production";
  for (const name of names) {
    response.cookies.set(name, "", { path: "/", maxAge: 0, secure: isSecure, httpOnly: true, sameSite: "lax" });
  }
  return response;
}
