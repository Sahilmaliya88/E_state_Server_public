import { Request,Response,NextFunction } from "express";
import prisma from "../lib/database.js";
import AppError from "../utils/AppError.js";
import { checkAsync } from "../lib/checkasync.js";
import {Configured_Request} from './requestController.js'
const allowedRole:string[] = [ "Team_member","Agent","Admin"]
export const addArticle = checkAsync(async(req:Configured_Request,res:Response,next:NextFunction)=>{
    if(!allowedRole.find((ele)=>ele===`${req.user.role}`)){  
        return next(new AppError("you  dont have permission to perform this action",403))
    }
    const data = req.body
    const article = await prisma.article.create({
        data:{
            author_Id:req.user.id,...data
        }
    })
    res.status(201).json({
        message:"article created successfully",
        article_id:article.id
    })
})

export const getArticles = checkAsync(async(req:Configured_Request,res:Response,next:NextFunction)=>{
    let articles:any[];
    if(req.query.page && req.query.limit){
        const page = Number.parseInt(`${req.query.page}`)
        const limit = Number.parseInt(`${req.query.limit}`)
        const skip = (page-1) * limit
        articles = await prisma.article.findMany({
            take:limit,
            skip:skip,
            select:{
                id:true,
                coverphoto:true,
                title:true,
                author:{
                    select:{
                        firstname:true,
                        lastname:true
                    }
                },
                like_count:true
            },
            orderBy:{
                like_count:"desc"
            }
        })
    }else{
        articles = await prisma.article.findMany({
            select:{
                id:true,
                coverphoto:true,
                title:true,
                author:{
                    select:{
                        firstname:true,
                        lastname:true
                    }
                },
                like_count:true
            },
            orderBy:{
                like_count:"desc"
            }
        })
    }
    res.status(200).json({
        status:"success",
        articles:articles
    })
})
export const getArticle = checkAsync(async(req:Configured_Request,res:Response,next:NextFunction)=>{
    const id = Number.parseInt(req.params.id)
    const article = await prisma.article.findFirst({where:{id:id},
    include:{
        author:{
            select:{
                email:true,
                firstname:true,
                lastname:true,
                photo:true
            }
        }
    }})
    res.status(200).json({
        status:"success",
        article:article
    })
})
export const likeArticle = checkAsync(async(req:Configured_Request,res:Response,next:NextFunction)=>{
    const article_id = Number.parseInt(req.params.id)
    const user_id = req.user.id
    const like = await prisma.article_likes.create({
        data:{
            user_id:user_id,
            article_id:article_id
        }
    })
    if(!like){
        return next(new AppError("you have already liked this article",400))
    }
    await prisma.article.update({where:{
        id:article_id
    },data:{
        like_count:{
            increment:1
        }
    }})
    res.status(200).json({
        message:"article liked successfully"
    })
})
export const editArticle = checkAsync(async(req:Configured_Request,res:Response,next:NextFunction)=>{
    const id = Number.parseInt(req.params.id)
    const user_id = req.user.id
    const articles = await prisma.article.updateMany({
        where:{
            AND:[
                {
                    id:id
                },
                {
                    author_Id:user_id
                }
            ]
        },data:{...req.body}
    })
    if(!articles){
    return next(new AppError("Failed to update article",400))
    }
    return res.status(200).json({
        message:"update successfully"
    })
})
export const deleteArticle = checkAsync(async(req:Configured_Request,res:Response,next:NextFunction)=>{
    const id = Number.parseInt(req.params.id)
    const deleted = await prisma.article.delete({
        where:{
            id:id
        }
    })
    if(!deleted){
      return   next(new AppError("Failed to delete article",400))
    }
    res.status(200).json({
    status:"success"
})
})