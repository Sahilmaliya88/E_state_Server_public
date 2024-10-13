import {Request,Response,NextFunction} from 'express'
import prisma from '../lib/database.js'
import redis from '../lib/Redis.js'
import { checkAsync } from '../lib/checkasync.js'
import AppError from '../utils/AppError'

export const addAmenities = checkAsync(async(req:Request,res:Response)=>{
    const data:{title:string}[] = req.body
    const amenities = await prisma.amenities.createMany({
        data:data
    })
    res.status(200).json({
        message:"amenities added successfully"
    })
})
export const getAll = checkAsync(async(req:Request,res:Response)=>{
    let amenities:any = await redis.get("amenities")
    if(!amenities){
        amenities = await prisma.amenities.findMany()
        await redis.set("amenities",JSON.stringify(amenities))
        return res.status(200).json({
            amenities:amenities
        })
    }
    res.status(200).json({
        amenities:JSON.parse(amenities)
    })
})