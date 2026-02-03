"use server";

import { prisma } from "@/lib/prismaClient";

/* ---------- Degree ---------- */
export async function createDegree(name: string) {
    return prisma.degree.create({ data: { name } });
}

export async function getDegreees() {
    return prisma.degree.findMany({
        include: { departments: true },
        orderBy: { name: "asc" },
    });
}

/* ---------- Department ---------- */
export async function createDepartment(
    name: string,
    degreeId: string
) {
    return prisma.department.create({
        data: { name, degreeId },
    });
}

/* ---------- Subject ---------- */
export async function createSubject(
    name: string,
    departmentIds: string[],
    semester: number, // mandatory
) {
    return prisma.subject.create({
        data: {
            name,
            semester,
            departments: {
                create: departmentIds.map((id) => ({
                    departmentId: id,
                })),
            },
        },
    });
}


export async function getSubjects() {
    return prisma.subject.findMany({
        include: {
            departments: { include: { department: true } },
        },
        orderBy: [{ semester: "asc" }, { name: "asc" }],
    });
}