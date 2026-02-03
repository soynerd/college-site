"use server"
import { prisma } from "@/lib/prismaClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"


export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);

    const degreeId = searchParams.get("degreeId");
    const departmentId = searchParams.get("departmentId");
    const semester = searchParams.get("semester");
    const def = searchParams.get("default");

    if (def != null) {
        if (!session?.user?.email) return Response.json(null);
        const data = await prisma.user.findUnique({ select: { degree: true, department: true, semester: true }, where: { email: session.user.email } })
        if (data?.degree == null || data?.department == null || data?.semester == null) return Response.json({ profileData: null, subjects: null })

        const subjects = await prisma.subject.findMany({
            where: {
                semester: data.semester,
                departments: {
                    some: {
                        department: {
                            name: data.department,
                            degree: {
                                name: data.degree,
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
        return Response.json({ profileData: data, subjects });
    }

    else {
        const subjects = await prisma.subject.findMany({
            where: {
                semester: semester ? Number(semester) : undefined,
                departments: departmentId
                    ? {
                        some: { departmentId },
                    }
                    : undefined,
            },
            select: {
                id: true,
                name: true,
            },
            orderBy: { name: "asc" },
        });
        return Response.json(subjects);
    }

}
