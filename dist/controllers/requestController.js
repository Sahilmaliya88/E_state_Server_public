import prisma from '../lib/database.js';
import AppError from '../utils/AppError.js';
import { checkAsync } from '../lib/checkasync.js';
export const create_Request = checkAsync(async (req, res, next) => {
    const data = req.body;
    const request = await prisma.chat_request.create({
        data: { ...data }
    });
    return res.status(201).json(request);
});
export const acceptRequest = checkAsync(async (req, res, next) => {
    const req_id = req.params.id;
    const user_id = req.user.id;
    if (!user_id) {
        return next(new AppError("please login", 401));
    }
    const request = await prisma.chat_request.findFirst({
        where: {
            AND: [
                {
                    id: req_id
                },
                {
                    to_id: user_id
                }
            ]
        }
    });
    if (!request) {
        return next(new AppError("you don't have permission to do this", 401));
    }
    await prisma.chat_request.update({
        where: { id: request.id }, data: { status: "ACCEPTED" }
    });
    //char room intialization
    let chatroom = await prisma.chat_room.findFirst({
        where: {
            OR: [
                {
                    AND: [
                        {
                            participant_first_id: request.from_id
                        }, {
                            participant_second_id: request.to_id
                        }
                    ]
                },
                {
                    AND: [
                        {
                            participant_first_id: request.to_id
                        }, {
                            participant_second_id: request.from_id
                        }
                    ]
                }
            ]
        }
    });
    if (!chatroom) {
        const index = [request.from_id, request.to_id].sort().join("");
        chatroom = await prisma.chat_room.create({
            data: {
                participant_first_id: request.to_id,
                participant_second_id: request.from_id,
                unique_user_string: index
            }
        });
    }
    res.status(200).json({
        message: "request accepted",
        chatRoomId: chatroom.id
    });
});
