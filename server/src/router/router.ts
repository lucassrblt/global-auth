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
router.post("/login", login);
router.post("/signup", createUser);

// Application
router.get("/application/:name", getApplication);
router.post("/application", createApplication);
router.delete("/application/:name", deleteApplication);

export default router;
