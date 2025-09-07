import { Patient } from "../models/Patient.js";
import { ApiError } from "../utils/ApiError.js";

// Middleware to validate and sanitize patient data
const validatePatientData = (req, res, next) => {
  try {
    const {
      name,
      gender,
      dob,
      contactInfo,
      bloodGroup,
      heightCm,
      weightKg,
      maritalStatus,
    } = req.body;

    // Required fields validation
    if (!name || !gender) {
      throw new ApiError(400, "Name and gender are required fields");
    }

    // Gender validation
    if (!["male", "female", "other"].includes(gender.toLowerCase())) {
      throw new ApiError(400, "Invalid gender value");
    }

    // Age validation
    // if (age && (isNaN(age) || age < 0 || age > 150)) {
    //   throw new ApiError(400, "Invalid age value");
    // }

    // Contact info validation
    if (contactInfo) {
      if (contactInfo.email && !isValidEmail(contactInfo.email)) {
        throw new ApiError(400, "Invalid email format");
      }
      if (contactInfo.phone && !isValidPhone(contactInfo.phone)) {
        throw new ApiError(400, "Invalid phone number format");
      }
    }

    // Blood group validation
    if (bloodGroup && !isValidBloodGroup(bloodGroup)) {
      throw new ApiError(400, "Invalid blood group");
    }

    // Height and weight validation
    if (heightCm && (isNaN(heightCm) || heightCm < 0 || heightCm > 300)) {
      throw new ApiError(400, "Invalid height value");
    }
    if (weightKg && (isNaN(weightKg) || weightKg < 0 || weightKg > 700)) {
      throw new ApiError(400, "Invalid weight value");
    }
    if (maritalStatus && !isValidmaritalStatus(maritalStatus)) {
      throw new ApiError(400, "Invalid marital Status");
    }

    // Sanitize the data
    req.sanitizedPatientData = {
      name: sanitizeString(name),
      gender: gender.toLowerCase(),
      // ...(age && { age: parseInt(age) }),
      ...(dob && { dob: new Date(dob) }),
      ...(contactInfo && {
        contactInfo: {
          ...(contactInfo.email && { email: contactInfo.email.toLowerCase() }),
          ...(contactInfo.phone && { phone: sanitizeString(contactInfo.phone) }),
          ...(contactInfo.address && { address: sanitizeString(contactInfo.address) }),
        },
      }),
      ...(bloodGroup && { bloodGroup: bloodGroup.toUpperCase() }),
      ...(heightCm && { heightCm: parseFloat(heightCm) }),
      ...(weightKg && { weightKg: parseFloat(weightKg) }),
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check if patient exists
const checkPatientExists = async (req, res, next) => {
  try {
    const patientId = req.params.patientId;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      throw new ApiError(404, "Patient not found");
    }

    req.patient = patient;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check if user has permission to access patient data
const checkPatientPermission = async (req, res, next) => {
  try {
    const patientId = req.params.patientId;
    const userId = req.user._id;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new ApiError(404, "Patient not found");
    }

    // Check if user has permission to access this patient
    const hasPermission = req.user.linkedPatients.some(
      (id) => id.toString() === patientId
    );

    if (!hasPermission) {
      throw new ApiError(403, "You don't have permission to access this patient's data");
    }

    req.patient = patient;
    next();
  } catch (error) {
    next(error);
  }
};

// Helper functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

const isValidBloodGroup = (bloodGroup) => {
  const validGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  return validGroups.includes(bloodGroup.toUpperCase());
};
const isValidmaritalStatus = (maritalStatus) => {
  const validGroups = ["Single", "Married", "Divorced", "Widowed"];
  return validGroups.includes(maritalStatus);
};

const sanitizeString = (str) => {
  return str.trim().replace(/[<>]/g, ''); // Basic XSS prevention
};

// Middleware to calculate and add health metrics
const addHealthMetrics = (req, res, next) => {
  try {
    const { heightCm, weightKg } = req.sanitizedPatientData || req.body;

    if (heightCm && weightKg) {
      // Calculate BMI
      const heightM = heightCm / 100;
      const bmi = weightKg / (heightM * heightM);
      req.healthMetrics = {
        bmi: parseFloat(bmi.toFixed(1)),
        bmiCategory: getBMICategory(bmi),
      };
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Helper function for BMI category
const getBMICategory = (bmi) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

export {
  validatePatientData,
  checkPatientExists,
  checkPatientPermission,
  addHealthMetrics,
};
