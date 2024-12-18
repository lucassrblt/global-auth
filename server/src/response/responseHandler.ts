import { Response } from "express";

export function sendResponse(
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) {
  res.status(statusCode).json({
    statusCode: statusCode === 200 || 201 || 202 || 203 ? "SUCCESS" : "ERROR",
    data: data,
    message,
  });
}
