import crypto from "crypto";

import { query } from "./dbController";
import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../response/responseHandler";
import bcrypt from "bcrypt";

interface Application {
  id: number;
  name: string;
  password: string;
  public_key: string;
  secret_key?: string;
  created_at: string;
}

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

    // Create public and private keys
    let { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    publicKey = publicKey.split("\n").slice(1, -2).join("");
    privateKey = privateKey.split("\n").slice(1, -2).join("");

    await query(
      "INSERT INTO applications (name, public_key, private_key) VALUES (?, ?, ?)",
      [name, publicKey, privateKey]
    );

    return sendResponse(res, 201, "Application created successfully", {
      publicKey,
    });
  } catch (err) {
    return sendResponse(res, 500, "An error occurred");
  }
}

export async function deleteApplication(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const name = req.params.name;

    if (!name) {
      return sendResponse(res, 400, "An application name is required");
    }

    const application: Application[] = await getApplicationByName(name);

    if (application.length < 1) {
      return sendResponse(res, 404, "Application not found");
    }

    await query("DELETE FROM applications WHERE name = ?", [name]);

    return sendResponse(res, 200, "Application deleted successfully");
  } catch (err) {
    return sendResponse(res, 500, "An error occurred");
  }
}
export async function getApplication(
  req: Request,
  res: Response,
  next?: NextFunction
): Promise<any> {
  try {
    const name = req.params.name;

    if (!name) {
      return sendResponse(
        res,
        400,
        "Missing password's application or name's application"
      );
    }

    const application: Application[] = await getApplicationByName(name);

    if (application.length < 1) {
      return sendResponse(res, 200, "No applications found");
    }

    // const valid = await bcrypt.compare(password, application[0].password);

    // if (!valid) {
    //   sendResponse(res, 401, "Invalid password");
    // }

    return sendResponse(res, 200, "Application find", application);
  } catch (err) {
    return sendResponse(res, 500, "An error occurred");
  }
}

const getAllApplications = async (res: Response): Promise<Application[]> => {
  try {
    const value = await query(
      "SELECT id, name, public_key, created_at FROM applications"
    );
    return value;
  } catch (err) {
    throw new Error("An error occurred");
  }
};

const getApplicationByName = async (name: string): Promise<Application[]> => {
  try {
    return await query(
      "SELECT id, name, public_key, created_at FROM applications WHERE name = ?",
      [name]
    );
  } catch (err) {
    throw new Error("An error occurred");
  }
};

export const getApplicationByPublicKey = async (
  publicKey: string
): Promise<Application[]> => {
  try {
    return await query("SELECT * FROM applications WHERE public_key = ?", [
      publicKey,
    ]);
  } catch (err) {
    throw new Error("An error occurred");
  }
};
