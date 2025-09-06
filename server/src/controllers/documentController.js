import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// ========================
// Upload + Extract
// ========================
export const extractDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    // Call LandingAI OCR API
    const apiRes = await fetch("https://api.landing.ai/ade/v1/extract", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LANDINGAI_API_KEY}`,
      },
      body: fs.createReadStream(filePath),
    });

    if (!apiRes.ok) {
      const text = await apiRes.text();
      throw new Error(`LandingAI API error: ${text}`);
    }

    const result = await apiRes.json();

    // Save results locally
    const resultsDir = path.resolve("./results");
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    const outFile = path.join(resultsDir, `${req.file.originalname}.json`);
    fs.writeFileSync(outFile, JSON.stringify(result, null, 2));

    res.json({
      success: true,
      message: "Document extracted successfully",
      data: result,
    });
  } catch (error) {
    console.error("❌ Extraction Error:", error);
    res.status(500).json({ error: "Document extraction failed" });
  }
};

// ========================
// Get OCR Text (from saved file)
// ========================
export const getOcrText = async (req, res) => {
  try {
    const { id } = req.params; // id = filename
    const filePath = path.resolve(`./results/${id}.json`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "OCR text not found" });
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const ocrText = JSON.stringify(data, null, 2); // adapt if LandingAI returns text field

    res.json({ ocrText });
  } catch (error) {
    console.error("❌ Get OCR Error:", error);
    res.status(500).json({ error: "Failed to get OCR text" });
  }
};

// ========================
// Status (dummy, since LandingAI is synchronous)
// ========================
export const getStatus = (req, res) => {
  res.json({ status: "done", stageETASeconds: 0 });
};

// ========================
// Cancel + Retry (placeholders)
// ========================
export const cancelProcessing = (req, res) => {
  res.json({ message: "Cancel not supported with LandingAI API" });
};

export const retryProcessing = (req, res) => {
  res.json({ message: "Retry not supported with LandingAI API" });
};
