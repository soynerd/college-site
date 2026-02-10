import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";

export async function POST(req: Request) {
    try {
        const {
            facultyId,
            fairness,
            knowledge,
            clarity,
            category,
            traits,
        } = await req.json();

        const faculty = await prisma.faculty.findUnique({
            where: { id: facultyId },
        });

        if (!faculty) {
            return NextResponse.json(
                { error: "Faculty not found" },
                { status: 404 }
            );
        }

        const total = faculty.totalReviews;

        const avg = (oldVal: number, newVal: number) =>
            (oldVal * total + newVal) / (total + 1);

        const traitUpdates = Object.fromEntries(
            Object.entries(traits)
                .filter(([, v]) => v)
                .map(([k]) => [k, { increment: 1 }])
        );

        await prisma.faculty.update({
            where: { id: facultyId },
            data: {
                evaluation: avg(faculty.evaluation, fairness),
                knowledge: avg(faculty.knowledge, knowledge),
                clarity_communication: avg(
                    faculty.clarity_communication,
                    clarity
                ),

                [category]: { increment: 1 },

                ...traitUpdates,

                totalReviews: { increment: 1 },
            },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
