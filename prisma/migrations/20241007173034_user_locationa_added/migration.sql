/*
  Warnings:

  - You are about to drop the column `created_at` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `firstname` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resetlink_expiresAt` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Team_member', 'Agent', 'Admin');

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_post_id_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_user_id_fkey";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "created_at",
DROP COLUMN "name",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstname" TEXT NOT NULL,
ADD COLUMN     "lastname" TEXT NOT NULL,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "photoId" TEXT,
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "provider_id" TEXT,
ADD COLUMN     "resetlink" TEXT,
ADD COLUMN     "resetlink_expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'User',
ALTER COLUMN "password" SET NOT NULL;

-- DropTable
DROP TABLE "comment";

-- DropTable
DROP TABLE "posts";

-- CreateTable
CREATE TABLE "location" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "lag" DOUBLE PRECISION NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
