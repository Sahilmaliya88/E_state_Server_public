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
export const getSentRequest = checkAsync(async (req, res, next) => {
    const requests = await prisma.chat_request.findMany({
        where: {
            from_id: req.user.id
        },
        include: {
            property: {
                select: {
                    id: true,
                    title: true,
                    coverphoto: true,
                }
            }
        }
    });
    return res.status(200).json({
        requests: requests
    });
});
export const recieved_request = checkAsync(async (req, res, next) => {
    const type = req.query.type;
    let requests;
    if (type === "pending") {
        requests = await prisma.chat_request.findMany({
            where: {
                AND: [
                    {
                        property_id: Number.parseInt(req.params.propid)
                    }, {
                        to_id: req.user.id
                    }, {
                        status: {
                            equals: "PENDING"
                        }
                    }
                ]
            },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        coverphoto: true,
                    }
                }
            },
            orderBy: {
                created_at: "desc"
            }
        });
    }
    else if (type === "accepted") {
        requests = await prisma.chat_request.findMany({
            where: {
                AND: [
                    {
                        property_id: Number.parseInt(req.params.propid)
                    }, {
                        to_id: req.user.id
                    }, {
                        status: {
                            equals: "ACCEPTED"
                        }
                    }
                ]
            },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        coverphoto: true,
                    }
                }
            },
            orderBy: {
                created_at: "desc"
            }
        });
    }
    else if (type === "rejected") {
        requests = await prisma.chat_request.findMany({
            where: {
                AND: [
                    {
                        property_id: Number.parseInt(req.params.propid)
                    }, {
                        to_id: req.user.id
                    }, {
                        status: {
                            equals: "REJECTED"
                        }
                    }
                ]
            },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        coverphoto: true,
                    }
                }
            },
            orderBy: {
                created_at: "desc"
            }
        });
    }
    else {
        requests = await prisma.chat_request.findMany({
            where: {
                AND: [
                    {
                        property_id: Number.parseInt(req.params.propid)
                    }, {
                        to_id: req.user.id
                    }
                ]
            },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        coverphoto: true,
                    }
                }
            },
            orderBy: {
                created_at: "desc"
            }
        });
    }
    return res.status(200).json({
        requests: requests
    });
});
export const reject_request = checkAsync(async (req, res, next) => {
    const req_id = req.params.id;
    const user_id = req.user.id;
    const request = await prisma.chat_request.updateMany({ where: {
            AND: [
                {
                    id: req_id
                }, {
                    to_id: user_id
                }
            ]
        }, data: {
            status: "REJECTED"
        } });
    res.status(200).json({
        status: "success",
        message: "request rejected"
    });
});
