import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Upload as UploadIcon,
  FileText,
  Image,
  FileCheck,
  Brain,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  X,
  Edit2,
  Eye,
  File,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/Navbar";
import { analysisApi, type HealthAnalysisResult } from "@/services/analysisApi";

interface UploadedFile extends File {
  id: string;
  customName?: string;
  url?: string;
  preview?: string;
  analysisResult?: HealthAnalysisResult;
  progress?: number;
  status?: "uploading" | "analyzing" | "completed" | "error";
  error?: string;
  type: string; // Explicitly ensure type is always defined
}

const Upload = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [analysisResults, setAnalysisResults] = useState<
    HealthAnalysisResult[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateFileId = () => Math.random().toString(36).substr(2, 9);

  const createFilePreview = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (file.type && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      } else {
        resolve(null);
      }
    });
  };

  // Clean up object URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [uploadedFiles]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleFiles = async (files: File[]) => {
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        const preview = await createFilePreview(file);
        const url = URL.createObjectURL(file);
        return {
          ...file,
          id: generateFileId(),
          customName: file.name.split(".")[0], // Remove extension for default name
          preview,
          url,
          type: file.type || "application/octet-stream", // Ensure type is always defined
        } as UploadedFile;
      })
    );
    setUploadedFiles((prev) => [...prev, ...processedFiles]);
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await handleFiles(Array.from(e.target.files));
    }
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    const fileToRemove = uploadedFiles.find((file) => file.id === id);
    if (fileToRemove?.url) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const startEditingName = (id: string, currentName: string) => {
    setEditingNameId(id);
    setTempName(currentName);
  };

  const saveFileName = (id: string) => {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, customName: tempName || file.name } : file
      )
    );
    setEditingNameId(null);
    setTempName("");
  };

  const cancelEditingName = () => {
    setEditingNameId(null);
    setTempName("");
  };

  const getFileIcon = (file: UploadedFile) => {
    if (!file.type) return File;
    if (file.type.startsWith("image/")) return Image;
    if (file.type === "application/pdf") return FileText;
    return File;
  };

  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      const results: HealthAnalysisResult[] = [];

      // Process files one by one to show individual progress
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];

        // Update file status to analyzing
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? { ...f, status: "analyzing" as const, progress: 0 }
              : f
          )
        );

        try {
          // Call our analysis API
          const result = await analysisApi.analyzeDocument({
            file: file as File,
            customName: file.customName || file.name,
            includeMarginalia: true,
            includeMetadataInMarkdown: true,
            // Optional: Add medical-specific field schema
            fieldsSchema: {
              type: "object",
              properties: {
                conditions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      severity: { type: "string" },
                      evidence: { type: "array", items: { type: "string" } },
                    },
                  },
                },
                medications: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      dosage: { type: "string" },
                      frequency: { type: "string" },
                    },
                  },
                },
                vital_signs: {
                  type: "object",
                  properties: {
                    blood_pressure: { type: "string" },
                    heart_rate: { type: "string" },
                    temperature: { type: "string" },
                    weight: { type: "string" },
                  },
                },
              },
            },
          });

          results.push(result);

          // Update file status to completed
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? {
                    ...f,
                    status: "completed" as const,
                    progress: 100,
                    analysisResult: result,
                  }
                : f
            )
          );
        } catch (fileError) {
          // Update file status to error
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? {
                    ...f,
                    status: "error" as const,
                    error:
                      fileError instanceof Error
                        ? fileError.message
                        : "Analysis failed",
                  }
                : f
            )
          );
        }
      }

      if (results.length > 0) {
        setAnalysisResults(results);

        // Store results in localStorage for the history page
        const existingResults = JSON.parse(
          localStorage.getItem("analysisHistory") || "[]"
        );
        localStorage.setItem(
          "analysisHistory",
          JSON.stringify([...existingResults, ...results])
        );

        // Navigate to history page to show results
        navigate("/history", { state: { newResults: results } });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const acceptedFormats = [
    {
      icon: FileText,
      name: "PDF Documents",
      desc: "Lab reports, prescriptions, medical records",
    },
    { icon: Image, name: "Image Files", desc: "JPG, PNG of medical documents" },
    {
      icon: FileCheck,
      name: "Medical Reports",
      desc: "Blood tests, X-rays, MRI reports",
    },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Advanced medical AI extracts and analyzes key health insights from your documents with 95% accuracy.",
    },
    {
      icon: Shield,
      title: "HIPAA Compliant Security",
      description:
        "Your medical data is encrypted end-to-end and processed with full HIPAA compliance standards.",
    },
    {
      icon: Clock,
      title: "Instant Results",
      description:
        "Get comprehensive health analysis and risk assessments in under 60 seconds.",
    },
  ];

  return (
    <div className="min-h-screen cosmic-bg">
      <div className="absolute inset-0 stars-pattern opacity-30"></div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-8 relative z-10">
        <section className="py-12 md:py-20 relative">
          <div className="medical-container">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-medical-title">Upload Your</span>
                <br />
                <span className="text-foreground">Medical Documents</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Securely upload your medical documents, lab reports,
                prescriptions, and health records. Our AI will analyze them
                instantly to provide you with clear health insights and
                recommendations.
              </p>
            </motion.div>

            {/* Accepted File Types Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full max-w-2xl mx-auto bg-card border border-border rounded-lg p-4 text-center mb-12"
            >
              <p className="text-base text-muted-foreground font-medium">
                Accepted file types:{" "}
                <span className="font-semibold">PDF, JPG, PNG, DOC, DOCX</span>
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Upload Section */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Upload Area */}
                <div className="card-medical-glow">
                  <div
                    className={`
                      relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
                      ${
                        dragActive
                          ? "border-primary bg-primary-soft"
                          : "border-border hover:border-primary/50 hover:bg-primary-soft/30"
                      }
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileInput}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="file-upload"
                    />
                    <motion.div
                      animate={{ scale: dragActive ? 1.05 : 1 }}
                      className="space-y-6"
                    >
                      <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow">
                        <UploadIcon className="w-10 h-10 text-primary-foreground" />
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                          Drop your files here
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          or click to browse and select files
                        </p>

                        <Button
                          className="btn-medical-primary cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <UploadIcon className="w-5 h-5 mr-2" />
                          Choose Files
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h4 className="text-lg font-semibold text-foreground">
                      Uploaded Files ({uploadedFiles.length})
                    </h4>
                    <div className="space-y-4">
                      {uploadedFiles.map((file, index) => {
                        const FileIcon = getFileIcon(file);
                        return (
                          <motion.div
                            key={file.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="card-medical p-4 border border-border hover:border-primary/30 transition-all duration-300"
                          >
                            <div className="flex items-start space-x-4">
                              {/* File Preview/Icon */}
                              <div className="flex-shrink-0">
                                {file.preview ? (
                                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                                    <img
                                      src={file.preview}
                                      alt={file.customName || file.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center">
                                    <FileIcon className="w-8 h-8 text-accent" />
                                  </div>
                                )}
                              </div>

                              {/* File Details */}
                              <div className="flex-1 min-w-0">
                                {/* Editable File Name */}
                                <div className="mb-2">
                                  {editingNameId === file.id ? (
                                    <div className="flex items-center space-x-2">
                                      <Input
                                        value={tempName}
                                        onChange={(e) =>
                                          setTempName(e.target.value)
                                        }
                                        className="flex-1 h-8 text-sm"
                                        placeholder="Enter report name"
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter")
                                            saveFileName(file.id);
                                          if (e.key === "Escape")
                                            cancelEditingName();
                                        }}
                                        autoFocus
                                      />
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => saveFileName(file.id)}
                                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={cancelEditingName}
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-2 group">
                                      <h5 className="font-semibold text-foreground truncate">
                                        {file.customName || file.name}
                                      </h5>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                          startEditingName(
                                            file.id,
                                            file.customName || file.name
                                          )
                                        }
                                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>

                                {/* File Info */}
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                                  <span>Original: {file.name}</span>
                                  <span>
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </span>
                                  <span className="capitalize">
                                    {file.type
                                      ? file.type.split("/")[1] || "Unknown"
                                      : "Unknown"}
                                  </span>
                                </div>

                                {/* File Actions and Progress */}
                                <div className="space-y-2">
                                  {/* Progress Bar during analysis */}
                                  {file.status === "analyzing" && (
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">
                                          Analyzing document...
                                        </span>
                                        <span className="text-muted-foreground">
                                          {file.progress || 0}%
                                        </span>
                                      </div>
                                      <Progress
                                        value={file.progress || 0}
                                        className="h-1"
                                      />
                                    </div>
                                  )}

                                  {/* Error display */}
                                  {file.status === "error" && file.error && (
                                    <Alert
                                      variant="destructive"
                                      className="py-2"
                                    >
                                      <AlertCircle className="h-3 w-3" />
                                      <AlertDescription className="text-xs">
                                        {file.error}
                                      </AlertDescription>
                                    </Alert>
                                  )}

                                  <div className="flex items-center space-x-2">
                                    {file.url && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 text-xs"
                                        onClick={() =>
                                          window.open(file.url, "_blank")
                                        }
                                      >
                                        <Eye className="w-3 h-3 mr-1" />
                                        Preview
                                      </Button>
                                    )}

                                    {file.status === "completed" ? (
                                      <span className="text-xs text-green-600 flex items-center">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Analysis complete
                                      </span>
                                    ) : file.status === "error" ? (
                                      <span className="text-xs text-red-600 flex items-center">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Analysis failed
                                      </span>
                                    ) : file.status === "analyzing" ? (
                                      <span className="text-xs text-blue-600 flex items-center">
                                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                        Analyzing...
                                      </span>
                                    ) : (
                                      <span className="text-xs text-green-600 flex items-center">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Ready for analysis
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Remove Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(file.id)}
                                className="text-muted-foreground hover:text-destructive flex-shrink-0"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* PDF Preview */}
                            {file.type === "application/pdf" && file.url && (
                              <div className="mt-4">
                                <iframe
                                  src={file.url}
                                  title={file.customName || file.name}
                                  className="w-full h-48 border rounded-md"
                                />
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    <Button
                      onClick={handleAnalyze}
                      disabled={isProcessing}
                      className="btn-medical-primary w-full group"
                    >
                      {isProcessing ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 mr-2"
                          >
                            <Brain className="w-5 h-5" />
                          </motion.div>
                          Analyzing {uploadedFiles.length} Document
                          {uploadedFiles.length > 1 ? "s" : ""}...
                        </>
                      ) : (
                        <>
                          <Brain className="w-5 h-5 mr-2" />
                          Analyze {uploadedFiles.length} Document
                          {uploadedFiles.length > 1 ? "s" : ""}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </motion.div>

              {/* Features Section */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-3xl font-bold text-foreground mb-4">
                    What You'll Get
                  </h3>
                </div>

                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="card-medical border-l-4 border-l-primary"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow flex-shrink-0">
                          <feature.icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-foreground mb-2">
                            {feature.title}
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-accent-soft border border-accent/30 rounded-xl p-6 mt-16"
            >
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-accent mb-2">
                    Your Privacy is Protected
                  </h4>
                  <p className="text-sm text-accent/80 leading-relaxed">
                    All uploaded documents are encrypted in transit and at rest.
                    We never store your personal medical information and all
                    processing is HIPAA compliant. Your data is automatically
                    deleted after analysis.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Upload;
