-- CreateTable
CREATE TABLE "ChatAnalytics" (
    "id" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "subject" TEXT,
    "types" TEXT[],
    "clarified" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatAnalytics_pkey" PRIMARY KEY ("id")
);
