import { prisma } from "@/lib/prismaClient";
import { r2 } from "@/lib/r2";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { FacultyType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const faculty = await prisma.faculty.findUnique({
        where: { id: id },
    });
    return NextResponse.json(faculty);
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const facultyId = id;

    const form = await req.formData();
    const image = form.get("image") as File | null;

    const faculty = await prisma.faculty.findUnique({
        where: { id: facultyId },
    });
    if (!faculty)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

    let imageUrl = faculty.image;

    if (image && image.size > 0) {
        // delete old image
        const oldKey = faculty.image.split("/").slice(3).join("/");
        await r2.send(
            new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME!,
                Key: oldKey,
            })
        );

        // upload new image
        const key = `faculty/images/${facultyId}/${Date.now()}-${image.name}`;
        await r2.send(
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME!,
                Key: key,
                Body: Buffer.from(await image.arrayBuffer()),
                ContentType: image.type,
            })
        );

        imageUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
    }

    const updated = await prisma.faculty.update({
        where: { id: facultyId },
        data: {
            name: form.get("name") as string,
            email: form.get("email") as string,
            department: form.get("department") as string,
            discription: form.get("discription") as string,
            type: form.get("type") as FacultyType,
            image: imageUrl,
        },
    });

    return NextResponse.json(updated);
}

export async function DELETE(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await prisma.faculty.delete({ where: { id: id } });
    return NextResponse.json({ success: true });
}
