import { prisma } from "@/lib/prismaClient";
import { NextResponse } from "next/server";

export async function GET() {
    const data = await prisma.department.findMany({
        select: {
            id: true,
            name: true,
        },
    });

    return NextResponse.json(data);
}