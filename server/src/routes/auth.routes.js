import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  linkPatientToUser,
} from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", asyncHandler(registerUser));
router.get("/login", asyncHandler(loginUser));
router.get("/me", verifyToken, asyncHandler(getUserProfile));
router.post("/link-patient", verifyToken, asyncHandler(linkPatientToUser));

export default router;
