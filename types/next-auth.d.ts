import type { DefaultSession } from "next-auth"

import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      name: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string
  }
}
