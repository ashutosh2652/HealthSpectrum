// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface AnalysisResult {
  id: string;
  fileName: string;
  customName: string;
  analysis: {
    conditions: Array<{
      name: string;
      confidence: number;
      evidence: string[];
      severity: "low" | "medium" | "high";
    }>;
    keyFindings: string[];
    recommendations: string[];
    riskLevel: "low" | "medium" | "high";
    onsetEstimate?: string;
    metadata: {
      pages: number;
      processingTime: number;
      timestamp: string;
    };
  };
  rawResponse?: any; // Original LandingAI response for debugging
}

export interface UploadProgress {
  fileId: string;
  progress: number;
  stage: "uploading" | "processing" | "analyzing" | "complete" | "error";
  message: string;
}

class ApiService {
  async analyzeDocument(
    file: File,
    customName: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("customName", customName);
    formData.append("include_marginalia", "true");
    formData.append("include_metadata_in_markdown", "true");

    try {
      // Start upload
      onProgress?.({
        fileId: file.name,
        progress: 0,
        stage: "uploading",
        message: "Uploading document...",
      });

      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      // Processing
      onProgress?.({
        fileId: file.name,
        progress: 50,
        stage: "processing",
        message: "Processing with AI...",
      });

      const result = await response.json();

      // Complete
      onProgress?.({
        fileId: file.name,
        progress: 100,
        stage: "complete",
        message: "Analysis complete!",
      });

      return result;
    } catch (error) {
      onProgress?.({
        fileId: file.name,
        progress: 0,
        stage: "error",
        message: error instanceof Error ? error.message : "Analysis failed",
      });
      throw error;
    }
  }

  async analyzeBatchDocuments(
    files: Array<{ file: File; customName: string }>,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const { file, customName } = files[i];

      try {
        const result = await this.analyzeDocument(
          file,
          customName,
          (progress) => {
            onProgress?.({
              ...progress,
              progress:
                (i / files.length) * 100 + progress.progress / files.length,
              message: `${progress.message} (${i + 1}/${files.length})`,
            });
          }
        );

        results.push(result);
      } catch (error) {
        console.error(`Failed to analyze ${file.name}:`, error);
        // Continue with other files
      }
    }

    return results;
  }
}

export const apiService = new ApiService();
