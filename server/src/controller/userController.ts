import bcrypt from "bcrypt";
import { query } from "./dbController";
import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../responseHandler";

interface User {
  id: number;
  email: string;
  password: string;
  application_id: number;
  created_at: string;
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const { email, password, application } = req.body;

    if (!email.trim() || !password.trim() || !application.trim()) {
      return sendResponse(res, 400, "All fields are required");
    }

    const findApplication = await query(
      "SELECT * FROM applications WHERE name = ?",
      [application]
    );

    if (findApplication.length < 1) {
      return sendResponse(res, 404, "Application not found");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendResponse(res, 400, "Invalid email");
    }

    const applicationId = findApplication[0].id;
    const hashedPassword = await bcrypt.hash(password, 10);

    const findUser = await query(
      "SELECT * FROM users WHERE email = ? AND application_id = ?",
      [email, applicationId]
    );

    if (findUser.length > 0) {
      return sendResponse(res, 409, "User already exists");
    }

    await query(
      "INSERT INTO users (email, password, application_id) VALUES (?, ?, ?)",
      [email, hashedPassword, applicationId]
    );
    return sendResponse(res, 201, "User created successfully");
  } catch (err) {
    return sendResponse(res, 500, "An error occurred");
  }
}

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const users: User[] = await query("SELECT * FROM users");

    if (users.length < 1) {
      return sendResponse(res, 200, "No users found");
    }

    return sendResponse(res, 200, users);
  } catch (err) {
    return sendResponse(res, 500, "An error occurred");
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const { email, password, application } = req.body;

    if (!email.trim() || !password.trim || !application.trim) {
      return sendResponse(res, 400, "All fields are required");
    }

    const findApplication = await query(
      "SELECT * FROM applications WHERE name = ?",
      [application]
    );

    if (findApplication.length < 1) {
      return sendResponse(res, 404, "Application not found");
    }

    const applicationId = findApplication[0].id;

    const findUser = await query(
      "SELECT * FROM users WHERE email = ? AND application_id = ?",
      [email, applicationId]
    );

    if (findUser.length < 1) {
      return sendResponse(res, 404, "User not found");
    }

    const user = findUser[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return sendResponse(res, 401, "Invalid email or password");
    }

    return sendResponse(res, 200, "Login successful");
  } catch (err) {
    return sendResponse(res, 500, "An error occurred");
  }
}
