import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prismaClient"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

// Prevent caching in Next 15+
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
    // ✅ Proper session retrieval
    const session = await getServerSession(authOptions)

    const userId = session?.user?.id
        ? Number(session.user.id)
        : null

    // ✅ Fetch places with ratings
    const places = await prisma.place.findMany({
        include: {
            ratings: {
                select: {
                    rating: true,
                    userId: true,
                },
            },
        },
        orderBy: {
            distanceKm: "asc",
        },
    })

    const formatted = places.map(place => {
        const ratingCount = place.ratings.length

        const avgRating =
            ratingCount === 0
                ? 0
                : Number(
                    (
                        place.ratings.reduce(
                            (sum, r) => sum + r.rating,
                            0
                        ) / ratingCount
                    ).toFixed(1)
                )

        const userRating = userId
            ? place.ratings.find(r => r.userId === userId)?.rating ?? null
            : null

        return {
            id: place.id,
            name: place.name,
            image: place.image,
            description: place.description,
            distanceKm: place.distanceKm,
            budget: place.budget,
            timeRequired: place.timeRequired,
            energy: place.energy,
            crowd: place.crowd,
            mood: place.mood,
            trending: place.trending,
            mapsUrl: place.mapsUrl,
            createdAt: place.createdAt,

            rating: avgRating,
            ratingCount,
            userRating,
            visited: !!userRating,
        }
    })

    return NextResponse.json(formatted)
}
