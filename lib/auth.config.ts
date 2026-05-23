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
    authorized() {
      return true;
    },
  },
  providers: [],
  trustHost: true,
} satisfies NextAuthConfig;
