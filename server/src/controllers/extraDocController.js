import { SourceDocument } from "../models/SourceDocument.js";

// Upload a new document
export const uploadDocument = async (req, res) => {
  try {
    const { patientId, fileName, fileType, documentDate, storageUrl, metadata } = req.body;

    const newDocument = await SourceDocument.create({
      patientId,
      fileName,
      fileType,
      documentDate: documentDate || new Date(),
      storageUrl,
      metadata,
      processingStatus: 'pending'
    });

    res.status(201).json({
      success: true,
      data: newDocument
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get a document by ID
export const getDocumentById = async (req, res) => {
  try {
    const document = await SourceDocument.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// List all documents for a patient
export const listDocumentsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { type, status, sort = '-createdAt' } = req.query;

    let query = { patientId, isArchived: false };
    
    if (type) query.fileType = type;
    if (status) query.processingStatus = status;

    const documents = await SourceDocument.find(query)
      .sort(sort)
      .populate('patientId', 'name');

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete a document by ID
export const deleteDocument = async (req, res) => {
  try {
    const document = await SourceDocument.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    // Soft delete by marking as archived
    document.isArchived = true;
    await document.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
