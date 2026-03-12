'use server'
import { prisma } from "../prismaClient";

export async function getFaculty() {
    return prisma.faculty.findMany({ orderBy: { name: "asc" } });
}