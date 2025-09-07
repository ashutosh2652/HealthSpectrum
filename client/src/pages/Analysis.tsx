import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Heart,
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Pill,
  FileText,
  BarChart3,
  Eye,
  Code,
  Loader,
  AlertCircle,
  Calendar,
  TrendingUp,
  Shield,
  Zap,
  ChevronRight,
  Info,
  Star,
  Target,
} from "lucide-react";
import {
  AnalysisReport,
  ConditionDetected,
  MedicationMentioned,
  TestExplained,
  FutureRisk,
  Recommendation,
} from "@/pages/types/AnalysisReport";

interface AnalysisReportPageProps {
  reportId?: string;
}

const AnalysisReportPage: React.FC<AnalysisReportPageProps> = ({
  reportId,
}) => {
  const location = useLocation();
  const { theme } = useTheme();
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Try to load report from localStorage first (from DialogBox navigation)
    const loadReport = async () => {
      try {
        setLoading(true);

        // Function to check localStorage with retries
        const checkLocalStorageWithRetries = (maxRetries = 3, delay = 200) => {
          return new Promise<{
            storedReport: string | null;
            storedMetadata: string | null;
          }>((resolve) => {
            let attempts = 0;

            const tryLoad = () => {
              attempts++;
              const storedReport = localStorage.getItem(
                "medicalAnalysisReport"
              );
              const storedMetadata = localStorage.getItem("reportMetadata");

              console.log(
                `🔍 [ANALYSIS] Attempt ${attempts}: Checking localStorage...`
              );
              console.log("📄 [ANALYSIS] storedReport exists:", !!storedReport);
              console.log(
                "📄 [ANALYSIS] storedMetadata exists:",
                !!storedMetadata
              );

              if (storedReport || attempts >= maxRetries) {
                console.log(
                  "📄 [ANALYSIS] storedReport content:",
                  storedReport
                );
                console.log(
                  "📄 [ANALYSIS] storedMetadata content:",
                  storedMetadata
                );
                resolve({ storedReport, storedMetadata });
              } else {
                console.log(
                  `⏳ [ANALYSIS] No data found, retrying in ${delay}ms...`
                );
                setTimeout(tryLoad, delay);
              }
            };

            tryLoad();
          });
        };

        // Check for report data from DialogBox workflow with retries
        const { storedReport, storedMetadata } =
          await checkLocalStorageWithRetries();

        // Also check for data passed via navigation state
        const navigationState = location.state as any;
        console.log("🔍 [ANALYSIS] Navigation state:", navigationState);

        if (storedReport || navigationState?.reportData) {
          console.log(
            "📊 [ANALYSIS] Loading report from",
            storedReport ? "localStorage" : "navigation state"
          );

          // Use localStorage data first, then fallback to navigation state
          const reportData = storedReport
            ? JSON.parse(storedReport)
            : navigationState.reportData;
          const metadata = storedMetadata
            ? JSON.parse(storedMetadata)
            : navigationState?.metadata || null;

          console.log("📊 [ANALYSIS] Report data loaded:", reportData);
          console.log("📊 [ANALYSIS] Metadata loaded:", metadata);

          // Transform the data to match our AnalysisReport interface
          const transformedReport: AnalysisReport = {
            _id:
              metadata?.databaseId ||
              metadata?.reportId ||
              `analysis-${Date.now()}`,
            patientId:
              metadata?.patientId ||
              (metadata?.patientInfo?.name
                ? `patient-${metadata.patientInfo.name.toLowerCase().replace(/\s+/g, "-")}`
                : `patient-${Date.now()}`),
            sourceDocuments: [],
            summary: reportData.summary || "No summary available",
            conditionsDetected: (reportData.conditionsDetected || []).map(
              (condition) => ({
                ...condition,
                evidenceSnippets: condition.evidenceSnippets || [],
              })
            ),
            medicationsMentioned: reportData.medicationsMentioned || [],
            testsExplained: reportData.testsExplained || [],
            futureRisks: reportData.futureRisks || [],
            recommendations: (reportData.recommendations || []).map((rec) => ({
              text: rec.text || rec.toString(), // Handle case where recommendation might be a string
              urgency: rec.urgency || "normal",
            })),
            createdAt: new Date(
              metadata?.generatedDate || new Date().toISOString()
            ),
            updatedAt: new Date(),
          };

          setReport(transformedReport);

          // Clear localStorage after loading to prevent stale data
          localStorage.removeItem("medicalAnalysisReport");
          localStorage.removeItem("reportMetadata");
        } else {
          console.log("📊 [ANALYSIS] No stored report found");
          console.log(
            "🔍 [ANALYSIS] Available localStorage keys:",
            Object.keys(localStorage)
          );
          setError("No analysis report found. Please upload a document first.");
        }
      } catch (err) {
        console.error("❌ [ANALYSIS] Failed to load report:", err);
        setError("Failed to load analysis report");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [reportId]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/25";
      case "soon":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/25";
      case "normal":
        return "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/25";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-500/25";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return <AlertTriangle className="w-4 h-4" />;
      case "soon":
        return <Clock className="w-4 h-4" />;
      case "normal":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "from-blue-500 to-blue-600";
    if (score >= 60) return "from-amber-500 to-orange-500";
    return "from-red-500 to-red-600";
  };

  const getConfidenceGradient = (score: number) => {
    if (score >= 80)
      return "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30";
    if (score >= 60)
      return "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30";
    return "bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/30";
  };

  const calculateOverallHealthScore = (report: AnalysisReport): number => {
    if (!report?.conditionsDetected?.length) return 100;

    const avgConfidence =
      report.conditionsDetected.reduce(
        (sum, condition) => sum + (condition.confidenceScore || 0),
        0
      ) / report.conditionsDetected.length;
    const riskFactor = (report.futureRisks?.length || 0) * 5;
    const urgentRecommendations =
      (report.recommendations?.filter((rec) => rec.urgency === "urgent")
        ?.length || 0) * 10;

    return Math.max(
      10,
      100 - riskFactor - urgentRecommendations - (100 - avgConfidence)
    );
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-green-500";
    if (score >= 60) return "from-amber-500 to-orange-500";
    return "from-red-500 to-red-600";
  };

  const getHealthScoreText = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Attention";
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
        } flex items-center justify-center`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-center backdrop-blur-sm rounded-2xl p-8 border transition-colors duration-300 ${
            theme === "dark"
              ? "bg-gray-800/50 border-gray-700/50"
              : "bg-white/70 border-gray-200/50 shadow-lg"
          }`}
        >
          <div className="relative">
            <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-blue-500/20 rounded-full mx-auto animate-pulse"></div>
          </div>
          <p
            className={`text-lg font-medium transition-colors duration-300 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Loading your comprehensive medical analysis...
          </p>
          <p
            className={`text-sm mt-2 transition-colors duration-300 ${
              theme === "dark" ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Preparing your detailed health report
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
        } flex items-center justify-center`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-center backdrop-blur-sm rounded-2xl p-8 border max-w-md mx-auto transition-colors duration-300 ${
            theme === "dark"
              ? "bg-red-500/10 border-red-500/20"
              : "bg-red-50/80 border-red-200/50 shadow-lg"
          }`}
        >
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p
            className={`text-lg font-medium mb-2 transition-colors duration-300 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Something went wrong
          </p>
          <p
            className={`mb-6 transition-colors duration-300 ${
              theme === "dark" ? "text-gray-500" : "text-gray-600"
            }`}
          >
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = "/upload")}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg transition-all duration-200"
            >
              Upload Document
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className={`w-full py-2 px-4 rounded-lg transition-all duration-200 ${
                theme === "dark"
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              Clear Cache & Reload
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!report) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
        } flex items-center justify-center`}
      >
        <p
          className={`transition-colors duration-300 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          No report data available
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 mt-20">
        {/* Hero Section */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div
            className={`backdrop-blur-sm rounded-2xl p-8 border shadow-xl transition-colors duration-300 ${
              theme === "dark"
                ? "bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-700/50"
                : "bg-gradient-to-r from-white/80 to-gray-50/80 border-gray-200/50 shadow-2xl"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1
                  className={`text-4xl font-bold mb-3 transition-colors duration-300 ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                      : "bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
                  }`}
                >
                  Medical Analysis Report
                </h1>
                <p
                  className={`text-lg transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Comprehensive health insights from your medical documents
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`text-sm mb-1 transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Generated on
                </div>
                <div
                  className={`font-medium transition-colors duration-300 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {new Date(report.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Summary Card */}
            {report.summary && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`backdrop-blur-sm rounded-2xl p-8 border hover:border-opacity-70 transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-700/50 hover:border-gray-600/50"
                    : "bg-gradient-to-r from-white/70 to-gray-50/70 border-gray-200/50 hover:border-gray-300/50 shadow-lg"
                }`}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-blue-500/25">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3
                      className={`text-2xl font-bold transition-colors duration-300 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Executive Summary
                    </h3>
                    <p
                      className={`transition-colors duration-300 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Key findings and overview
                    </p>
                  </div>
                </div>
                <div
                  className={`rounded-xl p-6 border transition-colors duration-300 ${
                    theme === "dark"
                      ? "bg-gray-900/50 border-gray-700/30"
                      : "bg-white/80 border-gray-200/30 shadow-sm"
                  }`}
                >
                  <p
                    className={`leading-relaxed text-lg transition-colors duration-300 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {report.summary ||
                      "No summary available for this analysis."}
                  </p>
                </div>
              </motion.section>
            )}

            {/* Detected Conditions */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
            >
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-red-500/25">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Detected Conditions
                  </h3>
                  <p className="text-gray-400">
                    {report.conditionsDetected?.length || 0} conditions
                    identified
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.conditionsDetected?.length > 0 ? (
                  report.conditionsDetected.map((condition, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-gray-900/50 rounded-xl p-6 border hover:scale-105 transition-all duration-300 ${getConfidenceGradient(condition.confidenceScore)}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-lg text-white">
                          {condition.name || "Unknown Condition"}
                        </h4>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            {condition.confidenceScore || 0}%
                          </div>
                          <div className="text-xs text-gray-400">
                            Confidence
                          </div>
                        </div>
                      </div>

                      <div className="w-full bg-gray-700/50 rounded-full h-3 mb-4 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${condition.confidenceScore || 0}%`,
                          }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                          className={`h-3 rounded-full bg-gradient-to-r ${getConfidenceColor(condition.confidenceScore || 0)} shadow-lg`}
                        />
                      </div>

                      {condition.explanation && (
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          {condition.explanation}
                        </p>
                      )}

                      {condition.estimatedOnsetDate && (
                        <div className="flex items-center text-sm text-gray-400 mb-4">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            Estimated onset:{" "}
                            {new Date(
                              condition.estimatedOnsetDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {condition.evidenceSnippets &&
                        condition.evidenceSnippets.length > 0 && (
                          <div className="border-t border-gray-700/50 pt-4 mt-4">
                            <div className="flex items-center mb-3">
                              <Info className="w-4 h-4 text-blue-400 mr-2" />
                              <span className="text-sm font-medium text-gray-300">
                                Evidence Found
                              </span>
                            </div>
                            {condition.evidenceSnippets
                              .filter(
                                (snippet) =>
                                  snippet.text && snippet.text.length > 10
                              ) // Only show real evidence
                              .map((snippet, snippetIndex) => (
                                <div
                                  key={snippetIndex}
                                  className="bg-gray-800/50 rounded-lg p-3 mb-2 border border-gray-700/30"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-blue-400">
                                      {snippet.page
                                        ? `Page ${snippet.page}`
                                        : "Document"}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-300 italic">
                                    "{snippet.text}"
                                  </p>
                                </div>
                              ))}
                          </div>
                        )}
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">
                      No conditions detected in the analysis
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      This is a positive indicator for your health
                    </p>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Medications Grid */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
            >
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-green-500/25">
                  <Pill className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Current Medications
                  </h3>
                  <p className="text-gray-400">
                    {report.medicationsMentioned?.length || 0} medications
                    identified
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.medicationsMentioned?.length > 0 ? (
                  report.medicationsMentioned.map((medication, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-bold text-lg text-white">
                          {medication.name || "Unknown Medication"}
                        </h4>
                        <Pill className="w-5 h-5 text-green-400" />
                      </div>
                      {medication.dosage && (
                        <div className="mb-3">
                          <span className="text-sm text-gray-400">Dosage:</span>
                          <p className="text-blue-400 font-medium">
                            {medication.dosage}
                          </p>
                        </div>
                      )}
                      {medication.reason && (
                        <div>
                          <span className="text-sm text-gray-400">
                            Purpose:
                          </span>
                          <p className="text-gray-300">{medication.reason}</p>
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <Pill className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">
                      No medications mentioned in the analysis
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Always consult with your healthcare provider regarding
                      medications
                    </p>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Tests Explained */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
            >
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-purple-500/25">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Diagnostic Tests
                  </h3>
                  <p className="text-gray-400">
                    Recommended and completed tests
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {report.testsExplained?.length > 0 ? (
                  report.testsExplained.map((test, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-lg text-white">
                          {test.name || "Unknown Test"}
                        </h4>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      {test.reason && (
                        <p className="text-gray-300 leading-relaxed">
                          {test.reason}
                        </p>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">
                      No specific tests mentioned in the analysis
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Regular health checkups are always recommended
                    </p>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Future Risks */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
            >
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-amber-500/25">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Future Health Risks
                  </h3>
                  <p className="text-gray-400">
                    Potential health concerns to monitor
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {report.futureRisks?.length > 0 ? (
                  report.futureRisks.map((risk, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`bg-gray-900/50 rounded-xl p-6 border hover:scale-105 transition-all duration-300 ${getConfidenceGradient(risk.confidenceScore)}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <AlertTriangle className="w-5 h-5 text-amber-400 mr-3" />
                          <span className="text-sm font-medium text-gray-300">
                            Risk Assessment
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-white">
                            {risk.confidenceScore || 0}%
                          </div>
                          <div className="text-xs text-gray-400">
                            Likelihood
                          </div>
                        </div>
                      </div>

                      <div className="w-full bg-gray-700/50 rounded-full h-3 mb-4 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${risk.confidenceScore || 0}%` }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                          className={`h-3 rounded-full bg-gradient-to-r ${getConfidenceColor(risk.confidenceScore || 0)} shadow-lg`}
                        />
                      </div>

                      <p className="text-gray-300 leading-relaxed">
                        {risk.text || "No details available"}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">
                      No significant future risks identified
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Continue with regular health monitoring and preventive
                      care
                    </p>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Recommendations */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
            >
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-emerald-500/25">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Action Plan</h3>
                  <p className="text-gray-400">
                    Personalized health recommendations
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {report.recommendations?.length > 0 ? (
                  report.recommendations.map((recommendation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <p className="text-gray-300 flex-1 leading-relaxed pr-4">
                          {recommendation.text ||
                            "No recommendation details available"}
                        </p>
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 shadow-lg ${getUrgencyColor(recommendation.urgency || "normal")}`}
                        >
                          {getUrgencyIcon(recommendation.urgency || "normal")}
                          <span className="capitalize">
                            {recommendation.urgency || "normal"}
                          </span>
                        </motion.span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">
                      No specific recommendations provided
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Consult with your healthcare provider for personalized
                      advice
                    </p>
                  </div>
                )}
              </div>
            </motion.section>
          </div>

          {/* Enhanced Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Report Metadata */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center mb-6">
                <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-white">
                  Report Information
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-gray-900/30 rounded-lg p-3">
                  <span className="text-sm text-gray-400">Generated</span>
                  <span className="text-sm text-white font-medium">
                    {report?.createdAt
                      ? new Date(report.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-gray-900/30 rounded-lg p-3">
                  <span className="text-sm text-gray-400">Report ID</span>
                  <span className="text-sm text-white font-medium">
                    {report?._id ? report._id.substring(0, 8) + "..." : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-gray-900/30 rounded-lg p-3">
                  <span className="text-sm text-gray-400">Patient ID</span>
                  <span className="text-sm text-white font-medium">
                    {report?.patientId
                      ? report.patientId.substring(0, 8) + "..."
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Analysis Summary */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center mb-6">
                <TrendingUp className="w-5 h-5 text-emerald-500 mr-2" />
                <h3 className="text-lg font-semibold text-white">
                  Analysis Summary
                </h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Conditions</span>
                    <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-lg text-xs">
                      {report.conditionsDetected?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Medications</span>
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg text-xs">
                      {report.medicationsMentioned?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Risks</span>
                    <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-lg text-xs">
                      {report.futureRisks?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">
                      Recommendations
                    </span>
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-xs">
                      {report.recommendations?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Tests</span>
                    <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-lg text-xs">
                      {report.testsExplained?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Raw Data Toggle */}
      </div>
    </div>
  );
};

export default AnalysisReportPage;
