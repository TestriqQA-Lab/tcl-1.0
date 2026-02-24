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
        const { skills: skillNames } = await req.json() as { skills: string[] };

        await db.transaction(async (tx) => {
            await tx.delete(skills).where(eq(skills.userId, userId));
            if (skillNames && skillNames.length > 0) {
                await tx.insert(skills).values(
                    skillNames.map((name: string) => ({ userId, skillName: name }))
                );
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("POST /api/profile/skills error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
