import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { experience } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// Helper to parse "Month Year" into an ISO date string
function parseMonthYear(month: string, year: string): Date {
    const monthMap: Record<string, number> = {
        January: 0, February: 1, March: 2, April: 3,
        May: 4, June: 5, July: 6, August: 7,
        September: 8, October: 9, November: 10, December: 11,
    };
    const m = monthMap[month] || 0;
    return new Date(parseInt(year), m, 1);
}

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const data = await db.select().from(experience).where(eq(experience.userId, session.user.id));
        return NextResponse.json(data);
    } catch (error) {
        console.error("GET /api/profile/experience error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await req.json();

        const [inserted] = await db.insert(experience).values({
            userId,
            companyName: body.companyName || "",
            designation: body.designation || body.role || "",
            employmentType: body.employmentType || "FULL_TIME",
            startDate: body.startMonth && body.startYear ? parseMonthYear(body.startMonth, body.startYear) : new Date(),
            endDate: (!body.isCurrent && body.endMonth && body.endYear) ? parseMonthYear(body.endMonth, body.endYear) : null,
            isCurrent: body.isCurrent || false,
            description: body.description || null,
            keySkills: body.keySkills || null,
            projectUrl: body.projectUrl || null,
        }).returning();

        return NextResponse.json(inserted);
    } catch (error) {
        console.error("POST /api/profile/experience error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

        const [updated] = await db.update(experience)
            .set({
                companyName: updateData.companyName,
                designation: updateData.designation || updateData.role,
                employmentType: updateData.employmentType,
                startDate: updateData.startMonth && updateData.startYear ? parseMonthYear(updateData.startMonth, updateData.startYear) : new Date(),
                endDate: (!updateData.isCurrent && updateData.endMonth && updateData.endYear) ? parseMonthYear(updateData.endMonth, updateData.endYear) : null,
                isCurrent: updateData.isCurrent !== undefined ? updateData.isCurrent : false,
                description: updateData.description,
                keySkills: updateData.keySkills,
                projectUrl: updateData.projectUrl,
                updatedAt: new Date(),
            })
            .where(and(eq(experience.id, id), eq(experience.userId, userId)))
            .returning();

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/profile/experience error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

        await db.delete(experience).where(and(eq(experience.id, id), eq(experience.userId, userId)));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/profile/experience error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
