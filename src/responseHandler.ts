import { Response } from 'express';

export function sendResponse(res: Response, statusCode: number, data: any) {
    const response = res.status(statusCode).json({
        data: data
    });
    res.send(response);
}