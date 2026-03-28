import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { skills } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const data = await db.select().from(skills).where(eq(skills.userId, session.user.id));
        return NextResponse.json(data);
    } catch (error) {
        console.error("GET /api/profile/skills error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Bulk replace — send { skills: string[] }
export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await req.json();
        const { skills: skillNames } = body as { skills: unknown };

        // Validate input
        if (!Array.isArray(skillNames)) {
            return NextResponse.json({ error: "skills must be an array" }, { status: 400 });
        }
        if (skillNames.length > 50) {
            return NextResponse.json({ error: "Maximum 50 skills allowed" }, { status: 400 });
        }
        const sanitized = skillNames
            .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
            .map((s) => s.trim().slice(0, 100)); // max 100 chars per skill

        await db.transaction(async (tx) => {
            await tx.delete(skills).where(eq(skills.userId, userId));
            if (sanitized.length > 0) {
                await tx.insert(skills).values(
                    sanitized.map((name: string) => ({ userId, skillName: name }))
                );
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("POST /api/profile/skills error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
