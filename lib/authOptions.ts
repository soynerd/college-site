import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prismaClient";



export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        })
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (profile) {
                const name = profile.name || profile.email?.split('@')[0] || 'Nerd';
                const email = profile.email || '';
                const image = profile.image || '';
                const provider = account?.provider || '';
                let user = await prisma.user.findUnique({ where: { email } });
                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            name,
                            username: email?.split('@')[0],
                            email,
                            image,
                            provider,
                            lastLoginAt: new Date()
                        }
                    })
                    return true;
                } else {
                    await prisma.user.update({
                        where: { email },
                        data: {
                            lastLoginAt: new Date()
                        }
                    });
                    return true;
                }
            }

            return false
        },
        async jwt({ token, profile }) {
            if (!profile?.email) return token;

            const dbUser = await prisma.user.findUnique({
                select: { id: true, email: true, username: true, image: true, semester: true, role: true },
                where: { email: profile.email },
            });

            if (!dbUser) return token; // safety

            token.id = dbUser.id;
            token.email = dbUser.email;
            token.username = dbUser.username;
            token.image = dbUser.image;
            token.semester = dbUser.semester ?? "Sem -1";
            token.isAdmin = (dbUser.role == "Admin") ? true : false


            return token;
        },

        async session({ session, token, user }) {
            if (session.user) {
                session.user.id = token.id as number;
                session.user.email = token.email as string;
                session.user.username = token.username as string;
                session.user.image = token.image as string;
                session.user.semester = token.semester as string;
                session.user.isAdmin = token.isAdmin as boolean;
            }
            return session;
        }

    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days

    },
    pages: {
        signIn: '/login'
    },
    secret: process.env.NEXTAUTH_SECRET,
}