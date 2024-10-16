import { NextFunction,Response } from "express";
import { checkAsync } from "../lib/checkasync.js";
import prisma from "../lib/database.js";
import AppError from "../utils/AppError.js";
import { Configured_Request } from "./requestController.js";

export const addReview = checkAsync(async(req:Configured_Request,res:Response,next:NextFunction)=>{
    const review = await prisma.reviews.create({
        data:{
            user_id:req.user.id,...req.body
        }
    })
    res.status(201).json(review);
})
export const deleteReview = checkAsync(async(req:Configured_Request,res:Response,next:NextFunction)=>{
    const deleted_rows= await prisma.reviews.deleteMany({
        where:{
            AND:[
                {
                    id:Number.parseInt(req.params.id)
                },{
                    user_id:req.user.id
                }
            ]
        }
    })
    if(!deleted_rows){
        if(!deleted_rows){
         return next(new AppError('Review not found or you do not have permission to delete this review', 404));
        }
    }
    res.status(200).json({ message: 'Review deleted successfully' });
})
export const getAllReviews = checkAsync(async(req:Configured_Request,res:Response,next:NextFunction)=>{
    const reviews = await prisma.reviews.findMany({ include:{
        user:{
            select:{
                photo:true,
                id:true,
                email:true,
                firstname:true,
                lastname:true
            }
        }
    }})
    res.status(200).json(reviews);
})
export const getUserReviews = checkAsync(async(req:Configured_Request,res:Response,next:NextFunction)=>{
    const reviews = await prisma.reviews.findMany({
        where:{
            user_id:req.user.id
        }
    })
    res.status(200).json(reviews);
})
export const getRandomReviews = checkAsync(async(req:Configured_Request,res:Response,next:NextFunction)=>{
    const reviews = await prisma.reviews.findMany({
        take: 10,
        orderBy: [{ id: 'asc' }],
        skip: Math.floor(Math.random() * (await prisma.reviews.count())),
        include:{
            user:{
                select:{
                    photo:true,
                    id:true,
                    email:true,
                    firstname:true,
                    lastname:true
                }
            }
        }
    })
    res.status(200).json(reviews);
})