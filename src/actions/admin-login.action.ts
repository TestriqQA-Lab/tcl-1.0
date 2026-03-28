"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

/**
 * Server action exclusively for admin login.
 * Rejects any email that doesn't match ADMIN_EMAIL.
 */
export async function adminLoginAction(email: string, password: string) {
    try {
        if (!email || !password) {
            return { error: "Email and password are required." };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { error: "Invalid email format." };
        }

        // Only allow the configured admin email
        const adminEmail = process.env.ADMIN_EMAIL;
        if (!adminEmail || email.toLowerCase() !== adminEmail.toLowerCase()) {
            return { error: "Access denied. This login is restricted to administrators only." };
        }

        // Verify user exists and is in the DB
        const { db } = await import("@/lib/db/db");
        const { users } = await import("@/lib/db/schema");
        const { eq } = await import("drizzle-orm");

        const found = await db
            .select({ id: users.id, role: users.userRole })
            .from(users)
            .where(eq(users.email, email.toLowerCase()))
            .limit(1);

        if (found.length === 0) {
            return { error: "Invalid credentials." };
        }

        // Authenticate via NextAuth credentials
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "Invalid email or password." };
        }
        console.error("Admin login error:", error);
        return { error: "Authentication failed. Please try again." };
    }
}
