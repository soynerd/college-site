import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prismaClient"
import { r2 } from "@/lib/r2"
import {
    PutObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3"

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params   // ✅ MUST await

    const placeId = Number(id)

    if (isNaN(placeId)) {
        return NextResponse.json(
            { error: "Invalid place id" },
            { status: 400 }
        )
    }

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

    const file = formData.get("image") as File | null
    console.log("Received file:", file)  // Debug log

    const existing = await prisma.place.findUnique({
        where: { id: placeId },
    })

    if (!existing) {
        return NextResponse.json(
            { error: "Place not found" },
            { status: 404 }
        )
    }

    let imageUrl = existing.image

    if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer())

        const key = `places/images/${name
            .toLowerCase()
            .replace(/\s+/g, "-")}/${Date.now()}-${file.name}`

        await r2.send(
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME!,
                Key: key,
                Body: buffer,
                ContentType: file.type,
            })
        )

        imageUrl = `${process.env.R2_PUBLIC_URL}/${key}`
    }
    if (existing.image) {
        try {
            const url = new URL(existing.image)

            const oldKey = decodeURIComponent(
                url.pathname.startsWith("/")
                    ? url.pathname.slice(1)
                    : url.pathname
            )

            console.log("Deleting old key:", oldKey)

            await r2.send(
                new DeleteObjectCommand({
                    Bucket: process.env.R2_BUCKET_NAME!,
                    Key: oldKey,
                })
            )
        } catch (err) {
            console.error("Delete failed:", err)
        }
    }



    const updated = await prisma.place.update({
        where: { id: placeId },
        data: {
            name,
            description,
            distanceKm,
            budget,
            timeRequired,
            energy,
            crowd,
            mood,
            trending,
            mapsUrl,
            image: imageUrl,
        },
    })

    return NextResponse.json(updated)
}


export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = Number(params.id)

    await prisma.place.delete({
        where: { id },
    })

    return NextResponse.json({ success: true })
}
