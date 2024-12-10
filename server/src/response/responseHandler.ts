import { Response } from "express";

export function sendResponse(res: Response, statusCode: number, data: any) {
  res.status(statusCode).json({
    data: data,
  });
}
