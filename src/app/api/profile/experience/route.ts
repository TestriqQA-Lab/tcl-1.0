import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { experience } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// Helper to parse "Month Year" into an ISO date string
function parseMonthYear(month: string, year: string): string {
    const monthMap: Record<string, string> = {
        January: "01", February: "02", March: "03", April: "04",
        May: "05", June: "06", July: "07", August: "08",
        September: "09", October: "10", November: "11", December: "12",
    };
    const m = monthMap[month] || "01";
    return `${year}-${m}-01`;
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
            startMonth: body.startMonth || "",
            startYear: body.startYear || "",
            endMonth: body.isCurrent ? null : body.endMonth,
            endYear: body.isCurrent ? null : body.endYear,
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
                startMonth: updateData.startMonth,
                startYear: updateData.startYear,
                endMonth: updateData.isCurrent ? null : updateData.endMonth,
                endYear: updateData.isCurrent ? null : updateData.endYear,
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
