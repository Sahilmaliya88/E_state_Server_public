class AppError extends Error{
    status: number;
    isOperational: boolean;
    constructor(message:string,status:number){
        super(message);
        this.message = message
        this.status = status
        this.isOperational = true;
        Error.captureStackTrace(this,this.constructor)
    }
}
export  default AppError;
