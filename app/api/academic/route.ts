import { prisma } from "@/lib/prismaClient";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const degreeId = searchParams.get("degreeId");
    const departmentId = searchParams.get("departmentId");

    // 1. Get all degrees
    if (!degreeId && !departmentId) {
        const degrees = await prisma.degree.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        });
        return NextResponse.json({ degrees });
    }

    // 2. Get departments of a degree
    if (degreeId && !departmentId) {
        const departments = await prisma.department.findMany({
            where: { degreeId },
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        });
        return NextResponse.json({ departments });
    }

    // 3. Get subjects of a department
    if (departmentId) {
        const subjects = await prisma.subject.findMany({
            where: {
                departments: {
                    some: {
                        departmentId,
                    },
                },
            },
            select: {
                id: true,
                name: true,
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json({ subjects });
    }
}