import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Patient } from "../models/Patient.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(400, "User already exists");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash });

  res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await bcrypt.compare(password, user.passwordHash || "");
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Store token in DB (overwrite previous)
  user.token = token;
  await user.save();

  // Also set token in cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { user, token }, // send token in response body too (optional)
      "Login successful"
    )
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, "User not found");

  user.token = null; // clear token
  await user.save();

  res.clearCookie("token");

  res.json(new ApiResponse(200, null, "Logout successful"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate("linkedPatients");
  if (!user) throw new ApiError(404, "User not found");

  res.json(new ApiResponse(200, user, "User profile fetched"));
});

const linkPatientToUser = asyncHandler(async (req, res) => {
  const { patientId } = req.body;
  const patient = await Patient.findById(patientId);
  if (!patient) throw new ApiError(404, "Patient not found");

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { linkedPatients: patientId } },
    { new: true }
  ).populate("linkedPatients");

  res.json(new ApiResponse(200, user, "Patient linked to user"));
});

export { registerUser, loginUser, logoutUser, getUserProfile, linkPatientToUser };
