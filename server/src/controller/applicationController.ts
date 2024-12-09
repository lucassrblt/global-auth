import { query } from "./dbController";
import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../response/responseHandler";

export async function createApplication(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const { name } = req.body;

    if (!name.trim()) {
      return sendResponse(res, 400, "An application name is required");
    }

    const findApplication = await query(
      "SELECT * FROM applications WHERE name = ?",
      [name]
    );

    if (findApplication.length > 0) {
      return sendResponse(res, 409, "Application already exists");
    }

    await query("INSERT INTO applications (name) VALUES (?)", [name]);

    return sendResponse(res, 201, "Application created successfully");
  } catch (err) {
    return sendResponse(res, 500, "An error occurred");
  }
}

export async function getApplications(
  req: Request,
  res: Response,
  next?: NextFunction
): Promise<any> {
  try {
    const applications = await query("SELECT * FROM applications");

    if (applications.length < 1) {
      return sendResponse(res, 200, "No applications found");
    }

    return sendResponse(res, 200, applications);
  } catch (err) {
    return sendResponse(res, 500, "An error occurred");
  }
}
