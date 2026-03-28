import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { users, passwordResetTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { sendPasswordResetEmail } from "@/lib/email/mailer";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email || typeof email !== "string") {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Always return 200 to avoid user enumeration
        const existingUsers = await db
            .select()
            .from(users)
            .where(eq(users.email, email.toLowerCase().trim()))
            .limit(1);

        if (existingUsers.length === 0) {
            // Don't reveal whether account exists
            return NextResponse.json({
                message: "If an account with that email exists, a reset link has been sent.",
            });
        }

        const user = existingUsers[0];

        // Generate a secure token
        const token = randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        // Delete any existing token for this user, then insert a fresh one
        await db
            .delete(passwordResetTokens)
            .where(eq(passwordResetTokens.userId, user.id));

        await db.insert(passwordResetTokens).values({
            userId: user.id,
            token,
            expiresAt,
        });

        // Build the reset URL
        const appUrl = process.env.APP_URL || "http://localhost:3000";
        const resetUrl = `${appUrl}/reset-password/${token}`;

        // Send the email
        await sendPasswordResetEmail(user.email, resetUrl);

        return NextResponse.json({
            message: "If an account with that email exists, a reset link has been sent.",
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
