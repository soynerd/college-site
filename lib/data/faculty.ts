'use server'
import { prisma } from "@/lib/prismaClient";

export async function getFaculty(id: string) {
    return prisma.faculty.findUnique({
        where: { id },
    });
}

export async function updateFaculty({
    facultyId,
    fairness,
    knowledge,
    clarity,
    category,
    traits,
}: {
    facultyId: string;
    fairness: number;
    knowledge: number;
    clarity: number;
    category: "goat" | "passable" | "sleepInducer" | "Unbearable";
    traits: Record<string, boolean>;
}) {
    const faculty = await prisma.faculty.findUnique({
        where: { id: facultyId },
    });

    if (!faculty) throw new Error("Faculty not found");

    const total = faculty.totalReviews;

    const avg = (oldVal: number, newVal: number) =>
        (oldVal * total + newVal) / (total + 1);

    const traitUpdates = Object.fromEntries(
        Object.entries(traits)
            .filter(([, v]) => v)
            .map(([k]) => [k, { increment: 1 }])
    );

    return prisma.faculty.update({
        where: { id: facultyId },
        data: {
            evaluation: avg(faculty.evaluation, fairness),
            knowledge: avg(faculty.knowledge, knowledge),
            clarity_communication: avg(faculty.clarity_communication, clarity),

            [category]: { increment: 1 },

            ...traitUpdates,

            totalReviews: { increment: 1 },
        },
    });
}
