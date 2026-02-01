"use server";

import { prisma } from "@/lib/prismaClient";
import { r2 } from "@/lib/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

export async function getSubjectsWithFiles({
  degreeId,
  departmentId,
  semester,
  page,
}: {
  degreeId?: string;
  departmentId?: string;
  semester?: number;
  page: number;
}) {
  const take = 20;
  const skip = (page - 1) * take;

  return prisma.subject.findMany({
    where: {
      semester: semester ?? undefined,
      departments: departmentId ? { some: { departmentId } } : undefined,
    },
    include: {
      files: true,
    },
    orderBy: { name: "asc" },
    take,
    skip,
  });
}

export async function renameFile(id: string, title: string) {
  await prisma.file.update({ where: { id }, data: { title } });
  revalidatePath("/admin/resources/files");
}

export async function deleteFileAndR2(file: { id: string; url: string }) {
  const key = file.url.split("/").slice(-3).join("/"); // resources/<subjectId>/<filename>

  await r2.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    }),
  );

  await prisma.file.delete({ where: { id: file.id } });

  revalidatePath("/admin/resources/files");
}
