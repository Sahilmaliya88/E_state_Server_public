/*
  Warnings:

  - A unique constraint covering the columns `[property_id]` on the table `location` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "location" ADD COLUMN     "property_id" INTEGER;

-- CreateTable
CREATE TABLE "property" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amenities" INTEGER[],
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "coverphoto" TEXT NOT NULL,
    "coverphotoId" TEXT NOT NULL,
    "area" INTEGER NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,

    CONSTRAINT "property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photos" (
    "id" SERIAL NOT NULL,
    "photo" TEXT NOT NULL,
    "photoId" TEXT NOT NULL,
    "property_id" INTEGER NOT NULL,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "location_property_id_key" ON "location"("property_id");

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property" ADD CONSTRAINT "property_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
