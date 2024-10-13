/*
  Warnings:

  - A unique constraint covering the columns `[user_id,isDefault]` on the table `location` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressline` to the `location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "location" ADD COLUMN     "addressline" TEXT NOT NULL,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "location_user_id_isDefault_key" ON "location"("user_id", "isDefault");
