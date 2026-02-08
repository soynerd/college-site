import { prisma } from "@/lib/prismaClient";
import { NextResponse } from "next/server";


export async function GET() {
    const departments = await prisma.department.findMany({
        select: { name: true },
    });

    const unique = Array.from(new Set(departments.map(d => d.name)));

    return NextResponse.json(unique);
}
