"use server"
import { cache } from "react";
import { prisma } from "@/lib/prismaClient";


export const getSubjects = cache(async (degree: string, department: string, semester: number) => {

    const subjects = await prisma.subject.findMany({
        where: {
            semester: semester,
            departments: {
                some: {
                    department: {
                        name: department,
                        degree: {
                            name: degree,
                        },
                    },
                },
            },
        },
        include: {
            departments: {
                include: {
                    department: {
                        include: {
                            degree: true,
                        },
                    },
                },
            },
            files: true,
        },
    });
    return { subjects }

})