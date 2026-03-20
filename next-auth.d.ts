import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: number,
            username: string,
            semester: string,
            isAdmin: boolean
        } & DefaultSession["user"]
    }
} 