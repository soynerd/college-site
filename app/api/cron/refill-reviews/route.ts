import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        console.log("Auth Header:", authHeader); // Debugging line
        console.log("Expected Header:", `Bearer ${process.env.CRON_SECRET}`); // Debugging line
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const temp = await prisma.user.findMany({
            select: {
                email: true,
            },
            where: {
                totalReviewsLeft: { lt: 6 },
            },
        });
        console.log(temp)

        await prisma.user.updateMany({
            where: {
                totalReviewsLeft: { lt: 6 },
            },
            data: {
                totalReviewsLeft: 6,
            },
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}