import { prisma } from "@/lib/prismaClient";

export async function getSubjectsByDepartment(departmentId: string) {
    return prisma.subject.findMany({
        where: {
            departments: {
                some: {
                    departmentId,
                },
            },
        },
        orderBy: {
            name: "asc",
        },
    });
}
