"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

/**
 * Server action to handle user login
 * @param email - User email
 * @param password - User password
 * @returns Success or error object
 */
export async function loginAction(email: string, password: string) {
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
    workStatus?: "EXPERIENCED" | "FRESHER",
    resumeUrl?: string
) {
    try {
        // Validate inputs
        if (!name || !email || !password) {
            return { error: "All fields are required" };
        }

        // Lazy load bcrypt and db dependencies
        const { hash } = await import("bcryptjs");
        const { db } = await import("@/lib/db/db");
        const { users, seekerProfiles, employerProfiles } = await import("@/lib/db/schema");
        const { eq } = await import("drizzle-orm");

        // Check if user already exists
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (existingUser.length > 0) {
            return { error: "User already exists with this email" };
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
                    workStatus: workStatus || "FRESHER", // Mapping to new field in schema
                });
            } else if (validRole === "EMPLOYER") {
                await tx.insert(employerProfiles).values({
                    userId: newUser.id,
                    companyName: name, // Use registered name as initial company name
                    companyDescription: "Pending description",
                    companyWebsite: "https://example.com",
                    companySize: 1,
                    companyIndustry: "General",
                    companyLocation: "Remote",
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
