import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const email = credentials.email as string;
                const password = credentials.password as string;

                // Fetch user from database
                const user = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, email))
                    .limit(1);

                if (!user || user.length === 0) {
                    return null;
                }

                const foundUser = user[0];

                // Lazy-load bcrypt to avoid Edge runtime issues
                const { compare } = await import("bcryptjs");
                const isPasswordValid = await compare(password, foundUser.password);

                if (!isPasswordValid) {
                    return null;
                }

                // Return user object with role
                return {
                    id: foundUser.id,
                    email: foundUser.email,
                    role: foundUser.userRole,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Add role to JWT token when user logs in
            if (user?.id) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            // Add role to session from JWT token
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as "SEEKER" | "EMPLOYER" | "ADMIN";
            }
            return session;
        },
    },
});
