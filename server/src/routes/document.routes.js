// import express from 'express';
// import { verifyJWT } from '../middleware/auth.middleware.js';
// import { checkPatientPermission } from '../middleware/patient.middleware.js';
// import documentController from '../controllers/document.controller.js';
// import multer from 'multer';
// import path from 'path';

// const router = express.Router();

// // Configure multer for file upload
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/uploads/documents');
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     }
// });

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 10 * 1024 * 1024, // 10MB limit
//     },
//     fileFilter: (req, file, cb) => {
//         // Allow only specific file types
//         const allowedTypes = [
//             'application/pdf',
//             'image/jpeg',
//             'image/png',
//             'image/dicom',
//             'application/dicom'
//         ];
        
//         if (allowedTypes.includes(file.mimetype)) {
//             cb(null, true);
//         } else {
//             cb(new Error('Invalid file type. Only PDF, JPEG, PNG, and DICOM files are allowed.'));
//         }
//     }
// });

// // Protected routes (require authentication)
// router.use(verifyJWT);

// // Upload a new document
// router.post(
//     '/upload',
//     upload.single('document'),
//     documentController.uploadDocument
// );

// // Get document by ID
// router.get(
//     '/:documentId',
//     documentController.getDocument
// );

// // Get all documents for a patient
// router.get(
//     '/patient/:patientId',
//     checkPatientPermission,
//     documentController.getPatientDocuments
// );

// // Delete a document
// router.delete(
//     '/:documentId',
//     documentController.deleteDocument
// );

// // Update document metadata
// router.patch(
//     '/:documentId',
//     documentController.updateDocument
// );

// // Download a document
// router.get(
//     '/download/:documentId',
//     documentController.downloadDocument
// );

// // Get document statistics for a patient
// router.get(
//     '/stats/:patientId',
//     checkPatientPermission,
//     documentController.getDocumentStats
// );

// export default router;
