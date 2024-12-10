import crypto from "crypto";
import { getApplicationByPublicKey } from "../controller/applicationController";
import { sendResponse } from "../response/responseHandler";
import { Request, Response, NextFunction } from "express";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const publicKey = req.headers["public-key"] as string;
    const signature = req.headers["signature"] as string;
    const timestamp = req.headers["timestamp"] as string;
    const url = req.originalUrl;

    if (!publicKey || !signature || !timestamp) {
      return sendResponse(res, 400, "Invalid request : Missing headers");
    }

    const application = await getApplicationByPublicKey(publicKey);

    if (application.length < 1) {
      return sendResponse(res, 403, "Public key invalid");
    }

    const secretKey = application[0].secret_key as string;

    if (!secretKey) {
      return sendResponse(res, 403, "Secret key not found");
    }

    const requestTime = parseInt(timestamp, 10);
    const currentTime = Date.now();
    if (Math.abs(currentTime - requestTime) > 5 * 60 * 1000) {
      return sendResponse(res, 401, "Request expired");
    }

    const dataToSign = `${publicKey}:${url}`;
    const serverSignature = crypto
      .createHmac("sha256", secretKey)
      .update(dataToSign)
      .digest("hex");

    if (serverSignature !== signature) {
      return sendResponse(res, 401, "Unauthorized there");
    }

    next();
  } catch (err) {
    return sendResponse(res, 500, "An error occurred");
  }
}
