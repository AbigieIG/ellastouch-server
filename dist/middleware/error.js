"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class handleError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message || "An error occurred";
        this.statusCode = statusCode || 500;
        Error.captureStackTrace(this, this.constructor);
    }
    static globalError(error, req, res, next) {
        error.statusCode = error.statusCode || 500;
        error.message = error.message || "Internal Server Error";
        res.status(error.statusCode).json({
            status: "error",
            statusCode: error.statusCode,
            message: error.message,
        });
    }
    static NotFound(req, res, next) {
        next(new handleError(`Can't find ${req.originalUrl} on this server!`, 404));
    }
}
exports.default = handleError;
