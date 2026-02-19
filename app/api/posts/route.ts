import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prismaClient";
import { r2 } from "@/lib/r2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { nanoid } from "nanoid";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    const { searchParams } = new URL(req.url);
    const cursorId = searchParams.get("cursor");
    const limit = Number(searchParams.get("limit") ?? 5);

    const posts = await prisma.post.findMany({
        take: limit,
        skip: cursorId ? 1 : 0,
        cursor: cursorId ? { id: Number(cursorId) } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: {
                    username: true,
                    image: true
                }
            },
            media: {
                orderBy: { order: "asc" }
            },
            likes: currentUserId
                ? {
                    where: {
                        userId: currentUserId
                    },
                    select: {
                        userId: true
                    }
                }
                : false,
            _count: {
                select: { likes: true }
            }
        }
    });


    return NextResponse.json({
        posts: posts.map((p) => {
            return {
                id: p.id,
                username: p.user.username,
                image: p.user.image,
                caption: p.caption,
                media: p.media.map((m) => m.url),
                likes: p._count.likes,
                isLiked: currentUserId ? p.likes.length > 0 : false, // ✅ NEW
                createdAt: p.createdAt
            };
        }),
        nextCursor: posts.length ? posts[posts.length - 1].id : null
    });

}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    const formData = await req.formData();
    const caption = formData.get("caption") as string | null;
    const files = formData.getAll("files") as File[];
    const date = formData.get("date") as string | null;

    if (!files.length) {
        return NextResponse.json(
            { message: "Media required" },
            { status: 400 }
        );
    }

    const post = await prisma.post.create({
        data: {
            userId: session.user.id,
            caption: caption ?? null,
            createdAt: new Date(date || new Date())
        }
    });

    const mediaData: {
        postId: number;
        url: string;
        type: string;
        order: number;
    }[] = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = file.name.split(".").pop();
        const key = `posts/${post.id}/${nanoid()}.${ext}`;

        await r2.send(
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME!,
                Key: key,
                Body: buffer,
                ContentType: file.type
            })
        );

        mediaData.push({
            postId: post.id,
            url: `${process.env.R2_PUBLIC_URL}/${key}`,
            type: "image",
            order: i
        });
    }

    await prisma.postMedia.createMany({
        data: mediaData
    });

    return NextResponse.json({
        success: true,
        postId: post.id
    });
}
