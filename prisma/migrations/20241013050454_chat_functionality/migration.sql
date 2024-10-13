-- CreateEnum
CREATE TYPE "status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "chat_status" AS ENUM ('Sent', 'received', 'seen');

-- CreateTable
CREATE TABLE "chat_request" (
    "id" TEXT NOT NULL,
    "from_id" TEXT NOT NULL,
    "to_id" TEXT NOT NULL,
    "property_id" INTEGER NOT NULL,
    "status" "status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_room" (
    "id" TEXT NOT NULL,
    "participant_first_id" TEXT NOT NULL,
    "participant_second_id" TEXT NOT NULL,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unique_user_string" TEXT NOT NULL,

    CONSTRAINT "chat_room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" SERIAL NOT NULL,
    "chat_room_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "reciever_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "chat_status" NOT NULL DEFAULT 'Sent',

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chat_request_property_id_from_id_key" ON "chat_request"("property_id", "from_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_room_unique_user_string_key" ON "chat_room"("unique_user_string");

-- AddForeignKey
ALTER TABLE "chat_request" ADD CONSTRAINT "chat_request_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_request" ADD CONSTRAINT "chat_request_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_request" ADD CONSTRAINT "chat_request_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_room" ADD CONSTRAINT "chat_room_participant_first_id_fkey" FOREIGN KEY ("participant_first_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_room" ADD CONSTRAINT "chat_room_participant_second_id_fkey" FOREIGN KEY ("participant_second_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "chat_room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_reciever_id_fkey" FOREIGN KEY ("reciever_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
