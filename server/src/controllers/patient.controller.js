import { Patient } from "../models/Patient.js";
import { User } from "../models/User.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPatient = asyncHandler(async (req, res) => {
  const { email, phone } = req.body.contactInfo || {};

  // 1. Check if patient already exists (by email or phone)
  let patient = null;
  if (email || phone) {
    patient = await Patient.findOne({
      $or: [
        { "contactInfo.email": email },
        { "contactInfo.phone": phone }
      ]
    });
  }

  if (patient) {
    // 2. If exists, link to current user (if not already linked)
    if (!req.user.linkedPatients.includes(patient._id)) {
      req.user.linkedPatients.push(patient._id);
      await req.user.save();
    }

    return res.status(200).json(
      new ApiResponse(200, patient, "Patient already exists and linked to user")
    );
  }

  // 3. Otherwise create new patient
  patient = await Patient.create(req.body);

  // 4. Link new patient to current user
  req.user.linkedPatients.push(patient._id);
  await req.user.save();

  res.status(201).json(new ApiResponse(201, patient, "Patient created and linked to user"));
});

const getPatientById = asyncHandler(async (req, res) => {
  const patientId = req.params.id;
  if (!req.user.linkedPatients.some(patient => patient._id.toString() === patientId)) {
    throw new ApiError(403, "You don't have access to this patient");
  }

  const patient = await Patient.findById(patientId);
  if (!patient) throw new ApiError(404, "Patient not found");

  res.json(new ApiResponse(200, patient, "Patient fetched"));
});

 
const updatePatient = asyncHandler(async (req, res) => {
  const patientId = req.params.id;

  if (!req.user.linkedPatients.includes(patientId)) {
    throw new ApiError(403, "You don't have access to update this patient");
  }

  const patient = await Patient.findByIdAndUpdate(patientId, req.body, {
    new: true,
  });

  if (!patient) throw new ApiError(404, "Patient not found");

  res.json(new ApiResponse(200, patient, "Patient updated"));
});

const deletePatient = asyncHandler(async (req, res) => {
  const patientId = req.params.id;

  console.log(patientId);
  if (!req.user.linkedPatients.some(patient => patient._id.toString() === patientId)) {
    throw new ApiError(403, "You don't have access to this patient");
  }

  const patient = await Patient.findByIdAndDelete(patientId);
  if (!patient) throw new ApiError(404, "Patient not found");

  // Unlink patient from all users
  await User.updateMany(
    { linkedPatients: patient._id },
    { $pull: { linkedPatients: patient._id } }
  );

  res.json(new ApiResponse(200, patient, "Patient deleted and unlinked from user"));
});


const listPatients = asyncHandler(async (req, res) => {
  // Only return patients linked to this user
  const patients = await Patient.find({
    _id: { $in: req.user.linkedPatients }
  });

  res.json(new ApiResponse(200, patients, "Linked patients fetched"));
});

export { createPatient, getPatientById, updatePatient, deletePatient, listPatients };
