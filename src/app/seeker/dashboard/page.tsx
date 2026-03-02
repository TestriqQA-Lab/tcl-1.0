// Server Component - fetches session, handles redirect, passes data to client
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserDashboardClient } from "./UserDashboardClient";

export default async function UserDashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    return (
        <UserDashboardClient
            userId={session.user.id!}
            userName={session.user.name ?? null}
            userImage={session.user.image ?? null}
        />
    );
}
