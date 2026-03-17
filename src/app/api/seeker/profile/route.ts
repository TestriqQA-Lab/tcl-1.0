import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { seekerProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const profile = await db.query.seekerProfiles.findFirst({
            where: eq(seekerProfiles.userId, session.user.id),
            columns: {
                resumeUrl: true,
            },
        });

        if (!profile) {
            return NextResponse.json({ resumeUrl: null });
        }

        return NextResponse.json({ resumeUrl: profile.resumeUrl || null });
    } catch (error) {
        console.error("Error fetching seeker profile:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
