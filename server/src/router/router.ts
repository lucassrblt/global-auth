import express from "express";
import { getUsers, createUser, login } from "../controller/userController";
import {
  getApplications,
  createApplication,
} from "../controller/applicationController";
import { authMiddleware } from "../middleware/middleware";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

// User
router.get("/user", authMiddleware, getUsers);
router.post("/login", authMiddleware, login);
router.post("/signup", authMiddleware, createUser);

// Application
router.get("/application/:name", getApplications);
router.post("/application", createApplication);

export default router;
