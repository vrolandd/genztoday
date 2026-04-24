import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
      },
      async authorize(credentials, req) {
        const raw = credentials?.username
        if (!raw || typeof raw !== "string") return null
        const username = raw.trim()
        if (!username) return null

        const user = await prisma.dailyUser.findUnique({
          where: { username },
        })

        if (user) return null
        if (!req.headers) return null
        
        const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.headers['cf-connecting-ip'] || '0';

        const newUser = await prisma.dailyUser.create({
          data: {
            username,
            regIpAddress: ip,
          },
        })

        return {
          id: newUser.id,
          name: newUser.username
        }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.name) {
        token.username = user.name
      }

      return token
    },
    async session({ session, token }) {
      if (session.user && token.username) {
        session.user.name = token.username as string
      }

      return session
    },
  },
}
