/*
  Warnings:

  - Made the column `department` on table `Faculty` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `type` on the `Faculty` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FacultyType" AS ENUM ('Regular', 'Contract');

-- AlterTable
ALTER TABLE "Faculty" ALTER COLUMN "department" SET NOT NULL,
ALTER COLUMN "evaluation" SET DEFAULT 0,
ALTER COLUMN "knowledge" SET DEFAULT 0,
ALTER COLUMN "clarity_communication" SET DEFAULT 0,
DROP COLUMN "type",
ADD COLUMN     "type" "FacultyType" NOT NULL;
