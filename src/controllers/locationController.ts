import { checkAsync } from "../lib/checkasync.js";
import prisma from "../lib/database.js";
import redis from "../lib/Redis.js";
import {Request,Response,NextFunction} from 'express'
import AppError from "../utils/AppError.js";
export const addLocation = checkAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const {user_id,lag,lat,addressline,city,country} = req.body
    if(!user_id || !lag || !lat || !addressline || !city || !country ){
        return next(new AppError("please provide sufficient data",401))
    }
    //property location yet to implement
    const location = await prisma.location.create({
    data:{
         city:city,
         country:country,
         addressline:addressline,
         lag:Number.parseFloat(lag),
         lat:Number.parseFloat(lat),
         user_id:user_id   
    }})
    res.status(201).json({
        message:"location added successfully",
        location:location
    })
})

export const editlocation= checkAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const id = req.params.id
    const data = req.body
    const location = await prisma.location.update({where:{id:Number.parseInt(id)},data:{...data}})
    //check if property location changed
    if(location.property_id){
        if(data.city){
            const keys = await redis.keys("page:*")
            await redis.unlink(keys)
        }
        await redis.del(`prop-${location.property_id}`)
    }
    res.status(200).json({
        message:"location updated successfully"
    })
})
export const makeDefaultLocation = checkAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const {prev,curr} = req.body
    if(prev){
        await prisma.location.update({where:{id:Number.parseInt(prev)},data:{isDefault:false}})
    }
    let location_changed =  await prisma.location.update({where:{id:Number.parseInt(curr)},data:{isDefault:true}})
    res.status(200).json({message:"default changed"})
})
export const deleteLocation  = checkAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const id = req.params.id
    const location  = await prisma.location.delete({where:{id:Number.parseInt(id)}})
    res.status(200).json({message:"successfully deleted"})
})