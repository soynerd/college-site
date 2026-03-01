import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prismaClient"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params

    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const userId = Number(session.user.id)
    const placeId = Number(id)

    const { rating } = await req.json()

    await prisma.placeRating.upsert({
        where: {
            userId_placeId: {
                userId,
                placeId,
            },
        },
        update: { rating },
        create: { rating, userId, placeId },
    })


    return NextResponse.json({ success: true })
}
