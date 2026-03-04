import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";

export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        await prisma.chatAnalytics.create({
            data: {
                degree: body.degree,
                department: body.department,
                semester: body.semester,
                subject: body.subject,
                types: body.types,
                clarified: body.clarified,
            },
        });

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}