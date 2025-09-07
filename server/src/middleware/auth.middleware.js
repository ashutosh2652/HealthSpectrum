import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const verifyToken = async (req, res, next) => {
  try {
    // Get token from cookies OR Authorization header
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by decoded.id
    const user = await User.findById(decoded.id)
      .select("-passwordHash")
      .populate("linkedPatients");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found."
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token."
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired."
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Please authenticate first."
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions."
      });
    }

    next();
  };
};

const checkPatientAccess = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    // linkedPatients is populated => need to check _id
    if (!req.user.linkedPatients.some((p) => p._id.toString() === patientId)) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You do not have permission to access this patient's data."
      });
    }

    next();
  } catch (error) {
    console.error("Patient Access Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

export { verifyToken, checkRole, checkPatientAccess };
