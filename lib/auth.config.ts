import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | null;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    isActive: boolean;
  }
}

export const authConfig = {
  pages: {
    signIn: "/api/auth/signin",
    error: "/api/auth/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const pathname = nextUrl.pathname;

      const isPublic =
        pathname === "/" ||
        pathname === "/login" ||
        pathname.startsWith("/gallery") ||
        pathname.startsWith("/portfolio") ||
        pathname.startsWith("/artwork") ||
        pathname.startsWith("/about");

      if (isPublic) return true;

      if (!isLoggedIn) {
        if (
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/admin")
        ) {
          return NextResponse.redirect(new URL("/login", nextUrl));
        }
        return false;
      }

      if (role === "student" && pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }

      if (
        (role === "lecturer" || role === "admin") &&
        pathname.startsWith("/dashboard")
      ) {
        return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
      }

      return true;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
