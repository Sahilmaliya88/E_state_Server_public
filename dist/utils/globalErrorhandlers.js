import { envMode } from '../app.js';
export const globalErrorhandler = (err, req, res, next) => {
    err.message = err.message || 'Internal Server Error';
    err.status = err.status || 500;
    const status = `${err.status}`.startsWith("4") ? "error" : "failed";
    if (envMode === "DEVELOPMENT") {
        return res.status(err.status).json({
            status: status,
            message: err.message,
            err: err.stack,
        });
    }
    else {
        return res.status(err.status).json({
            status: status,
            message: err.message
        });
    }
};
