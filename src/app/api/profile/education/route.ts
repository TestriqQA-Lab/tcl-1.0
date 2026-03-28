import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { education } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const data = await db.select().from(education).where(eq(education.userId, session.user.id));
        return NextResponse.json(data);
    } catch (error) {
        console.error("GET /api/profile/education error:", error);
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

        const [inserted] = await db.insert(education).values({
            userId,
            type: body.type || "",
            board: body.board || null,
            medium: body.medium || null,
            percentage: body.percentage || null,
            startDate: body.passingYear ? new Date(parseInt(body.passingYear) - 4, 0, 1) : null,
            endDate: body.passingYear || body.endingYear ? new Date(parseInt(body.passingYear || body.endingYear), 0, 1) : null,
            isPursuing: body.isPursuing || false,
            institute: body.institute || null,
            degree: body.degree || null,
            stream: body.stream || null,
        }).returning();

        return NextResponse.json(inserted);
    } catch (error) {
        console.error("POST /api/profile/education error:", error);
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

        const [updated] = await db.update(education)
            .set({
                type: updateData.type || "",
                board: updateData.board || null,
                medium: updateData.medium || null,
                percentage: updateData.percentage || null,
                startDate: updateData.passingYear ? new Date(parseInt(updateData.passingYear) - 4, 0, 1) : null,
                endDate: updateData.passingYear || updateData.endingYear ? new Date(parseInt(updateData.passingYear || updateData.endingYear), 0, 1) : null,
                isPursuing: updateData.isPursuing !== undefined ? updateData.isPursuing : false,
                institute: updateData.institute || null,
                degree: updateData.degree || null,
                stream: updateData.stream || null,
                updatedAt: new Date(),
            })
            .where(and(eq(education.id, id), eq(education.userId, userId)))
            .returning();

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/profile/education error:", error);
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

        await db.delete(education).where(and(eq(education.id, id), eq(education.userId, userId)));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/profile/education error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
