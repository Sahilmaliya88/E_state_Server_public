class AppError extends Error {
    constructor(message, status) {
        super(message);
        this.message = message;
        this.status = status;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
export default AppError;
