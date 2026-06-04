"use server";

import { db } from "@/lib/db/db";
import { otpTokens } from "@/lib/db/schema";
import { eq, and, gt, desc } from "drizzle-orm";
import { sendOtpSms } from "@/lib/sms/sms";

/**
 * DEV BYPASS: Always returns hardcoded OTP "1234"
 * Original: Math.floor(100000 + Math.random() * 900000).toString()
 */
function generateOtp(): string {
    return "1234";
}

/**
 * Send OTP to a phone number for verification
 */
export async function sendPhoneOtpAction(phone: string) {
    try {
        // Validate phone number (10 digits for Indian numbers)
        const cleanPhone = phone.replace(/\D/g, "");
        if (cleanPhone.length !== 10) {
            return { error: "Please enter a valid 10-digit mobile number" };
        }

        // Rate limiting: max 3 OTPs per phone in 10 minutes
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        const recentOtps = await db
            .select()
            .from(otpTokens)
            .where(
                and(
                    eq(otpTokens.phone, cleanPhone),
                    gt(otpTokens.createdAt, tenMinutesAgo)
                )
            );

        if (recentOtps.length >= 3) {
            return { error: "Too many OTP requests. Please wait 10 minutes before trying again." };
        }

        // Generate OTP
        const otp = generateOtp();

        // Hash OTP with bcrypt
        const { hash } = await import("bcryptjs");
        const hashedOtp = await hash(otp, 10);

        // Delete any existing OTPs for this phone + type
        await db
            .delete(otpTokens)
            .where(
                and(
                    eq(otpTokens.phone, cleanPhone),
                    eq(otpTokens.type, "EMPLOYER_REGISTRATION")
                )
            );

        // Store hashed OTP in database
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await db.insert(otpTokens).values({
            phone: cleanPhone,
            otp: hashedOtp,
            type: "EMPLOYER_REGISTRATION",
            attempts: 0,
            expiresAt,
        });

        // DEV BYPASS: Skip SMS sending, OTP is always 1234
        // const smsResult = await sendOtpSms(cleanPhone, otp);
        // if (!smsResult.success) {
        //     return { error: smsResult.error || "Failed to send OTP. Please try again." };
        // }

        return { success: true };
    } catch (error) {
        console.error("Send OTP error:", error);
        return { error: "Failed to send OTP. Please try again." };
    }
}

/**
 * Verify the OTP entered by the user
 */
export async function verifyPhoneOtpAction(phone: string, otp: string) {
    try {
        const cleanPhone = phone.replace(/\D/g, "");
        if (cleanPhone.length !== 10) {
            return { error: "Invalid phone number" };
        }

        if (!otp || otp.length !== 4) {
            return { error: "Please enter a valid 4-digit OTP" };
        }

        // Find the latest OTP record for this phone
        const otpRecords = await db
            .select()
            .from(otpTokens)
            .where(
                and(
                    eq(otpTokens.phone, cleanPhone),
                    eq(otpTokens.type, "EMPLOYER_REGISTRATION")
                )
            )
            .orderBy(desc(otpTokens.createdAt))
            .limit(1);

        if (otpRecords.length === 0) {
            return { error: "No OTP found. Please request a new OTP." };
        }

        const otpRecord = otpRecords[0];

        // Check if OTP has expired
        if (new Date() > otpRecord.expiresAt) {
            // Clean up expired record
            await db.delete(otpTokens).where(eq(otpTokens.id, otpRecord.id));
            return { error: "OTP has expired. Please request a new OTP." };
        }

        // Check if max attempts exceeded (5 attempts max)
        if (otpRecord.attempts >= 5) {
            await db.delete(otpTokens).where(eq(otpTokens.id, otpRecord.id));
            return { error: "Too many failed attempts. Please request a new OTP." };
        }

        // Verify OTP against hash
        const { compare } = await import("bcryptjs");
        const isValid = await compare(otp, otpRecord.otp);

        if (!isValid) {
            // Increment attempts
            await db
                .update(otpTokens)
                .set({ attempts: otpRecord.attempts + 1 })
                .where(eq(otpTokens.id, otpRecord.id));

            const remaining = 4 - otpRecord.attempts;
            return {
                error: remaining > 0
                    ? `Invalid OTP. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`
                    : "Invalid OTP. Please request a new OTP.",
            };
        }

        // Success — delete the OTP record
        await db.delete(otpTokens).where(eq(otpTokens.id, otpRecord.id));

        return { success: true, verified: true };
    } catch (error) {
        console.error("Verify OTP error:", error);
        return { error: "Verification failed. Please try again." };
    }
}
