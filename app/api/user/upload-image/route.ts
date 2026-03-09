import { NextRequest, NextResponse } from "next/server";
import { r2 } from "@/lib/r2";
import {
    PutObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const email = formData.get("email") as string;
    const oldUrl = formData.get("oldUrl") as string | null;

    if (!file || !email) {
        return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop();
    const key = `user/image/${email}.${ext}`;

    // delete previous image (if exists and belongs to R2)
    if (oldUrl && oldUrl.startsWith(process.env.R2_PUBLIC_URL!)) {
        const oldKey = oldUrl.replace(
            `${process.env.R2_PUBLIC_URL}/`,
            "",
        );

        await r2.send(
            new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME!,
                Key: oldKey,
            }),
        );
    }

    // upload new image
    await r2.send(
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        }),
    );

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({ url: publicUrl });
}