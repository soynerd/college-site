import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";

export async function GET() {
    const faculty = await prisma.faculty.findMany({
        orderBy: { id: "desc" },
    });

    return NextResponse.json(faculty);
}
