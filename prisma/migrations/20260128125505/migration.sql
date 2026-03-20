/*
  Warnings:

  - You are about to drop the column `branchId` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `branch` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Branch` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,degreeId]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `degreeId` to the `Department` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_branchId_fkey";

-- DropIndex
DROP INDEX "Department_name_branchId_key";

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "branchId",
ADD COLUMN     "degreeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "branch",
ADD COLUMN     "degree" TEXT;

-- DropTable
DROP TABLE "Branch";

-- CreateTable
CREATE TABLE "Degree" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Degree_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Degree_name_key" ON "Degree"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_degreeId_key" ON "Department"("name", "degreeId");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_degreeId_fkey" FOREIGN KEY ("degreeId") REFERENCES "Degree"("id") ON DELETE CASCADE ON UPDATE CASCADE;
