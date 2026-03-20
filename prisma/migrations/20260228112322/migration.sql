-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totalPlaceRatings" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalReviewsLeft" INTEGER NOT NULL DEFAULT 6;

-- CreateTable
CREATE TABLE "FacultyReviewLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "facultyId" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FacultyReviewLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FacultyReviewLog_userId_facultyId_semester_year_key" ON "FacultyReviewLog"("userId", "facultyId", "semester", "year");

-- AddForeignKey
ALTER TABLE "FacultyReviewLog" ADD CONSTRAINT "FacultyReviewLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacultyReviewLog" ADD CONSTRAINT "FacultyReviewLog_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
