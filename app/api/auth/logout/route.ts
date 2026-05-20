import { NextResponse } from "next/server";
import { signOut } from "@/lib/auth";

export async function POST() {
  try {
    return await signOut({ redirect: false });
  } catch {
    const response = NextResponse.json({ success: true });
    response.cookies.set("authjs.session-token", "", { path: "/", maxAge: 0 });
    response.cookies.set("authjs.csrf-token", "", { path: "/", maxAge: 0 });
    response.cookies.set("authjs.callback-url", "", { path: "/", maxAge: 0 });
    return response;
  }
}
