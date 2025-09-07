// import { ApiError } from "../utils/ApiError.js";
// import { Document } from "../models/Document.js";
// import { Patient } from "../models/Patient.js";
// import fs from 'fs/promises';
// import path from 'path';

// class DocumentController {
//     // Upload a new document
//     async uploadDocument(req, res, next) {
//         try {
//             const { patientId, documentType, description } = req.body;
//             const file = req.file;

//             if (!file) {
//                 throw new ApiError(400, "No file uploaded");
//             }

//             // Check if patient exists
//             const patient = await Patient.findById(patientId);
//             if (!patient) {
//                 throw new ApiError(404, "Patient not found");
//             }

//             // Create document record
//             const document = await Document.create({
//                 patientId,
//                 fileName: file.filename,
//                 originalName: file.originalname,
//                 documentType,
//                 description,
//                 filePath: file.path,
//                 fileSize: file.size,
//                 mimeType: file.mimetype,
//                 uploadedBy: req.user._id
//             });

//             // Add document reference to patient
//             await Patient.findByIdAndUpdate(
//                 patientId,
//                 { $push: { documents: document._id } }
//             );

//             res.status(201).json({
//                 success: true,
//                 message: "Document uploaded successfully",
//                 document: {
//                     id: document._id,
//                     fileName: document.fileName,
//                     documentType: document.documentType,
//                     uploadDate: document.createdAt
//                 }
//             });
//         } catch (error) {
//             next(error);
//         }
//     }

//     // Get document by ID
//     async getDocument(req, res, next) {
//         try {
//             const { documentId } = req.params;
            
//             const document = await Document.findById(documentId)
//                 .populate('patientId', 'name')
//                 .populate('uploadedBy', 'name email');

//             if (!document) {
//                 throw new ApiError(404, "Document not found");
//             }

//             res.status(200).json({
//                 success: true,
//                 document
//             });
//         } catch (error) {
//             next(error);
//         }
//     }

//     // Get all documents for a patient
//     async getPatientDocuments(req, res, next) {
//         try {
//             const { patientId } = req.params;
//             const { page = 1, limit = 10, type } = req.query;

//             const query = { patientId };
//             if (type) {
//                 query.documentType = type;
//             }

//             const documents = await Document.find(query)
//                 .sort({ createdAt: -1 })
//                 .skip((page - 1) * limit)
//                 .limit(limit)
//                 .populate('uploadedBy', 'name email');

//             const total = await Document.countDocuments(query);

//             res.status(200).json({
//                 success: true,
//                 documents,
//                 pagination: {
//                     total,
//                     page: parseInt(page),
//                     pages: Math.ceil(total / limit)
//                 }
//             });
//         } catch (error) {
//             next(error);
//         }
//     }

//     // Delete document
//     async deleteDocument(req, res, next) {
//         try {
//             const { documentId } = req.params;

//             const document = await Document.findById(documentId);
//             if (!document) {
//                 throw new ApiError(404, "Document not found");
//             }

//             // Remove file from storage
//             try {
//                 await fs.unlink(document.filePath);
//             } catch (error) {
//                 console.error("Error deleting file:", error);
//             }

//             // Remove document reference from patient
//             await Patient.findByIdAndUpdate(
//                 document.patientId,
//                 { $pull: { documents: documentId } }
//             );

//             // Delete document record
//             await Document.findByIdAndDelete(documentId);

//             res.status(200).json({
//                 success: true,
//                 message: "Document deleted successfully"
//             });
//         } catch (error) {
//             next(error);
//         }
//     }

//     // Update document metadata
//     async updateDocument(req, res, next) {
//         try {
//             const { documentId } = req.params;
//             const { documentType, description } = req.body;

//             const document = await Document.findByIdAndUpdate(
//                 documentId,
//                 {
//                     $set: {
//                         documentType,
//                         description,
//                         updatedBy: req.user._id,
//                         updatedAt: new Date()
//                     }
//                 },
//                 { new: true }
//             ).populate('uploadedBy', 'name email');

//             if (!document) {
//                 throw new ApiError(404, "Document not found");
//             }

//             res.status(200).json({
//                 success: true,
//                 message: "Document updated successfully",
//                 document
//             });
//         } catch (error) {
//             next(error);
//         }
//     }

//     // Download document
//     async downloadDocument(req, res, next) {
//         try {
//             const { documentId } = req.params;

//             const document = await Document.findById(documentId);
//             if (!document) {
//                 throw new ApiError(404, "Document not found");
//             }

//             // Check if file exists
//             try {
//                 await fs.access(document.filePath);
//             } catch (error) {
//                 throw new ApiError(404, "File not found on server");
//             }

//             // Set appropriate headers
//             res.setHeader('Content-Type', document.mimeType);
//             res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);

//             // Stream the file
//             const fileStream = fs.createReadStream(document.filePath);
//             fileStream.pipe(res);
//         } catch (error) {
//             next(error);
//         }
//     }

//     // Get document statistics
//     async getDocumentStats(req, res, next) {
//         try {
//             const { patientId } = req.params;

//             const stats = await Document.aggregate([
//                 { $match: { patientId: patientId } },
//                 {
//                     $group: {
//                         _id: "$documentType",
//                         count: { $sum: 1 },
//                         totalSize: { $sum: "$fileSize" }
//                     }
//                 }
//             ]);

//             res.status(200).json({
//                 success: true,
//                 stats
//             });
//         } catch (error) {
//             next(error);
//         }
//     }
// }

// export default new DocumentController();
