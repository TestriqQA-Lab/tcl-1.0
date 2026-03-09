"use server";

import { db } from "@/lib/db/db";
import { users, employerProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";

type CompanySize = "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1000+";
type AccountType = "COMPANY" | "INDIVIDUAL";
type HiringFor = "COMPANY" | "CONSULTANCY";

interface RegisterEmployerInput {
    // Step 1 (OTP)
    phone: string;
    // Step 2 (Basic Details)
    fullName: string;
    email: string;
    password: string;
    accountType: "company" | "individual";
    // Step 3 (Company Details)
    hiringFor: "company" | "consultancy";
    companyName: string;
    companyIndustry: string;
    companySize: string;
    designation: string;
    pincode: string;
    companyAddress: string;
}

export async function registerEmployerAction(input: RegisterEmployerInput) {
    try {
        const {
            phone, fullName, email, password, accountType,
            hiringFor, companyName, companyIndustry, companySize,
            designation, pincode, companyAddress,
        } = input;

        // --- Validation ---
        if (!fullName.trim()) return { error: "Full name is required." };
        if (!email.trim()) return { error: "Email is required." };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return { error: "Invalid email format." };
        if (!password || password.length < 6) return { error: "Password must be at least 6 characters." };
        if (!companyName.trim()) return { error: "Company name is required." };
        if (!designation.trim()) return { error: "Designation is required." };

        // --- Duplicate check ---
        const existing = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, email.toLowerCase()))
            .limit(1);

        if (existing.length > 0) {
            return { error: "An account with this email already exists. Please log in instead." };
        }

        // --- Hash password ---
        const hashedPassword = await hash(password, 10);

        // --- Generate username ---
        const baseUsername = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
        const uniqueSuffix = Math.floor(Math.random() * 100000);
        const username = `${baseUsername}${uniqueSuffix}`;

        // --- Map form values to DB enum values ---
        const dbAccountType: AccountType = accountType === "individual" ? "INDIVIDUAL" : "COMPANY";
        const dbHiringFor: HiringFor = hiringFor === "consultancy" ? "CONSULTANCY" : "COMPANY";

        // Map company size — form values match enum exactly except last option
        const sizeMap: Record<string, CompanySize> = {
            "1-10": "1-10",
            "11-50": "11-50",
            "51-200": "51-200",
            "201-500": "201-500",
            "501-1000": "501-1000",
            "1000+": "1000+",
            "1001+": "1000+", // fallback if old form value used
        };
        const dbCompanySize: CompanySize | undefined = companySize ? (sizeMap[companySize] ?? undefined) : undefined;

        // --- Transaction: create user + employer profile ---
        await db.transaction(async (tx) => {
            const [newUser] = await tx
                .insert(users)
                .values({
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    username,
                    userRole: "EMPLOYER",
                    phoneNumber: phone || null,
                    isVerified: false,
                    isPhoneVerified: false,
                    accountStatus: "ACTIVE",
                    termsAccepted: true,
                    consentShared: false,
                })
                .returning({ id: users.id });

            await tx.insert(employerProfiles).values({
                userId: newUser.id,
                accountType: dbAccountType,
                hiringFor: dbHiringFor,
                fullName: fullName.trim(),
                designation: designation.trim() || null,
                pincode: pincode.trim() || null,
                companyAddress: companyAddress.trim() || null,
                companyName: companyName.trim() || null,
                companyIndustry: companyIndustry || null,
                companySize: dbCompanySize ?? null,
                companyLogo: "",
            });
        });

        return { success: true };
    } catch (error) {
        console.error("Employer registration error:", error);
        return { error: "Registration failed. Please try again." };
    }
}

/**
 * Fetches the employer profile for a given user ID.
 * Used by the dashboard sidebar to display company name.
 */
export async function getEmployerProfile(userId: string) {
    try {
        const profile = await db
            .select({
                companyName: employerProfiles.companyName,
                fullName: employerProfiles.fullName,
                companyLogo: employerProfiles.companyLogo,
            })
            .from(employerProfiles)
            .where(eq(employerProfiles.userId, userId))
            .limit(1);

        if (profile.length === 0) return { companyName: null, fullName: null, companyLogo: null };
        return profile[0];
    } catch (error) {
        console.error("Failed to fetch employer profile:", error);
        return { companyName: null, fullName: null, companyLogo: null };
    }
}

