/*
  Warnings:

  - The `reader` column on the `Faculty` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `type` to the `Faculty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Faculty" ADD COLUMN     "assignmentFreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "commonSense" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "goat" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "passable" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "researchRecruiter" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "selfClaimedGod" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sleepInducer" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "storyteller" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "strictPookie" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "unbearable" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "reader",
ADD COLUMN     "reader" INTEGER NOT NULL DEFAULT 0;
