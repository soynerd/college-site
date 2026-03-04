import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");

        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            where: {
                totalReviewsLeft: { lt: 6 },
            },
        });

        for (const user of users) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    totalReviewsLeft: {
                        increment: 1,
                    },
                },
            });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}