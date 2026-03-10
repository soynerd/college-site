import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prismaClient"
import { r2 } from "@/lib/r2"
import { PutObjectCommand } from "@aws-sdk/client-s3"

export async function POST(req: NextRequest) {
    const formData = await req.formData()

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const distanceKm = Number(formData.get("distanceKm"))
    const budget = formData.get("budget") as string
    const timeRequired = formData.get("timeRequired") as string
    const energy = formData.get("energy") as string
    const crowd = formData.get("crowd") as string
    const mapsUrl = formData.get("mapsUrl") as string
    const trending = formData.get("trending") === "true"
    const mood = JSON.parse(formData.get("mood") as string)

    const file = formData.get("image") as File

    if (!file) {
        return NextResponse.json(
            { error: "Image required" },
            { status: 400 }
        )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const fileName = `${Date.now()}-${file.name}`
    const key = `places/images/${name
        .toLowerCase()
        .replace(/\s+/g, "-")}/${fileName}`

    await r2.send(
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        })
    )

    const imageUrl = `${process.env.R2_PUBLIC_URL}/${key}`

    const place = await prisma.place.create({
        data: {
            name,
            image: imageUrl,
            description,
            distanceKm,
            budget,
            timeRequired,
            energy,
            crowd,
            mood,
            trending,
            mapsUrl,
        },
    })

    return NextResponse.json(place)
}
