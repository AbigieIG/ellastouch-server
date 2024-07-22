import { Request, Response, NextFunction } from "express";

class handleError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.message = message || "An error occurred";
    this.statusCode = statusCode || 500;
    Error.captureStackTrace(this, this.constructor);
  }

  static globalError(
    error: handleError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Internal Server Error";
    res.status(error.statusCode).json({
      status: "error",
      statusCode: error.statusCode,
      message: error.message,
    });
  }

  static NotFound(req: Request, res: Response, next: NextFunction): void {
    next(new handleError(`Can't find ${req.originalUrl} on this server!`, 404));
  }
}

export default handleError;
