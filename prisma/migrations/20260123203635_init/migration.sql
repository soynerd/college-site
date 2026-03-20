-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'student',
    "provider" TEXT NOT NULL,
    "branch" TEXT,
    "department" TEXT,
    "semester" INTEGER,
    "year" INTEGER,
    "lat" INTEGER,
    "long" INTEGER,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "totalResourceRequests" INTEGER NOT NULL DEFAULT 0,
    "totalVisits" INTEGER NOT NULL DEFAULT 0,
    "totalResourcesAdded" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "department" TEXT,
    "discription" TEXT,
    "evaluation" DOUBLE PRECISION NOT NULL DEFAULT -1,
    "knowledge" DOUBLE PRECISION NOT NULL DEFAULT -1,
    "clarity_communication" DOUBLE PRECISION NOT NULL DEFAULT -1,
    "reader" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_email_key" ON "Faculty"("email");
