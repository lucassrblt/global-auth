import express from "express";
import { getUsers, createUser, login } from "./controller/userController";
import {
  getApplications,
  createApplication,
} from "./controller/applicationController";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

// User
router.get("/user", getUsers);
router.post("/login", login);
router.post("/signup", createUser);

// Application
router.get("/application", getApplications);
router.post("/application", createApplication);

export default router;
