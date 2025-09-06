import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Upload as UploadIcon,
  FileText,
  FileCheck,
  Brain,
  Shield,
  ArrowRight,
  X,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { analysisApi } from "@/services/analysisApi";

interface PreviewFile {
  file: File;
  url: string;
  renamedName?: string;
  savedName?: string;
}

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<PreviewFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = (files: File[]) => {
    const newFiles: PreviewFile[] = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      renamedName: "",
      savedName: file.name,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(uploadedFiles[index].url);
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRename = (index: number, newName: string) => {
    setUploadedFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, renamedName: newName } : f))
    );
  };

  const handleSaveName = (index: number) => {
    setUploadedFiles((prev) =>
      prev.map((f, i) => {
        if (i === index) {
          const finalName = f.renamedName?.trim() ? f.renamedName : f.file.name;
          return { ...f, savedName: finalName, renamedName: "" }; // clear after save
        }
        return f;
      })
    );
  };

  const handleAnalyze = async () => {
    setIsProcessing(true);

    try {
      // Test with the first uploaded file
      if (uploadedFiles.length > 0) {
        const firstFile = uploadedFiles[0];

        console.log(
          "🧪 Testing LandingAI with file:",
          firstFile.savedName || firstFile.file.name
        );

        // Call your LandingAI API
        const result = await analysisApi.analyzeDocument({
          file: firstFile.file,
          customName: firstFile.savedName || firstFile.file.name,
          includeMarginalia: true,
          includeMetadataInMarkdown: true,
        });

        console.log("✅ LandingAI Response:", result);
        alert(
          `Analysis completed! Check console for details. Summary: ${result.summary || "No summary available"}`
        );
      } else {
        alert("No files to analyze!");
      }
    } catch (error) {
      console.error("❌ LandingAI Error:", error);
      alert(`Analysis failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    return () => {
      uploadedFiles.forEach((f) => URL.revokeObjectURL(f.url));
    };
  }, [uploadedFiles]);

  return (
    <div className="min-h-screen cosmic-bg">
      <div className="absolute inset-0 stars-pattern opacity-30"></div>
      <Navbar />
      <main className="pt-8 relative z-10">
        <section className="py-12 md:py-20 relative">
          <div className="medical-container">
            {/* Page Title */}
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

            {/* Accepted File Types */}
            <div className="w-full bg-card border border-border rounded-lg p-4 text-center mb-12">
              <p className="text-base text-muted-foreground font-medium">
                Accepted file types:{" "}
                <span className="font-semibold">PDF, JPG, PNG, DOC, DOCX</span>
              </p>
            </div>

            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-2xl mx-auto space-y-8"
            >
              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
                ${
                  dragActive
                    ? "border-primary bg-primary-soft"
                    : "border-border hover:border-primary/50 hover:bg-primary-soft/30"
                }`}
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
                      className="btn-medical-primary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadIcon className="w-5 h-5 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                </motion.div>
              </div>

              {/* Preview Section */}
              {uploadedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <h4 className="text-lg font-semibold text-foreground">
                    Uploaded Files
                  </h4>
                  <div className="space-y-3">
                    {uploadedFiles.map((pf, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col bg-card rounded-lg border border-border p-3 shadow-md"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            {pf.file.type.startsWith("image/") ? (
                              <img
                                src={pf.url}
                                alt={pf.file.name}
                                className="w-16 h-16 object-cover rounded-md border"
                              />
                            ) : pf.file.type === "application/pdf" ? (
                              <FileText className="w-8 h-8 text-accent" />
                            ) : (
                              <FileCheck className="w-8 h-8 text-accent" />
                            )}
                            <div>
                              <div className="font-medium text-foreground">
                                {pf.savedName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {(pf.file.size / 1024 / 1024).toFixed(2)} MB
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Rename Input + Save */}
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder={"Rename"}
                            value={pf.renamedName || ""}
                            onChange={(e) =>
                              handleRename(index, e.target.value)
                            }
                            className="flex-1 border rounded-md px-3 py-1 text-sm text-foreground bg-background focus:ring-2 focus:ring-primary"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSaveName(index)}
                            className="btn-medical-primary"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                        </div>

                        {pf.file.type === "application/pdf" && (
                          <iframe
                            src={pf.url}
                            title={pf.file.name}
                            className="w-full h-48 border rounded-md mt-3"
                          />
                        )}
                      </motion.div>
                    ))}
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
                        Analyzing Documents...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5 mr-2" />
                        Analyze Documents
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* Privacy Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
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
