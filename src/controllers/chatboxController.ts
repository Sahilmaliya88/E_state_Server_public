import { Request,Response,NextFunction } from "express";
import prisma from "../lib/database.js";
import AppError from "../utils/AppError.js";
import { checkAsync } from "../lib/checkasync.js";
import {Configured_Request} from './requestController.js'
export const getChatroom = checkAsync(async(req:Configured_Request,res:Response,next:NextFunction)=>{
    const {id} = req.params
    const chatroom = await prisma.chat_room.findFirst({
        where:{
             AND:[
                {
                    id:id
                },
                {
                    OR:[
                        {
                            participant_first_id:req.user.id
                        },{
                            participant_second_id:req.user.id
                        }
                    ]
                }
             ]
        },
        include:{
            participant_first:{
                select:{
                    firstname:true,
                    lastname:true,
                    email:true,
                    photo:true
                }
            },
            participant_second:{
                select:{
                    firstname:true,
                    lastname:true,
                    email:true,
                    photo:true
                }
            },
            chats:{
                orderBy:{
                    created_at:"asc"
                }
            }
        },
    })
    res.status(200).json({
        status:"success",
        data:chatroom,
    })
})
export const getAllChatrooms = checkAsync(async(req:Configured_Request,res:Response,next:NextFunction)=>{
    console.log(req.user.id)
    const chatrooms = await prisma.chat_room.findMany({
        where:{
            OR:[
                {
                    participant_first_id:req.user.id
                },{
                    participant_second_id:req.user.id
                }
            ]
        },
        include:{
            participant_first:{
                select:{
                    firstname:true,
                    lastname:true,
                    email:true,
                    photo:true
                }
            },
            participant_second:{
                select:{
                    firstname:true,
                    lastname:true,
                    email:true,
                    photo:true
                }
            },
            chats:{
                where:{
                    AND:[
                        {
                            reciever_id:req.user.id
                        },{
                            status:"Sent"
                        }
                    ]
                },
                select:{
                    id:true
                }
            }
        }
    })
    res.status(200).json({
        status:"success",
        chats:chatrooms
    })
})