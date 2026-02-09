import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { FacultyType } from "@prisma/client";

export async function POST(req: Request) {
    const form = await req.formData();

    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const department = form.get("department") as string;
    const description = form.get("description") as string;
    const image = form.get("image") as File;
    const type = form.get("type") as string;
    console.log(type);

    if (!image) {
        return NextResponse.json({ error: "Image required" }, { status: 400 });
    }

    if (image.size > 300 * 1024) {
        return NextResponse.json(
            { error: "Image must be under 300KB" },
            { status: 400 }
        );
    }

    const key = `faculty/images/${image.name}`;

    // 1️⃣ upload image first
    await r2.send(
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
            Body: Buffer.from(await image.arrayBuffer()),
            ContentType: image.type,
        })
    );

    const imageUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    // 2️⃣ create faculty in DB
    const faculty = await prisma.faculty.create({
        data: {
            name,
            email,
            department,
            type: type as FacultyType,
            discription: description,
            image: imageUrl,
        },
    });

    return NextResponse.json({ success: true, faculty });
}
