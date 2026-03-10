// src/auth.ts
import NextAuth from "next-auth";
//import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    // GitHub,
    Google,
    Credentials({
      name: "Demo",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email === "demo@energai.com" && credentials?.password === "demo123") {
          return { 
            id: "65f0a1b2c3d4e5f600000000", 
            name: "Usuario Demo", 
            email: "demo@energai.com",
            image: "https://api.dicebear.com/7.x/avataaars/png?seed=Felix"
          };
        }
        return null;
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});