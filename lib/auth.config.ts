import type { NextAuthConfig } from "next-auth";

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

export const authConfig = {
  pages: {
    signIn: "/api/auth/signin",
    error: "/api/auth/error",
  },
  callbacks: {
    authorized() {
      return true;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token as any)?.id || session.user.id;
        session.user.role = (token as any)?.role || session.user.role;
      }
      return session;
    },
  },
  providers: [],
  trustHost: true,
} satisfies NextAuthConfig;
