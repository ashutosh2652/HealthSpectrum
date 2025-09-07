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

// Decode the base64 API key to get username:password format
const LANDING_AI_API_KEY = process.env.LANDING_AI_API_KEY;
let decodedApiKey = LANDING_AI_API_KEY;

// If the API key is base64 encoded, decode it to get username:password
if (LANDING_AI_API_KEY && !LANDING_AI_API_KEY.includes(":")) {
    try {
        decodedApiKey = Buffer.from(LANDING_AI_API_KEY, "base64").toString(
            "utf-8"
        );
        console.log("🔑 Decoded base64 API key to username:password format");
    } catch (error) {
        console.log("🔑 Using API key as-is");
        decodedApiKey = LANDING_AI_API_KEY;
    }
}

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

        // Debug API key
        console.log("🔑 API Key configured:", !!LANDING_AI_API_KEY);
        console.log("🔑 API Key length:", LANDING_AI_API_KEY?.length || 0);
        console.log(
            "🔑 Decoded API key format:",
            decodedApiKey?.includes(":") ? "username:password" : "unknown"
        );
        if (decodedApiKey) {
            console.log("🔑 API Key username:", decodedApiKey.split(":")[0]);
        }
        if (decodedApiKey && !decodedApiKey.includes(":")) {
            console.log(
                "🔑 API Key first 10 chars:",
                LANDING_AI_API_KEY.substring(0, 10)
            );
        }

        const file = req.file;
        const {
            customName,
            includeMarginalia,
            includeMetadataInMarkdown,
            pages,
            fieldsSchema,
        } = req.body;
        console.log("Received analysis request:", req.body);

        if (!file) {
            return res.status(400).json({
                error: "No file uploaded",
            });
        }

        tempFilePath = file.path;

        // Prepare form data for LandingAI API according to documentation
        const formData = new FormData();

        // Add file based on type (exactly as per API docs)
        const fileStream = fs.createReadStream(tempFilePath);
        if (file.mimetype === "application/pdf") {
            formData.append("pdf", fileStream, {
                filename: file.originalname,
                contentType: file.mimetype,
            });
        } else {
            formData.append("image", fileStream, {
                filename: file.originalname,
                contentType: file.mimetype,
            });
        }

        // Add optional parameters as form data (as per docs)
        if (includeMarginalia !== undefined) {
            formData.append("include_marginalia", includeMarginalia.toString());
        } else {
            formData.append("include_marginalia", "true"); // Default value
        }

        if (includeMetadataInMarkdown !== undefined) {
            formData.append(
                "include_metadata_in_markdown",
                includeMetadataInMarkdown.toString()
            );
        } else {
            formData.append("include_metadata_in_markdown", "true"); // Default value
        }

        if (fieldsSchema) {
            formData.append("fields_schema", fieldsSchema);
        }

        // Build URL with query parameters for pages
        let apiUrl = LANDING_AI_API_URL;
        if (pages) {
            const urlParams = new URLSearchParams();
            urlParams.append("pages", pages);
            apiUrl = `${LANDING_AI_API_URL}?${urlParams.toString()}`;
        }

        // Call LandingAI API
        console.log("🚀 Calling LandingAI API:", apiUrl);
        console.log("🔑 Using Basic authentication with username:password");

        // Create authorization header - use Basic auth with the decoded credentials
        const authHeader = `Basic ${Buffer.from(decodedApiKey).toString("base64")}`;

        const landingAIResponse = await fetch(apiUrl, {
            method: "POST",
            headers: {
                Authorization: authHeader,
                ...formData.getHeaders(),
            },
            body: formData,
        });

        if (!landingAIResponse.ok) {
            const errorText = await landingAIResponse.text();
            console.error("❌ LandingAI API Error Response:");
            console.error(
                "   Status:",
                landingAIResponse.status,
                landingAIResponse.statusText
            );
            console.error(
                "   Headers:",
                Object.fromEntries(landingAIResponse.headers.entries())
            );
            console.error("   Body:", errorText);

            // Check if it's an authentication error
            if (
                landingAIResponse.status === 401 ||
                landingAIResponse.status === 403
            ) {
                return res.status(500).json({
                    error: "LandingAI API authentication failed",
                    message: "Invalid API key or authentication issue",
                    details: errorText,
                    status: landingAIResponse.status,
                });
            }

            throw new Error(
                `LandingAI API failed: ${landingAIResponse.status} ${landingAIResponse.statusText} - ${errorText}`
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
