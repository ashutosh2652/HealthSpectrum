// Analysis API service for LandingAI integration
export interface AnalysisRequest {
  file: File;
  customName: string;
  includeMarginalia?: boolean;
  includeMetadataInMarkdown?: boolean;
  pages?: string;
  fieldsSchema?: object;
}

export interface AnalysisChunk {
  text: string;
  grounding: Array<{
    box: {
      l: number;
      t: number;
      r: number;
      b: number;
    };
    page: number;
  }>;
  chunk_type: string;
  chunk_id: string;
}

export interface AnalysisError {
  page_num: number;
  error: string;
  error_code: number;
}

export interface LandingAIResponse {
  data: {
    markdown: string;
    extracted_schema?: object;
    extraction_metadata?: object;
    chunks: AnalysisChunk[];
  };
  errors: AnalysisError[];
  extraction_error?: string;
}

// Normalized format for your app
export interface HealthAnalysisResult {
  id: string;
  fileName: string;
  customName: string;
  analysisDate: string;
  status: "completed" | "processing" | "error";

  // Document info
  reportType?: string;
  fileSize?: string;

  // Main content
  markdown: string;
  rawData: LandingAIResponse;

  // Extracted medical insights (parsed from markdown/schema)
  conditions: Array<{
    name: string;
    confidence: number;
    evidence: string[];
    location?: { page: number; box: any };
  }>;

  medications: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
    evidence: string[];
    location?: { page: number; box: any };
  }>;

  vitalSigns: Array<{
    type: string;
    value: string;
    unit?: string;
    date?: string;
    evidence: string[];
    location?: { page: number; box: any };
  }>;

  recommendations: string[];
  riskLevel: "low" | "medium" | "high";
  summary: string;

  // Metadata
  pageCount: number;
  processingTime: number;
  errors: AnalysisError[];
}

export const analysisApi = {
  // Analyze document
  async analyzeDocument(
    request: AnalysisRequest
  ): Promise<HealthAnalysisResult> {
    const formData = new FormData();

    // Add file
    formData.append("file", request.file);
    formData.append("customName", request.customName);

    // Add optional parameters
    if (request.includeMarginalia !== undefined) {
      formData.append(
        "includeMarginalia",
        request.includeMarginalia.toString()
      );
    }
    if (request.includeMetadataInMarkdown !== undefined) {
      formData.append(
        "includeMetadataInMarkdown",
        request.includeMetadataInMarkdown.toString()
      );
    }
    if (request.pages) {
      formData.append("pages", request.pages);
    }
    if (request.fieldsSchema) {
      formData.append("fieldsSchema", JSON.stringify(request.fieldsSchema));
    }

    const response = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Analysis failed: ${response.statusText}`
      );
    }

    return response.json();
  },

  // Get analysis history
  async getAnalysisHistory(): Promise<HealthAnalysisResult[]> {
    const response = await fetch("/api/analysis/history");

    if (!response.ok) {
      throw new Error("Failed to fetch analysis history");
    }

    return response.json();
  },

  // Get specific analysis by ID
  async getAnalysis(id: string): Promise<HealthAnalysisResult> {
    const response = await fetch(`/api/analysis/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch analysis");
    }

    return response.json();
  },
};
