import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get("url");
    const filename = searchParams.get("name") || "file";

    if (!fileUrl) return new Response("Missing URL", { status: 400 });

    const res = await fetch(fileUrl);
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
        headers: {
            "Content-Type": res.headers.get("content-type") || "application/octet-stream",
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    });
}