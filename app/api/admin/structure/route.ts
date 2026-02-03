import { prisma } from "@/lib/prismaClient";

export async function GET() {
    const data = await prisma.degree.findMany({
        include: {
            departments: {
                select: { id: true, name: true },
            },
        },
        orderBy: { name: "asc" },
    });

    return Response.json(data);
}
