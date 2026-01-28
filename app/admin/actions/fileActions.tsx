"use server";

import { prisma } from "@/lib/prismaClient";

export async function getAllFiles() {
  return prisma.file.findMany({
    include: {
      subject: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateFile(
  id: string,
  data: {
    title?: string;
    description?: string;
    contentType?: string;
    academicYear?: string | null;
  },
) {
  return prisma.file.update({
    where: { id },
    data,
  });
}

export async function deleteFile(id: string) {
  return prisma.file.delete({
    where: { id },
  });
}
