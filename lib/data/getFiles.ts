"use server"
import { prisma } from "@/lib/prismaClient";

export const getFiles = async (subjectId: string) => {
    return prisma.file.findMany({ where: { subjectId } });
}