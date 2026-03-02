import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { users, passwordResetTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { token, password } = body;

        if (!token || typeof token !== "string") {
            return NextResponse.json({ error: "Token is required" }, { status: 400 });
        }

        if (!password || typeof password !== "string" || password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // Look up the token
        const tokenRecords = await db
            .select()
            .from(passwordResetTokens)
            .where(eq(passwordResetTokens.token, token))
            .limit(1);

        if (tokenRecords.length === 0) {
            return NextResponse.json(
                { error: "Invalid or expired reset link. Please request a new one." },
                { status: 400 }
            );
        }

        const tokenRecord = tokenRecords[0];

        // Check expiry
        if (new Date() > tokenRecord.expiresAt) {
            // Clean up expired token
            await db
                .delete(passwordResetTokens)
                .where(eq(passwordResetTokens.id, tokenRecord.id));

            return NextResponse.json(
                { error: "This reset link has expired. Please request a new one." },
                { status: 400 }
            );
        }

        // Hash the new password
        const { hash } = await import("bcryptjs");
        const hashedPassword = await hash(password, 10);

        // Update the user's password
        await db
            .update(users)
            .set({
                password: hashedPassword,
                updatedAt: new Date(),
            })
            .where(eq(users.id, tokenRecord.userId));

        // Invalidate the token (single use)
        await db
            .delete(passwordResetTokens)
            .where(eq(passwordResetTokens.id, tokenRecord.id));

        return NextResponse.json({ message: "Password has been reset successfully." });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
