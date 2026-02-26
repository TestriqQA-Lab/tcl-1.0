import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

function parseMonthYear(month: string, year: string): string | null {
    if (!month || !year) return null;
    const monthMap: Record<string, string> = {
        January: "01", February: "02", March: "03", April: "04",
        May: "05", June: "06", July: "07", August: "08",
        September: "09", October: "10", November: "11", December: "12",
    };
    const m = monthMap[month] || "01";
    return `${year}-${m}-01`;
}

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const data = await db.select().from(projects).where(eq(projects.userId, session.user.id));
        return NextResponse.json(data);
    } catch (error) {
        console.error("GET /api/profile/projects error:", error);
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

        const technologies = body.keySkills
            ? body.keySkills.split(",").map((s: string) => s.trim()).filter(Boolean)
            : [];

        const [inserted] = await db.insert(projects).values({
            userId,
            title: body.title || "",
            description: body.description || "",
            technologies,
            url: body.projectUrl || null,
            startMonth: body.startMonth || null,
            startYear: body.startYear || null,
            endMonth: body.endMonth || null,
            endYear: body.endYear || null,
        }).returning();

        return NextResponse.json(inserted);
    } catch (error) {
        console.error("POST /api/profile/projects error:", error);
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

        const technologies = updateData.keySkills
            ? updateData.keySkills.split(",").map((s: string) => s.trim()).filter(Boolean)
            : [];

        const [updated] = await db.update(projects)
            .set({
                title: updateData.title,
                description: updateData.description,
                technologies,
                url: updateData.projectUrl || null,
                startMonth: updateData.startMonth || null,
                startYear: updateData.startYear || null,
                endMonth: updateData.endMonth || null,
                endYear: updateData.endYear || null,
                updatedAt: new Date(),
            })
            .where(and(eq(projects.id, id), eq(projects.userId, userId)))
            .returning();

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/profile/projects error:", error);
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

        await db.delete(projects).where(and(eq(projects.id, id), eq(projects.userId, userId)));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/profile/projects error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
