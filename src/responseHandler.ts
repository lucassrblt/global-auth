import { Response } from 'express';

export function sendResponse(res: Response, statusCode: number, data: any) {
     res.send(statusCode).json({
        data: data
    });
}