-- AlterTable
ALTER TABLE "User" ADD COLUMN     "banned" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "totalVisits" SET DEFAULT 1;

-- CreateTable
CREATE TABLE "UserSubject" (
    "userId" INTEGER NOT NULL,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "UserSubject_pkey" PRIMARY KEY ("userId","subjectId")
);

-- AddForeignKey
ALTER TABLE "UserSubject" ADD CONSTRAINT "UserSubject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubject" ADD CONSTRAINT "UserSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
