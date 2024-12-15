import express from "express";
import { getUsers, createUser, login } from "../controller/userController";
import {
  getApplication,
  createApplication,
  deleteApplication,
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
router.get("/application", getApplication);
router.post("/application", createApplication);
router.delete("/application/:name", deleteApplication);

export default router;
