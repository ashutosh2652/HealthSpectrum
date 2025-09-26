import express from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const router = express.Router();

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
        // Accept PDFs and images
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF and image files are allowed"), false);
        }
    },
});

// Helper function to convert file to base64
function fileToGenerativePart(filePath, mimeType) {
    console.log("🔄 [GEMINI-HELPER] Converting file to base64:", {
        filePath: filePath,
        mimeType: mimeType,
    });

    try {
        const fileBuffer = fs.readFileSync(filePath);
        console.log(
            "📊 [GEMINI-HELPER] File read successfully, size:",
            fileBuffer.length
        );

        const base64Data = fileBuffer.toString("base64");
        console.log(
            "✅ [GEMINI-HELPER] Base64 conversion successful, length:",
            base64Data.length
        );

        return {
            inlineData: {
                data: base64Data,
                mimeType: mimeType,
            },
        };
    } catch (error) {
        console.error("❌ [GEMINI-HELPER] File conversion failed:", error);
        throw error;
    }
}

// Middleware to log incoming requests
router.use("/analyze", (req, res, next) => {
    console.log("🚀 [GEMINI-MIDDLEWARE] Incoming request to /api/analyze");
    console.log("📋 [GEMINI-MIDDLEWARE] Request details:", {
        method: req.method,
        url: req.url,
        headers: {
            "content-type": req.headers["content-type"],
            "content-length": req.headers["content-length"],
            "user-agent": req.headers["user-agent"]?.substring(0, 50) + "...",
        },
        bodyKeys: Object.keys(req.body || {}),
        hasFile: !!req.file,
    });
    next();
});

