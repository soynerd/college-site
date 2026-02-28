"use server"
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { getUser } from "@/lib/data/getUser";

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
        const user = await getUser();
        if (!user) {
            return NextResponse.json(
                { error: "User not authenticated" },
                { status: 401 }
            );
        }
        const reviewsLeft = user.totalReviewsLeft;
        if (reviewsLeft === 0) {
            return NextResponse.json(
                { error: "No reviews left" },
                { status: 400 }
            );
        }
        if (user.semester == null || user.year == null) {
            return NextResponse.json(
                { error: "User details incomplete" },
                { status: 400 }
            );
        }

        const alreadyReviewed = await prisma.facultyReviewLog.findMany({
            select: { createdAt: true },
            where: {
                userId: user.id,
                facultyId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        if (alreadyReviewed.length > 0 && alreadyReviewed[0].createdAt > sixMonthsAgo) {
            return NextResponse.json(
                { error: "Already reviewed this faculty in last 6 months" },
                { status: 400 }
            );
        }

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

        await prisma.facultyReviewLog.create({
            data: {
                userId: user.id,
                facultyId: facultyId,
                semester: user.semester,
                year: user.year
            }
        });

        await prisma.user.update({
            where: { id: user.id },
            data: {
                totalReviewsLeft: { decrement: 1 },
            },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
