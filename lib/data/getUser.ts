"use server"
import { cache } from "react";
import { prisma } from "@/lib/prismaClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"


export const getUser = cache(async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;
    return prisma.user.findUnique({ where: { email: session.user.email } });
});

export const getMapLocation = cache(async () => {
    return prisma.user.findMany({ select: { username: true, year: true, lat: true, long: true } });
});

export const getUserDD = cache(async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;
    const data = await prisma.user.findUnique({ select: { degree: true, department: true, semester: true }, where: { email: session.user.email } })
    if (data?.degree == null || data?.department == null || data?.semester == null) return { falseStatus: true }
    return data;
})