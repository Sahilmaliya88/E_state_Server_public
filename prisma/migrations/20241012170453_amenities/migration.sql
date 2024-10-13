-- DropForeignKey
ALTER TABLE "location" DROP CONSTRAINT "location_property_id_fkey";

-- DropForeignKey
ALTER TABLE "property" DROP CONSTRAINT "property_user_id_fkey";

-- CreateTable
CREATE TABLE "amenities" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "amenities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property" ADD CONSTRAINT "property_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
