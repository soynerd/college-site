"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { prisma } from "@/lib/prismaClient";

export async function uploadFile(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file");

    const subjectId = formData.get("subjectId") as string;
    const title = formData.get("title") as string;
    const contentType = formData.get("contentType") as string;
    const academicYear = formData.get("academicYear") as string | null;

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `resources/${subjectId}/${Date.now()}-${file.name}`;

    await r2.send(
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        })
    );

    const url = `${process.env.R2_PUBLIC_URL}/${key}`;

    await prisma.file.create({
        data: {
            title,
            subjectId,
            contentType,
            academicYear,
            type: file.type,
            url,
            tags: [],
        },
    });
}
