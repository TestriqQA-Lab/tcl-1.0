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
export async function registerAction(name: string, email: string, password: string, role: string = "SEEKER") {
    try {
        // Validate inputs
        if (!name || !email || !password) {
            return { error: "All fields are required" };
        }

        // Lazy load bcrypt and db dependencies
        const { hash } = await import("bcryptjs");
        const { db } = await import("@/lib/db/db");
        const { users } = await import("@/lib/db/schema");
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

        // Insert new user
        // Note: Providing '0000000000' for phoneNumber as it's required by schema but not in form
        // Note: Default role is SEEKER unless specified
        await db.insert(users).values({
            email,
            password: hashedPassword,
            username,
            userRole: validRole as "SEEKER" | "EMPLOYER",
            phoneNumber: "0000000000", // Placeholder
            isVerified: false,
            accountStatus: "ACTIVE",
        });

        // Optional: Automatically sign in after registration? 
        // For now, return success so UI can redirect to login or show success message.
        return { success: true };

    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Registration failed. Please try again." };
    }
}
