import { NextRequest } from "next/server";
import { signIn } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const redirectTo = formData.get("redirectTo") || "http://localhost:5173";

    if (!email || !password) {
      return new Response("Missing fields", { status: 400 });
    }

    const result = await signIn("credentials", {
      email: email.toString(),
      password: password.toString(),
      redirect: false,
    });

    if (!result?.ok) {
      return new Response("Login failed", { status: 401 });
    }

    const html = `<!DOCTYPE html><html><head><script>window.location.href='${redirectTo}/'</script></head><body></body></html>`;

    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch {
    return new Response("Login failed", { status: 401 });
  }
}
