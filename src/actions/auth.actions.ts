"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

/**
 * Server action to handle user login
 * @param email - User email
 * @param password - User password
 * @returns Success or error object
 */
export async function loginAction(email: string, password: string, expectedRole?: "SEEKER" | "EMPLOYER") {
    try {
        // Validate inputs
        if (!email || !password) {
            return { error: "Email and password are required" };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { error: "Invalid email format" };
        }

        // Role check: verify the user's role matches the expected portal
        if (expectedRole) {
            const { db } = await import("@/lib/db/db");
            const { users } = await import("@/lib/db/schema");
            const { eq } = await import("drizzle-orm");

            const found = await db
                .select({ role: users.userRole })
                .from(users)
                .where(eq(users.email, email.toLowerCase()))
                .limit(1);

            if (found.length === 0) {
                return { error: "Invalid email or password" };
            }

            const userRole = found[0].role;
            if (userRole !== expectedRole) {
                if (expectedRole === "EMPLOYER") {
                    return { error: "This email is registered as a Job Seeker. Please use the Seeker login." };
                } else {
                    return { error: "This email is registered as an Employer. Please use the Employer login." };
                }
            }
        }

        // Call Auth.js signIn with credentials
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        // If we reach here without error, login was successful
        return { success: true };
    } catch (error) {
        // Auth.js throws AuthError for invalid credentials
        if (error instanceof AuthError) {
            return { error: "Invalid email or password" };
        }

        // Generic error for other failures
        console.error("Login error:", error);
        return { error: "Authentication failed. Please try again." };
    }
}

/**
 * Server action to handle user logout
 * @returns Success or error object
 */
export async function logoutAction() {
    try {
        await signOut({ redirect: false });

        // Clear the oauth_role cookie set during Google sign-in flow
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        cookieStore.set("oauth_role", "", { maxAge: 0, path: "/" });

        return { success: true };
    } catch (error) {
        console.error("Logout error:", error);
        return { error: "Logout failed. Please try again." };
    }
}

/**
 * Server action to handle user registration
 * @param name - User name
 * @param email - User email
 * @param password - User password
 * @returns Success or error object
 */
export async function registerAction(
    name: string,
    email: string,
    password: string,
    role: string = "SEEKER",
    mobileNumber?: string,
    currentLocation?: string,
    resumeUrl?: string
) {
    try {
        // Validate inputs
        if (!name || !email) {
            return { error: "Name and email are required" };
        }

        // Password is required for normal registration, but optional for Google auth
        // We will check whether the user exists and is a Google user later


        // Lazy load bcrypt and db dependencies
        const { hash } = await import("bcryptjs");
        const { db } = await import("@/lib/db/db");
        const { users, seekerProfiles, employerProfiles } = await import("@/lib/db/schema");
        const { eq } = await import("drizzle-orm");

        // Check if user already exists
        const existingUsers = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        const existingUser = existingUsers.length > 0 ? existingUsers[0] : null;

        // If user exists and provider is credentials, they cannot register again
        if (existingUser && existingUser.provider === "credentials") {
            return { error: "User already exists with this email" };
        }

        // If user exists and provider is google, this is a Google registration flow
        // We just need to update their profile with the additional details
        if (existingUser && existingUser.provider === "google") {

            // Ensure role is valid
            const validRole = ["SEEKER", "EMPLOYER"].includes(role) ? role : existingUser.userRole;

            await db.transaction(async (tx) => {
                // Update users table with phone number and ensure role is correct
                await tx.update(users)
                    .set({
                        phoneNumber: mobileNumber || existingUser.phoneNumber,
                        userRole: validRole as "SEEKER" | "EMPLOYER",
                    })
                    .where(eq(users.id, existingUser.id));

                // Update or create seeker profile
                if (validRole === "SEEKER") {
                    const existingProfiles = await tx
                        .select()
                        .from(seekerProfiles)
                        .where(eq(seekerProfiles.userId, existingUser.id))
                        .limit(1);

                    if (existingProfiles.length > 0) {
                        await tx.update(seekerProfiles)
                            .set({
                                fullName: name, // Allow user to override Google name
                                currentLocation: currentLocation || existingProfiles[0].currentLocation,
                                resumeUrl: resumeUrl || existingProfiles[0].resumeUrl,
                            })
                            .where(eq(seekerProfiles.userId, existingUser.id));
                    } else {
                        await tx.insert(seekerProfiles).values({
                            userId: existingUser.id,
                            fullName: name,
                            experienceLevel: 0,
                            resumeUrl: resumeUrl || "",
                            coverLetter: "",
                            workStatus: "FRESHER",
                            currentLocation: currentLocation || null,
                        });
                    }
                }
                // (Optional: handle EMPLOYER profile updates here if needed)
            });

            return { success: true };
        }

        // --- Standard Registration Flow (New User) ---

        if (!password) {
            return { error: "Password is required for email registration" };
        }

        // Hash password
        const hashedPassword = await hash(password, 10);

        // Generate basic username from email (temporary strategy)
        const baseUsername = email.split("@")[0];
        const uniqueSuffix = Math.floor(Math.random() * 10000);
        const username = `${baseUsername}${uniqueSuffix}`;

        // Ensure role is valid
        const validRole = ["SEEKER", "EMPLOYER"].includes(role) ? role : "SEEKER";

        // Use transaction to ensure both user and profile are created
        await db.transaction(async (tx) => {
            // 1. Insert new user
            const [newUser] = await tx.insert(users).values({
                email,
                password: hashedPassword,
                username,
                userRole: validRole as "SEEKER" | "EMPLOYER",
                phoneNumber: mobileNumber || null,
                isVerified: false,
                accountStatus: "ACTIVE",
            }).returning();

            // 2. Create corresponding profile based on role
            if (validRole === "SEEKER") {
                await tx.insert(seekerProfiles).values({
                    userId: newUser.id,
                    fullName: name, // Uses full name from registration
                    experienceLevel: 0,
                    resumeUrl: resumeUrl || "",
                    coverLetter: "",
                    workStatus: "FRESHER", // Step 2 onboarding manages this
                    currentLocation: currentLocation || null,
                });
            } else if (validRole === "EMPLOYER") {
                await tx.insert(employerProfiles).values({
                    userId: newUser.id,
                    fullName: name,
                    accountType: "COMPANY",
                    hiringFor: "COMPANY",
                    companyName: null,
                    companyLogo: "",
                });
            }
        });

        // Return success
        return { success: true };

    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Registration failed. Please try again." };
    }
}
