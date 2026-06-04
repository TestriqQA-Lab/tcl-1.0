import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db/db";
import { users, seekerProfiles, employerProfiles } from "@/lib/db/schema";
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
                const isPasswordValid = await compare(password, foundUser.password || "");

                if (!isPasswordValid) {
                    return null;
                }

                const isAdminEmail = foundUser.email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();

                // Return user object with role
                return {
                    id: foundUser.id,
                    email: foundUser.email,
                    name: foundUser.username,
                    image: foundUser.profilePicture || null,
                    role: (isAdminEmail ? "ADMIN" : foundUser.userRole) as "SEEKER" | "EMPLOYER" | "ADMIN",
                };
            },
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            // Allow credentials login
            if (account?.provider === "credentials") {
                return true;
            }

            // Handle Google OAuth
            if (account?.provider === "google" && user.email) {
                try {
                    // Check if user exists
                    const existingUsers = await db
                        .select()
                        .from(users)
                        .where(eq(users.email, user.email))
                        .limit(1);

                    if (existingUsers.length > 0) {
                        // User exists - link account if needed
                        const existingUser = existingUsers[0];

                        // Update provider info if coming from different provider
                        if (existingUser.provider === "credentials") {
                            await db
                                .update(users)
                                .set({
                                    provider: "google",
                                    providerAccountId: account.providerAccountId,
                                    profilePicture: user.image || existingUser.profilePicture,
                                    emailVerified: new Date(),
                                })
                                .where(eq(users.id, existingUser.id));
                        }

                        // Return true to allow sign in to complete
                        return true;
                    }

                    // New user - create account
                    // Read role from cookie set by client before OAuth redirect
                    const { cookies } = await import("next/headers");
                    const cookieStore = await cookies();
                    const roleCookie = cookieStore.get("oauth_role");
                    const role = roleCookie?.value || "SEEKER";
                    const isAdminEmail = user.email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();
                    const validRole = isAdminEmail ? "ADMIN" : (["SEEKER", "EMPLOYER"].includes(role) ? role : "SEEKER");

                    // Generate username from email
                    const baseUsername = user.email.split("@")[0];
                    const uniqueSuffix = Math.floor(Math.random() * 10000);
                    const username = `${baseUsername}${uniqueSuffix}`;

                    // Create user and profile in transaction
                    await db.transaction(async (tx) => {
                        const [newUser] = await tx.insert(users).values({
                            email: user.email!,
                            username,
                            userRole: validRole as "SEEKER" | "EMPLOYER" | "ADMIN",
                            provider: "google",
                            providerAccountId: account.providerAccountId,
                            profilePicture: user.image || "",
                            emailVerified: new Date(),
                            password: null,
                            phoneNumber: null,
                            isVerified: true, // Email verified by Google
                            accountStatus: "ACTIVE",
                        }).returning();

                        // Create corresponding profile
                        if (validRole === "SEEKER") {
                            await tx.insert(seekerProfiles).values({
                                userId: newUser.id,
                                fullName: user.name || username,
                                experienceLevel: 0,
                                resumeUrl: "",
                                coverLetter: "",
                            });
                        } else if (validRole === "EMPLOYER") {
                            await tx.insert(employerProfiles).values({
                                userId: newUser.id,
                                fullName: user.name || username,
                                accountType: "COMPANY",
                                hiringFor: "COMPANY",
                                companyName: null,
                                companyLogo: "",
                            });
                        }
                    });

                    return true;
                } catch (error) {
                    console.error("Google sign-in error:", error);
                    return false;
                }
            }

            return true;
        },
        async jwt({ token, user, account, trigger }) {
            // Initial sign in
            if (user) {
                token.id = user.id as string;
                token.role = user.role as "SEEKER" | "EMPLOYER" | "ADMIN";
                token.name = user.name ?? null;
                token.image = user.image ?? null;
            }

            // For Google OAuth, fetch fresh user data from DB
            if (account?.provider === "google" && user?.email) {
                const dbUsers = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, user.email))
                    .limit(1);

                if (dbUsers.length > 0) {
                    const dbUser = dbUsers[0];
                    const isAdminEmail = dbUser.email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();
                    token.id = dbUser.id;
                    token.role = isAdminEmail ? "ADMIN" : dbUser.userRole;
                    // Keep the original Google name if available, otherwise fallback to username
                    token.name = user?.name || dbUser.username;
                    token.image = dbUser.profilePicture || null;
                }
            }

            return token;
        },
        async session({ session, token }) {
            // Add data to session from JWT token
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as "SEEKER" | "EMPLOYER" | "ADMIN";
                session.user.name = (token.name as string) || null;
                session.user.image = token.image as string | null;
            }
            return session;
        },
    },
});
