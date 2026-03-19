import { prisma } from "@/lib/prismaClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId, subjectIds } = await req.json();

    await prisma.userSubject.deleteMany({
        where: { userId },
    });

    const data = subjectIds.map((id: string) => ({
        userId,
        subjectId: id,
    }));

    await prisma.userSubject.createMany({ data });

    return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get("userId"));

    const subjects = await prisma.userSubject.findMany({
        where: { userId },
        include: {
            subject: {
                include: { files: true },
            },
        },
    });

    return NextResponse.json(subjects);
}