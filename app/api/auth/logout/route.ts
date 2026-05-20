import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  const cookies = ["authjs.session-token", "authjs.csrf-token", "authjs.callback-url", "next-auth.session-token", "next-auth.csrf-token", "next-auth.callback-url"];
  for (const name of cookies) {
    response.cookies.set(name, "", { path: "/", maxAge: 0 });
  }
  return response;
}
