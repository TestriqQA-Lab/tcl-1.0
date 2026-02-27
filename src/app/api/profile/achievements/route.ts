import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { achievements } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type"); // Optional filter

        let query = db.select().from(achievements).where(eq(achievements.userId, session.user.id));

        // Note: Drizzle doesn't support conditional where chains easily; fetch all and filter in-memory if type given
        const data = await db.select().from(achievements).where(eq(achievements.userId, session.user.id));
        const filtered = type ? data.filter(a => a.type === type) : data;

        return NextResponse.json(filtered);
    } catch (error) {
        console.error("GET /api/profile/achievements error:", error);
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

        const [inserted] = await db.insert(achievements).values({
            userId,
            type: body.type || "AWARD",
            title: body.title || body.name || body.examName || body.clubName || "Achievement",
            organization: body.organization || body.position || body.educationId || null,
            description: body.description || null,
            url: body.url || null,
            completionId: body.completionId || null,
            score: body.score || null,
            totalScore: body.totalScore || null,
            startMonth: body.startMonth || null,
            startYear: body.startYear || null,
            endMonth: body.endMonth || null,
            endYear: body.endYear || null,
            date: body.year || body.startYear || null,
            isCurrent: body.isCurrent || false,
            doesNotExpire: body.doesNotExpire || false,
            achievementsList: body.achievements || [],
        }).returning();

        return NextResponse.json(inserted);
    } catch (error) {
        console.error("POST /api/profile/achievements error:", error);
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

        const [updated] = await db.update(achievements)
            .set({
                title: updateData.title || updateData.name || updateData.examName || updateData.clubName,
                organization: updateData.organization || updateData.position || updateData.educationId || null,
                description: updateData.description || null,
                url: updateData.url || null,
                completionId: updateData.completionId || null,
                score: updateData.score || null,
                totalScore: updateData.totalScore || null,
                startMonth: updateData.startMonth || null,
                startYear: updateData.startYear || null,
                endMonth: updateData.endMonth || null,
                endYear: updateData.endYear || null,
                date: updateData.year || updateData.startYear || null,
                isCurrent: updateData.isCurrent !== undefined ? updateData.isCurrent : false,
                doesNotExpire: updateData.doesNotExpire !== undefined ? updateData.doesNotExpire : false,
                achievementsList: updateData.achievements || [],
                updatedAt: new Date(),
            })
            .where(and(eq(achievements.id, id), eq(achievements.userId, userId)))
            .returning();

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/profile/achievements error:", error);
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

        await db.delete(achievements).where(and(eq(achievements.id, id), eq(achievements.userId, userId)));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/profile/achievements error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
