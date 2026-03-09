import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { seekerProfiles, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

import { appendFileSync } from "fs";

export async function GET() {
    try {
        const session = await auth();
        const logData = `[${new Date().toISOString()}] GET /api/profile - Session User ID: ${session?.user?.id}\n`;
        appendFileSync("C:\\Users\\user1\\Documents\\GitHub\\tcl-1.0\\api-debug.log", logData);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        console.log("GET /api/profile - Querying for userId:", userId);

        // Fetch user — explicitly omit sensitive fields (password, providerAccountId)
        const userResult = await db
            .select({
                id: users.id,
                email: users.email,
                username: users.username,
                phoneNumber: users.phoneNumber,
                profilePicture: users.profilePicture,
                userRole: users.userRole,
                provider: users.provider,
                emailVerified: users.emailVerified,
                isVerified: users.isVerified,
                accountStatus: users.accountStatus,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt,
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        const user = userResult[0];
        console.log("GET /api/profile - User found:", !!user);

        const [profile] = await db.select().from(seekerProfiles).where(eq(seekerProfiles.userId, userId)).limit(1);
        console.log("GET /api/profile - Profile found:", !!profile);

        if (!user) {
            console.log("GET /api/profile - Returning 404");
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user, profile: profile || null });
    } catch (error) {
        console.error("GET /api/profile error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth();
        console.log("PATCH /api/profile - Session User ID:", session?.user?.id);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await req.json();
        console.log("PATCH /api/profile - Body:", JSON.stringify(body, null, 2));

        // Separate user fields from profile fields
        const userFields: Partial<typeof users.$inferInsert> = {};
        const profileFields: Partial<typeof seekerProfiles.$inferInsert> = {};

        const userAllowedFields = ["phoneNumber", "profilePicture"] as const;
        const profileAllowedFields = [
            "fullName", "gender", "dateOfBirth", "currentLocation",
            "preferredWorkLocation", "nationality", "willingToRelocate",
            "workStatus", "lookingFor", "currentEmploymentStatus", "noticePeriod",
            "preferredWorkType", "preferredWorkMode", "totalExperienceYears",
            "totalExperienceMonths", "currentIndustry", "currentDepartment",
            "currentRoleCategory", "currentJobRole", "currentSalary",
            "bio", "careerGoals", "resumeUrl", "coverLetter", "portfolioUrl",
            "githubUrl", "linkedinUrl", "otherLinks", "expectedSalaryMin",
            "expectedSalaryMax", "preferredIndustry", "preferredCompanyType",
            "shiftPreference",
        ] as const;

        for (const key of userAllowedFields) {
            if (key in body) (userFields as Record<string, unknown>)[key] = body[key];
        }
        for (const key of profileAllowedFields) {
            if (key in body) (profileFields as Record<string, unknown>)[key] = body[key];
        }

        await db.transaction(async (tx) => {
            if (Object.keys(userFields).length > 0) {
                await tx.update(users)
                    .set({ ...userFields, updatedAt: new Date() })
                    .where(eq(users.id, userId));
            }
            if (Object.keys(profileFields).length > 0) {
                // Check if profile exists
                const existing = await tx.select({ id: seekerProfiles.id })
                    .from(seekerProfiles)
                    .where(eq(seekerProfiles.userId, userId))
                    .limit(1);

                if (existing.length > 0) {
                    await tx.update(seekerProfiles)
                        .set({ ...profileFields, updatedAt: new Date() })
                        .where(eq(seekerProfiles.userId, userId));
                } else {
                    await tx.insert(seekerProfiles).values({
                        userId,
                        fullName: (profileFields as any).fullName || "",
                        experienceLevel: 0,
                        resumeUrl: (profileFields as any).resumeUrl || "",
                        coverLetter: (profileFields as any).coverLetter || "",
                        ...profileFields,
                    });
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PATCH /api/profile error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
