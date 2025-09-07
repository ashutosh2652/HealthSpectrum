import { Router } from "express";
import {
  createPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  listPatients,
} from "../controllers/patient.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/",verifyToken, createPatient);
router.get("/",verifyToken, listPatients);
router.get("/:id",verifyToken, getPatientById);
router.put("/:id",verifyToken, updatePatient);
router.delete("/:id",verifyToken, deletePatient);

export default router;
