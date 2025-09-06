// server/src/routes/userRoutes.js
import express from "express";

// 1️⃣ Define router
const router = express.Router();

// 2️⃣ Example routes
router.get("/", (req, res) => res.json({ message: "List of users" }));
router.get("/:id", (req, res) => res.json({ message: `User ${req.params.id}` }));

// 3️⃣ Export default
export default router;
