import { isDevelopment } from "@/config/environment";
import { AppError } from "@/utils/errors";
import logger from "@/utils/logger";
import { Request, Response } from "express";
import { ZodError } from "zod";

export const errorHandler = (error: Error, req: Request, res: Response) => {
  logger.error("Error occured:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      ...(isDevelopment && { stack: error.stack }),
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: error.message,
      ...(isDevelopment && { stack: error.stack }),
    });
  }

  if (error.name === "PrismaClientKnownRequestError") {
    return res.status(400).json({
      success: false,
      error: "Database operation failed",
    });
  }

  return res.status(500).json({
    success: false,
    error: "Internal server error",
    ...(isDevelopment && { stack: error.stack }),
  });
};

export const notFoundHandler = (_: Request, res: Response) => {
  return res.status(404).json({ success: false, error: "Route not found" });
};
