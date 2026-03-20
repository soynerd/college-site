-- CreateTable
CREATE TABLE "AdminLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "targetId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id")
);
