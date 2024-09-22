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
                            },
                        });
                    }
                } catch (error) {
                    console.error("Error checking or creating user: ", error);
                    return false; // Stop sign-in process in case of error
                }
            }

            return true; // Always return true unless you have a condition to block sign-in
        },
    }
})