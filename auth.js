import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import prisma from './lib/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account.provider === "google") {
                try {
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email },
                    });

                    // Create user if they don't exist in your database
                    if (!existingUser) {
                        await prisma.user.create({
                            data: {
                                name: user.name,
                                email: user.email,
                                image: user.image,
                            },
                        });
                    }
                } catch (error) {
                    console.error("Error checking or creating user: ", error);
                    return false;
                }
            }
            return true;
        },
        async session({ session, token }) {
            const dbUser = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: { id: true }
            });

            if (dbUser) {
                session.user.id = dbUser.id;
            }

            return session;
        },
        async jwt({ token, user, account, profile }) {
            if (user) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email },
                    select: { id: true }
                });
                if (dbUser) {
                    token.userId = dbUser.id;
                }
            }
            return token;
        }
    }
})