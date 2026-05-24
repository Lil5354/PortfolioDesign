import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

async function validateAvatarUrl(url: string): Promise<string | null> {
  try {
    if (url.startsWith('data:')) {
      return null;
    }
    
    const urlObj = new URL(url);
    if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
      return null;
    }
    
    const dangerousPatterns = [
      /\/\/(54KB|base64|data:image|data:application)/i,
      /base64/gi,
      /^data:/i,
    ];
    for (const pattern of dangerousPatterns) {
      if (pattern.test(url)) {
        return null;
      }
    }
    
    return url;
  } catch {
    return null;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.isActive) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          image: user.avatarUrl,
          role: user.role,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        const existing = await prisma.user.findUnique({ where: { email: user.email } });
        if (existing) {
          if (user.image && user.image !== existing.avatarUrl) {
            const validatedUrl = await validateAvatarUrl(user.image);
            if (!validatedUrl) {
              console.warn("Invalid avatar URL for Google OAuth:", user.image);
              return false;
            }
            await prisma.user.update({ where: { email: user.email }, data: { avatarUrl: validatedUrl } });
          }
        } else {
          const validatedUrl = await validateAvatarUrl(user.image || "");
          await prisma.user.create({
            data: {
              email: user.email,
              passwordHash: "",
              fullName: user.name || "",
              avatarUrl: validatedUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.name?.toLowerCase(),
              role: "student",
              isActive: true,
            },
          });
        }
        return true;
      }
      return true;
    },
    async jwt({ token }) {
      // Validate JWT payload size to prevent 494 REQUEST_HEADER_TOO_LARGE
      const jwtPayload = {
        id: token.id,
        role: token.role,
        isActive: token.isActive,
      };
      const jwtString = btoa(JSON.stringify(jwtPayload));
      if (jwtString.length > 4096) {
        console.error("JWT payload too large:", jwtString.length);
        return { id: "", role: "", isActive: false };
      }

      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true, isActive: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.isActive = dbUser.isActive;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token as any)?.id || session.user.id;
        session.user.role = (token as any)?.role || session.user.role;
        session.user.name = token.name || session.user.name;
        session.user.image = token.picture || session.user.image;
        if (token.email) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: token.email },
              select: { fullName: true, avatarUrl: true },
            });
            if (dbUser) {
              session.user.name = dbUser.fullName;
              session.user.image = dbUser.avatarUrl;
            }
          } catch {}
        }
      }
      return session;
    },
  },
});
