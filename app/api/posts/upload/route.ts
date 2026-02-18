import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
        return NextResponse.json({ message: "No files" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = file.name.split(".").pop();
        const key = `posts/${session.user.id}/${nanoid()}.${ext}`;

        await r2.send(
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME!,
                Key: key,
                Body: buffer,
                ContentType: file.type
            })
        );

        uploadedUrls.push(
            `https://${process.env.R2_PUBLIC_URL}/${key}`
        );
    }

    return NextResponse.json({ urls: uploadedUrls });
}