// POST /api/analyze - Analyze document with Gemini
router.post("/analyze", upload.single("file"), async (req, res) => {
    let tempFilePath = null;

    try {
        console.log("🔍 [GEMINI] Analysis request received");
        console.log("🔍 [GEMINI] Request body:", req.body);
        console.log(
            "🔍 [GEMINI] File info:",
            req.file
                ? {
                      fieldname: req.file.fieldname,
                      originalname: req.file.originalname,
                      encoding: req.file.encoding,
                      mimetype: req.file.mimetype,
                      size: req.file.size,
                      destination: req.file.destination,
                      filename: req.file.filename,
                      path: req.file.path,
                  }
                : "No file attached"
        );

        // Check if Gemini API is configured
        if (!process.env.GEMINI_API_KEY) {
            console.error("❌ [GEMINI] API key not configured");
            return res.status(500).json({
                error: "Gemini API key not configured",
                message: "Please set GEMINI_API_KEY in environment variables",
            });
        }

        console.log(
            "🔑 [GEMINI] API key found, initializing GoogleGenerativeAI..."
        );

        // Initialize Gemini AI inside the route handler
        let genAI;
        try {
            genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            console.log(
                "✅ [GEMINI] GoogleGenerativeAI initialized successfully"
            );
        } catch (initError) {
            console.error(
                "❌ [GEMINI] Failed to initialize GoogleGenerativeAI:",
                initError
            );
            return res.status(500).json({
                error: "Gemini API initialization failed",
                message: `Failed to initialize Google Generative AI: ${initError.message}`,
            });
        }

        // Validate file upload
        if (!req.file) {
            console.error("❌ [GEMINI] No file uploaded");
            return res.status(400).json({
                error: "No file uploaded",
                message: "Please upload a PDF or image file",
            });
        }

        const { file } = req;
        const customName = req.body.customName || file.originalname;
        tempFilePath = file.path;

        console.log("📄 [GEMINI] Processing file:", {
            originalName: file.originalname,
            customName: customName,
            mimeType: file.mimetype,
            size: file.size,
            tempPath: tempFilePath,
        });

        console.log("🔍 [GEMINI] Validating file path exists...");
        if (!fs.existsSync(tempFilePath)) {
            console.error("❌ [GEMINI] Temp file not found:", tempFilePath);
            return res.status(500).json({
                error: "File processing error",
                message: "Uploaded file not found on server",
            });
        }
        console.log("✅ [GEMINI] File path validated successfully");

        console.log("🤖 [GEMINI] Initializing Gemini model...");
        // Get the Gemini model
        let model;
        try {
            model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            console.log("✅ [GEMINI] Gemini model initialized successfully");
        } catch (modelError) {
            console.error(
                "❌ [GEMINI] Failed to get Gemini model:",
                modelError
            );
            return res.status(500).json({
                error: "Model initialization failed",
                message: `Failed to initialize Gemini model: ${modelError.message}`,
            });
        }

        console.log("📝 [GEMINI] Converting file to base64...");
        // Prepare the file for Gemini
        let imagePart;
        try {
            imagePart = fileToGenerativePart(tempFilePath, file.mimetype);
            console.log("✅ [GEMINI] File converted to base64 successfully");
            console.log(
                "📊 [GEMINI] Base64 data length:",
                imagePart.inlineData.data.length
            );
        } catch (conversionError) {
            console.error(
                "❌ [GEMINI] Failed to convert file to base64:",
                conversionError
            );
            return res.status(500).json({
                error: "File conversion failed",
                message: `Failed to convert file to base64: ${conversionError.message}`,
            });
        }

        // Create detailed prompt for medical document analysis
        const prompt = `
You are a medical document analysis expert. Please analyze this medical document and extract the following information in a structured JSON format:

{
  "documentType": "string (e.g., 'Lab Report', 'Prescription', 'Medical Record', 'X-Ray Report', etc.)",
  "patientInfo": {
    "name": "string or null",
    "age": "string or null", 
    "dateOfBirth": "string or null",
    "gender": "string or null"
  },
  "dateOfDocument": "string or null",
  "medicalFindings": {
    "conditions": [
      {
        "name": "string",
        "severity": "low/medium/high or null",
        "notes": "string"
      }
    ],
    "medications": [
      {
        "name": "string",
        "dosage": "string",
        "frequency": "string",
        "instructions": "string"
      }
    ],
    "vitalSigns": [
      {
        "type": "string (e.g., 'Blood Pressure', 'Heart Rate', 'Temperature')",
        "value": "string",
        "unit": "string",
        "normalRange": "string or null"
      }
    ],
    "labResults": [
      {
        "test": "string",
        "result": "string",
        "unit": "string or null",
        "normalRange": "string or null",
        "status": "normal/abnormal/critical or null"
      }
    ]
  },
  "recommendations": ["string array of medical recommendations or advice"],
  "summary": "string - A brief 2-3 sentence summary of the document",
  "riskLevel": "low/medium/high - Overall risk assessment based on findings",
  "keyInsights": ["string array of important insights from the document"]
}

Please provide only the JSON response without any additional text or formatting. If any information is not available in the document, use null for that field.
`;

        console.log("📝 [GEMINI] Prompt prepared, length:", prompt.length);
        console.log("🚀 [GEMINI] Sending request to Gemini API...");
        console.log("📊 [GEMINI] Request details:", {
            model: "gemini-1.5-flash",
            fileType: file.mimetype,
            fileSize: file.size,
            promptLength: prompt.length,
            base64Length: imagePart.inlineData.data.length,
        });

        // Generate content with Gemini
        let result, response, text;
        try {
            console.log("🔄 [GEMINI] Calling model.generateContent...");
            result = await model.generateContent([prompt, imagePart]);
            console.log("🔄 [GEMINI] Getting response...");
            response = await result.response;
            console.log("🔄 [GEMINI] Extracting text...");
            text = response.text();
            console.log(
                "✅ [GEMINI] Successfully received response from Gemini API"
            );
        } catch (apiError) {
            console.error("❌ [GEMINI] Gemini API call failed:", apiError);
            console.error("❌ [GEMINI] Error details:", {
                name: apiError.name,
                message: apiError.message,
                stack: apiError.stack,
            });
            return res.status(500).json({
                error: "Gemini API call failed",
                message: `API request failed: ${apiError.message}`,
                details:
                    process.env.NODE_ENV === "development"
                        ? apiError.stack
                        : undefined,
            });
        }

        console.log("📄 [GEMINI] Raw response length:", text.length);
        console.log(
            "📄 [GEMINI] First 200 chars of response:",
            text.substring(0, 200) + "..."
        );

        // Try to parse the JSON response
        let analysisResult;
        try {
            console.log("🔄 [GEMINI] Parsing JSON response...");
            // Clean the response text (remove markdown formatting if present)
            const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
            console.log("🧹 [GEMINI] Cleaned text length:", cleanedText.length);
            analysisResult = JSON.parse(cleanedText);
            console.log("✅ [GEMINI] Successfully parsed JSON response");
            console.log(
                "📊 [GEMINI] Analysis result keys:",
                Object.keys(analysisResult)
            );
        } catch (parseError) {
            console.error(
                "❌ [GEMINI] Failed to parse JSON:",
                parseError.message
            );
            console.log("📄 [GEMINI] Raw text response:", text);

            // Return a structured error response
            analysisResult = {
                documentType: "Unknown",
                patientInfo: {
                    name: null,
                    age: null,
                    dateOfBirth: null,
                    gender: null,
                },
                dateOfDocument: null,
                medicalFindings: {
                    conditions: [],
                    medications: [],
                    vitalSigns: [],
                    labResults: [],
                },
                recommendations: [],
                summary:
                    "Failed to parse document analysis. The document was processed but the response format was unexpected.",
                riskLevel: "unknown",
                keyInsights: [
                    "Document analysis completed but structured data extraction failed",
                ],
                rawResponse: text,
            };
        }

        console.log("🔨 [GEMINI] Building final response structure...");
        // Create final response
        const finalResponse = {
            id: `analysis-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
            fileName: file.originalname,
            customName: customName,
            analysisDate: new Date().toISOString(),
            status: "completed",
            analysis: analysisResult,
            metadata: {
                fileSize: file.size,
                fileType: file.mimetype,
                processingTime: Date.now(),
                geminiModel: "gemini-1.5-flash",
            },
        };

        console.log("📊 [GEMINI] Final response created successfully");
        console.log("🎉 [GEMINI] Analysis completed successfully");
        console.log("📊 [GEMINI] Response summary:", {
            id: finalResponse.id,
            documentType: analysisResult.documentType,
            conditionsFound:
                analysisResult.medicalFindings?.conditions?.length || 0,
            medicationsFound:
                analysisResult.medicalFindings?.medications?.length || 0,
            riskLevel: analysisResult.riskLevel,
        });

        console.log("📤 [GEMINI] Sending response to client...");
        res.json(finalResponse);
    } catch (error) {
        console.error("❌ [GEMINI] CRITICAL ERROR - Analysis failed:");
        console.error("❌ [GEMINI] Error name:", error.name);
        console.error("❌ [GEMINI] Error message:", error.message);
        console.error("❌ [GEMINI] Error stack:", error.stack);
        console.error("❌ [GEMINI] Error details:", {
            name: error.name,
            message: error.message,
            code: error.code,
            type: typeof error,
            constructor: error.constructor.name,
        });

        console.log("📤 [GEMINI] Sending error response to client...");
        res.status(500).json({
            error: "Document analysis failed",
            message: error.message,
            errorType: error.name,
            details:
                process.env.NODE_ENV === "development"
                    ? error.stack
                    : undefined,
        });
    } finally {
        console.log("🧹 [GEMINI] Starting cleanup process...");
        // Clean up temporary file
        if (tempFilePath) {
            console.log(
                "🧹 [GEMINI] Checking if temp file exists:",
                tempFilePath
            );
            if (fs.existsSync(tempFilePath)) {
                try {
                    fs.unlinkSync(tempFilePath);
                    console.log(
                        "✅ [GEMINI] Temporary file cleaned up successfully:",
                        tempFilePath
                    );
                } catch (cleanupError) {
                    console.error(
                        "⚠️ [GEMINI] Failed to cleanup temp file:",
                        cleanupError.message
                    );
                }
            } else {
                console.log(
                    "ℹ️ [GEMINI] Temp file already removed or doesn't exist"
                );
            }
        } else {
            console.log("ℹ️ [GEMINI] No temp file path to clean up");
        }
        console.log("🏁 [GEMINI] Analysis request completed");
    }
});

// GET /api/test - Test Gemini API configuration
router.get("/test", (req, res) => {
    const hasApiKey = !!process.env.GEMINI_API_KEY;
    const apiKeyLength = process.env.GEMINI_API_KEY?.length || 0;

    res.json({
        status: "ok",
        service: "Google Gemini API",
        apiKeyConfigured: hasApiKey,
        apiKeyLength: apiKeyLength,
        model: "gemini-1.5-flash",
        message: hasApiKey
            ? "Gemini API key is configured"
            : "Gemini API key is missing",
    });
});

export default router;
