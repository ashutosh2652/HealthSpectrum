import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Upload as UploadIcon,
  FileText,
  Image,
  FileCheck,
  Brain,
  Shield,
  Clock,
  ArrowRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

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
      const files = Array.from(e.dataTransfer.files);
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔹 Send uploaded files to backend
  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0) return;
    setIsProcessing(true);

    try {
      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append("file", file);
      });

      const res = await fetch("http://localhost:5000/api/documents/extract", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to analyze documents");
      }

      const data = await res.json();
      console.log("✅ Extracted Data:", data);
      alert("Extraction successful! Check console for results.");
    } catch (error) {
      console.error("❌ Error analyzing documents:", error);
      alert("Error analyzing documents. Please try again.");
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
      <Navbar />

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Upload Section */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
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

                        <input
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={handleFileInput}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload">
                          <Button className="btn-medical-primary cursor-pointer">
                            <UploadIcon className="w-5 h-5 mr-2" />
                            Choose Files
                          </Button>
                        </label>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Accepted Formats */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-foreground">
                    Accepted File Types
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {acceptedFormats.map((format, index) => (
                      <motion.div
                        key={format.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center space-x-4 p-4 bg-muted/30 rounded-xl border border-border/50"
                      >
                        <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                          <format.icon className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {format.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format.desc}
                          </div>
                        </div>
                      </motion.div>
                    ))}
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
                      Uploaded Files
                    </h4>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-3 bg-card rounded-lg border border-border"
                        >
                          <div className="flex items-center space-x-3">
                            <FileCheck className="w-5 h-5 text-accent" />
                            <div>
                              <div className="font-medium text-foreground">
                                {file.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
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

                {/* Security Notice */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-accent-soft border border-accent/30 rounded-xl p-6"
                >
                  <div className="flex items-start space-x-3">
                    <Shield className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-accent mb-2">
                        Your Privacy is Protected
                      </h4>
                      <p className="text-sm text-accent/80 leading-relaxed">
                        All uploaded documents are encrypted in transit and at
                        rest. We never store your personal medical information
                        and all processing is HIPAA compliant. Your data is
                        automatically deleted after analysis.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Upload;
