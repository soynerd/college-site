-- CreateTable
CREATE TABLE "Place" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "budget" TEXT NOT NULL,
    "timeRequired" TEXT NOT NULL,
    "energy" TEXT NOT NULL,
    "crowd" TEXT NOT NULL,
    "mood" TEXT[],
    "trending" BOOLEAN NOT NULL DEFAULT false,
    "mapsUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaceRating" (
    "id" SERIAL NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "placeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlaceRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaceRating_userId_placeId_key" ON "PlaceRating"("userId", "placeId");

-- AddForeignKey
ALTER TABLE "PlaceRating" ADD CONSTRAINT "PlaceRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceRating" ADD CONSTRAINT "PlaceRating_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
