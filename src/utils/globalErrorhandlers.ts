import {Request,Response,NextFunction} from 'express'
import AppError from './AppError.js'
import { envMode } from '../app.js'
export const globalErrorhandler=(err:any,req:Request,res:Response,next:NextFunction)=>{
    err.message =  err.message || 'Internal Server Error'
    err.status = err.status || 500
    const status =  `${err.status}`.startsWith("4") ? "error":"failed"
    if(envMode === "DEVELOPMENT"){
        return res.status(err.status).json({
            status:status,
            message:err.message,
            err:err,
        })
    }else{
      return  res.status(err.status).json({
            status:status,
            message:err.message
        })
    }
}