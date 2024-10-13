/*
  Warnings:

  - Added the required column `parking_lots` to the `property` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'AGRICULTURAL', 'RECREATIONAL', 'MIXED_USE');

-- CreateEnum
CREATE TYPE "PropertyListingType" AS ENUM ('FOR_SALE', 'FOR_RENT', 'AUCTION', 'FORECLOSURE', 'NEW_CONSTRUCTION', 'OPEN_HOUSE');

-- AlterTable
ALTER TABLE "property" ADD COLUMN     "Listring_type" "PropertyListingType" NOT NULL DEFAULT 'FOR_SALE',
ADD COLUMN     "isSaled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parking_lots" INTEGER NOT NULL,
ADD COLUMN     "property_type" "PropertyType" NOT NULL DEFAULT 'RECREATIONAL',
ADD COLUMN     "rentType" TEXT;
