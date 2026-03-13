"use server"
import { prisma } from "@/lib/prismaClient";
import { ProfileForm } from "../types/profileForm";
import { getServerSession } from "next-auth";
import { getUser } from "./getUser";


export async function saveUser(formData: ProfileForm) {
    const user = await getUser();

    const session = await getServerSession();
    const data: any = {
        name: formData.displayName,
        image: formData.photo,
        degree: formData.degree,
        department: formData.department,
        semester: Number(formData.semester),
        year: Number(formData.year),
        lat: Number(formData.Lat),
        long: Number(formData.Long),
    }
    if (!user?.usernameChanged) data.username = formData.username;
    if (!session?.user?.email) return null;
    await prisma.user.update({
        where: {
            email: session.user.email
        },
        data
    })
    return { status: "saved" };
}

export async function incrementVisit() {
    const session = await getServerSession();
    if (!session?.user?.email) return null;

    prisma.user.update({
        where: { email: session.user.email },
        data: {
            totalVisits: { increment: 1 }
        }
    })
}

export async function incrementReviews() {
    const session = await getServerSession();
    if (!session?.user?.email) return null;

    prisma.user.update({
        where: { email: session.user.email },
        data: {
            totalReviews: { increment: 1 }
        }
    })
}
export async function incrementResourceRequests() {
    const session = await getServerSession();
    if (!session?.user?.email) return null;

    prisma.user.update({
        where: { email: session.user.email },
        data: {
            totalResourceRequests: { increment: 1 }
        }
    })
}

