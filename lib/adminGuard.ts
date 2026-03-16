import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    if (!session.user.isAdmin) redirect("/unauthorized");

}
