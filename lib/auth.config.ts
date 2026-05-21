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
  },
  callbacks: {
    authorized() {
      return true;
    },
  },
  providers: [],
  trustHost: true,
} satisfies NextAuthConfig;
