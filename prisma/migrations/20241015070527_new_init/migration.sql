-- CreateTable
CREATE TABLE "CombinedFile" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CombinedFile_pkey" PRIMARY KEY ("id")
);
