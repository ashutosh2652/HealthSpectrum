import { Router } from "express";
import { uploadDocument, getDocumentById, listDocumentsByPatient, deleteDocument } from "../controllers/sourceDocument.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.use(verifyToken);

router.post("/", upload.single("file"), uploadDocument);
router.get("/:id", getDocumentById);
router.get("/patient/:patientId", listDocumentsByPatient);
router.delete("/:id", deleteDocument);

export default router;
