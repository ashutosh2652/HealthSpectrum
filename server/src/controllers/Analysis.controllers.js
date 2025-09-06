import multer from "multer";
import FormData from "form-data";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), "public", "temp");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                "-" +
                uniqueSuffix +
                path.extname(file.originalname)
        );
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept PDF and image files
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Invalid file type. Only PDF and image files are allowed."
                )
            );
        }
    },
});

// LandingAI API configuration
const LANDING_AI_API_URL =
    process.env.LANDING_AI_EU_ENDPOINT === "true"
        ? "https://api.va.eu-west-1.landing.ai/v1/tools/agentic-document-analysis"
        : "https://api.va.landing.ai/v1/tools/agentic-document-analysis";

const LANDING_AI_API_KEY = process.env.LANDING_AI_API_KEY;

// Helper function to parse medical insights from markdown
function parseMedicalInsights(markdown, extractedSchema) {
    const insights = {
        conditions: [],
        medications: [],
        vitalSigns: [],
        recommendations: [],
        summary: "",
        riskLevel: "low",
    };

    try {
        // Extract from structured schema if available
        if (extractedSchema) {
            if (extractedSchema.conditions) {
                insights.conditions = extractedSchema.conditions.map(
                    (cond) => ({
                        name: cond.name || "",
                        confidence: cond.severity ? 0.8 : 0.6,
                        evidence: cond.evidence || [],
                        location: null,
                    })
                );
            }

            if (extractedSchema.medications) {
                insights.medications = extractedSchema.medications.map(
                    (med) => ({
                        name: med.name || "",
                        dosage: med.dosage || "",
                        frequency: med.frequency || "",
                        evidence: [],
                        location: null,
                    })
                );
            }

            if (extractedSchema.vital_signs) {
                Object.entries(extractedSchema.vital_signs).forEach(
                    ([type, value]) => {
                        if (value) {
                            insights.vitalSigns.push({
                                type: type.replace("_", " "),
                                value: value.toString(),
                                unit: "",
                                date: "",
                                evidence: [],
                                location: null,
                            });
                        }
                    }
                );
            }
        }

        // Parse from markdown content
        const lines = markdown.split("\n");
        let currentSection = "";

        lines.forEach((line) => {
            const cleanLine = line.trim();

            // Detect sections
            if (
                cleanLine.toLowerCase().includes("condition") ||
                cleanLine.toLowerCase().includes("diagnosis")
            ) {
                currentSection = "conditions";
            } else if (
                cleanLine.toLowerCase().includes("medication") ||
                cleanLine.toLowerCase().includes("prescription")
            ) {
                currentSection = "medications";
            } else if (
                cleanLine.toLowerCase().includes("vital") ||
                cleanLine.toLowerCase().includes("blood pressure") ||
                cleanLine.toLowerCase().includes("heart rate")
            ) {
                currentSection = "vitals";
            } else if (
                cleanLine.toLowerCase().includes("recommendation") ||
                cleanLine.toLowerCase().includes("advice")
            ) {
                currentSection = "recommendations";
            }

            // Extract recommendations
            if (
                cleanLine.startsWith("•") ||
                cleanLine.startsWith("-") ||
                cleanLine.startsWith("*")
            ) {
                if (currentSection === "recommendations") {
                    insights.recommendations.push(
                        cleanLine.replace(/^[•\-*]\s*/, "")
                    );
                }
            }
        });

        // Generate summary (first 200 chars of meaningful content)
        const meaningfulContent = markdown
            .replace(/#{1,6}\s+/g, "") // Remove headers
            .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1") // Remove bold/italic
            .trim();

        insights.summary =
            meaningfulContent.length > 200
                ? meaningfulContent.substring(0, 200) + "..."
                : meaningfulContent;

        // Determine risk level based on content
        const riskKeywords = {
            high: [
                "critical",
                "severe",
                "urgent",
                "emergency",
                "abnormal",
                "elevated",
            ],
            medium: [
                "moderate",
                "concerning",
                "follow-up",
                "monitor",
                "borderline",
            ],
        };

        const lowerContent = markdown.toLowerCase();
        if (
            riskKeywords.high.some((keyword) => lowerContent.includes(keyword))
        ) {
            insights.riskLevel = "high";
        } else if (
            riskKeywords.medium.some((keyword) =>
                lowerContent.includes(keyword)
            )
        ) {
            insights.riskLevel = "medium";
        }
    } catch (error) {
        console.error("Error parsing medical insights:", error);
    }

    return insights;
}

// Analyze document endpoint
export const analyzeDocument = async (req, res) => {
    let tempFilePath = null;

    try {
        if (!LANDING_AI_API_KEY) {
            return res.status(500).json({
                error: "LandingAI API key not configured",
            });
        }

        const file = req.file;
        const {
            customName,
            includeMarginalia,
            includeMetadataInMarkdown,
            pages,
            fieldsSchema,
        } = req.body;

        if (!file) {
            return res.status(400).json({
                error: "No file uploaded",
            });
        }

        tempFilePath = file.path;

        // Prepare form data for LandingAI API
        const formData = new FormData();

        // Add file based on type
        const fileStream = fs.createReadStream(tempFilePath);
        if (file.mimetype === "application/pdf") {
            formData.append("pdf", fileStream);
        } else {
            formData.append("image", fileStream);
        }

        // Add optional parameters
        if (includeMarginalia !== undefined) {
            formData.append("include_marginalia", includeMarginalia);
        }
        if (includeMetadataInMarkdown !== undefined) {
            formData.append(
                "include_metadata_in_markdown",
                includeMetadataInMarkdown
            );
        }
        if (pages) {
            formData.append("pages", pages);
        }
        if (fieldsSchema) {
            formData.append("fields_schema", fieldsSchema);
        }

        // Call LandingAI API
        const landingAIResponse = await fetch(LANDING_AI_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${LANDING_AI_API_KEY}`,
                ...formData.getHeaders(),
            },
            body: formData,
        });

        if (!landingAIResponse.ok) {
            const errorText = await landingAIResponse.text();
            console.error("LandingAI API Error:", errorText);
            throw new Error(
                `LandingAI API failed: ${landingAIResponse.status} ${landingAIResponse.statusText}`
            );
        }

        const landingAIData = await landingAIResponse.json();

        // Parse medical insights
        const medicalInsights = parseMedicalInsights(
            landingAIData.data.markdown,
            landingAIData.data.extracted_schema
        );

        // Create normalized response
        const analysisResult = {
            id: `analysis-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
            fileName: file.originalname,
            customName: customName || file.originalname,
            analysisDate: new Date().toISOString(),
            status: "completed",

            // Document info
            reportType:
                file.mimetype === "application/pdf"
                    ? "PDF Document"
                    : "Image Document",
            fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,

            // Main content
            markdown: landingAIData.data.markdown,
            rawData: landingAIData,

            // Extracted medical insights
            conditions: medicalInsights.conditions,
            medications: medicalInsights.medications,
            vitalSigns: medicalInsights.vitalSigns,
            recommendations: medicalInsights.recommendations,
            riskLevel: medicalInsights.riskLevel,
            summary: medicalInsights.summary,

            // Metadata
            pageCount: landingAIData.data.chunks?.length || 1,
            processingTime: Date.now(), // You might want to track actual processing time
            errors: landingAIData.errors || [],
        };

        res.json(analysisResult);
    } catch (error) {
        console.error("Analysis error:", error);

        res.status(500).json({
            error: "Analysis failed",
            message: error.message,
            details: error.stack,
        });
    } finally {
        // Clean up temporary file
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            try {
                fs.unlinkSync(tempFilePath);
            } catch (cleanupError) {
                console.error("Failed to cleanup temp file:", cleanupError);
            }
        }
    }
};

// Export multer middleware
export const uploadMiddleware = upload.single("file");
