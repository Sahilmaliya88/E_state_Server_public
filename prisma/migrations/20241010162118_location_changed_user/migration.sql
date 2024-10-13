-- DropForeignKey
ALTER TABLE "location" DROP CONSTRAINT "location_user_id_fkey";

-- AlterTable
ALTER TABLE "location" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
