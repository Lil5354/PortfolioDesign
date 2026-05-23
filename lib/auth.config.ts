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
  cookies: {
    sessionToken: {
      name: "n",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: "c",
      options: { sameSite: "lax", path: "/" },
    },
    csrfToken: {
      name: "x",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" },
    },
    pkceCodeVerifier: {
      name: "p",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" },
    },
    state: {
      name: "s",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" },
    },
    nonce: {
      name: "o",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" },
    },
  },
  providers: [],
  trustHost: true,
} satisfies NextAuthConfig;
