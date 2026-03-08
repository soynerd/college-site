import { uploadFile } from "@/app/admin/resources/actions/uploadFile";

export async function POST(req: Request) {
    const formData = await req.formData();
    await uploadFile(formData);
    return Response.json({ ok: true });
}
