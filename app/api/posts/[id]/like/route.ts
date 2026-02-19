import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Like
export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({}, { status: 401 });
    }

    await prisma.like.create({
        data: {
            postId: Number(params.id),
            userId: session.user.id
        }
    });

    return NextResponse.json({ success: true });
}

// Unlike
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({}, { status: 401 });
    }

    await prisma.like.delete({
        where: {
            postId_userId: {
                postId: Number(params.id),
                userId: session.user.id
            }
        }
    });

    return NextResponse.json({ success: true });
}
