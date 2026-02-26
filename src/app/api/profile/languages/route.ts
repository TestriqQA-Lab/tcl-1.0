import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { languages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const data = await db.select().from(languages).where(eq(languages.userId, session.user.id));
        return NextResponse.json(data);
    } catch (error) {
        console.error("GET /api/profile/languages error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Bulk replace — send { languages: Array<{ name, proficiency }> }
export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const { languages: langList } = await req.json() as {
            languages: Array<{ name: string; proficiency: 'Speak' | 'Read/Write' | 'Both' }>
        };

        // Map UI proficiency to DB proficiency columns
        function mapProficiency(p: string): "BEGINNER" | "INTERMEDIATE" | "ADVANCED" {
            // Use INTERMEDIATE to represent "active/selected" vs BEGINNER for not selected
            return "INTERMEDIATE";
        }

        await db.transaction(async (tx) => {
            await tx.delete(languages).where(eq(languages.userId, userId));
            if (langList && langList.length > 0) {
                await tx.insert(languages).values(
                    langList.map((lang) => ({
                        userId,
                        languageName: lang.name,
                        speak: (lang.proficiency === 'Speak' || lang.proficiency === 'Both') ? 'INTERMEDIATE' as const : 'BEGINNER' as const,
                        read: (lang.proficiency === 'Read/Write' || lang.proficiency === 'Both') ? 'INTERMEDIATE' as const : 'BEGINNER' as const,
                        write: (lang.proficiency === 'Read/Write' || lang.proficiency === 'Both') ? 'INTERMEDIATE' as const : 'BEGINNER' as const,
                    }))
                );
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("POST /api/profile/languages error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
