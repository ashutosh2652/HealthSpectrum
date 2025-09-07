import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
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
  Download,
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
import { demoAnalysisReport } from "@/pages/data/demodata";
import api from "@/lib/apiClient"; // adjust path if using aliases

interface AnalysisReportPageProps {
  reportId?: string;
}

const AnalysisReportPage: React.FC<AnalysisReportPageProps> = ({
  reportId,
}) => {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRawData, setShowRawData] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        // Example API call using centralized client
        const resp = await api.get(`/api/reports/${reportId}`); // uses VITE_API_BASE_URL + /api/reports/...
        setReport(resp.data);
      } catch (err) {
        console.error("Failed to fetch report", err);
        setError("Failed to fetch analysis report");
      } finally {
        setLoading(false);
      }
    };

    if (reportId) fetchReport();
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
    if (!report.conditionsDetected.length) return 100;

    const avgConfidence =
      report.conditionsDetected.reduce(
        (sum, condition) => sum + condition.confidenceScore,
        0
      ) / report.conditionsDetected.length;
    const riskFactor = report.futureRisks.length * 5;
    const urgentRecommendations =
      report.recommendations.filter((rec) => rec.urgency === "urgent").length *
      10;

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
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4 m-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg m-4"
        >
          <div className="relative">
            <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-blue-500/20 rounded-full mx-auto animate-pulse"></div>
          </div>
          <p className="text-gray-700 text-lg font-medium">
            Analyzing your health data...
          </p>
          <p className="text-gray-600 text-sm mt-2">
            This may take a few moments
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4 m-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-red-50/90 backdrop-blur-sm rounded-2xl p-8 border border-red-200/50 shadow-lg m-4"
        >
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-800 text-lg font-medium mb-2">
            Something went wrong
          </p>
          <p className="text-gray-600">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4 m-4">
        <p className="text-gray-700">No report data available</p>
      </div>
    );
  }

  const overallHealthScore = calculateOverallHealthScore(report);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 text-gray-900 p-6 m-4">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-white/90 to-gray-50/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg m-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                  Medical Analysis Report
                </h2>
                <p className="text-gray-600 text-lg">
                  Comprehensive health insights from your medical documents
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Generated on</div>
                <div className="text-gray-900 font-medium">
                  {new Date(report.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowRawData(!showRawData)}
                className="flex items-center space-x-2 bg-gray-100/80 hover:bg-gray-200/80 px-4 py-2.5 rounded-xl transition-all duration-200 border border-gray-300/50"
              >
                <Code className="w-4 h-4" />
                <span>{showRawData ? "Hide" : "Show"} Raw Data</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2.5 rounded-xl transition-all duration-200 border border-blue-500/30"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </motion.button>
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
                className="bg-gradient-to-r from-white/90 to-gray-50/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 shadow-lg m-4"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-blue-500/25">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Executive Summary
                    </h3>
                    <p className="text-gray-600">Key findings and overview</p>
                  </div>
                </div>
                <div className="bg-gray-50/80 rounded-xl p-6 border border-gray-200/50">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {report.summary}
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
                    {report.conditionsDetected.length} conditions identified
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.conditionsDetected.map((condition, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gray-900/50 rounded-xl p-6 border hover:scale-105 transition-all duration-300 ${getConfidenceGradient(condition.confidenceScore)}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-lg text-white">
                        {condition.name}
                      </h4>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {condition.confidenceScore.toFixed(2)}%
                        </div>
                        <div className="text-xs text-gray-400">Confidence</div>
                      </div>
                    </div>

                    <div className="w-full bg-gray-700/50 rounded-full h-3 mb-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${condition.confidenceScore}%` }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                        className={`h-3 rounded-full bg-gradient-to-r ${getConfidenceColor(condition.confidenceScore)} shadow-lg`}
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

                    {condition.evidenceSnippets.length > 0 && (
                      <div className="border-t border-gray-700/50 pt-4 mt-4">
                        <div className="flex items-center mb-3">
                          <Info className="w-4 h-4 text-blue-400 mr-2" />
                          <span className="text-sm font-medium text-gray-300">
                            Evidence Found
                          </span>
                        </div>
                        {condition.evidenceSnippets.map(
                          (snippet, snippetIndex) => (
                            <div
                              key={snippetIndex}
                              className="bg-gray-800/50 rounded-lg p-3 mb-2 border border-gray-700/30"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-blue-400">
                                  Page {snippet.page}
                                </span>
                              </div>
                              <p className="text-sm text-gray-300 italic">
                                "{snippet.text}"
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {condition.userFeedback && (
                      <div className="border-t border-gray-700/50 pt-4 mt-4">
                        <div className="flex items-center space-x-2">
                          {condition.userFeedback.isValidated ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm font-medium text-green-400">
                                Validated by Healthcare Provider
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-5 h-5 text-amber-500" />
                              <span className="text-sm font-medium text-amber-400">
                                Pending Validation
                              </span>
                            </>
                          )}
                        </div>
                        {condition.userFeedback.notes && (
                          <p className="text-sm text-gray-300 mt-2 bg-gray-800/30 rounded-lg p-3">
                            {condition.userFeedback.notes}
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Timeline Analysis */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
            >
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-purple-500/25">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Timeline Analysis
                  </h3>
                  <p className="text-gray-400">Chronological health events</p>
                </div>
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start space-x-4 bg-gray-900/50 rounded-xl p-6 border border-gray-700/30"
                >
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mt-2 shadow-lg shadow-blue-500/50"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-white">2025-08-01</p>
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30">
                        Symptom Report
                      </span>
                    </div>
                    <p className="text-gray-300 mb-1">
                      Patient reported headache episodes
                    </p>
                    <p className="text-sm text-gray-500">
                      Page 2 • Document Reference
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start space-x-4 bg-gray-900/50 rounded-xl p-6 border border-gray-700/30"
                >
                  <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full mt-2 shadow-lg shadow-red-500/50"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-white">2025-08-15</p>
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/30">
                        Vital Signs
                      </span>
                    </div>
                    <p className="text-gray-300 mb-1">
                      BP measured 145/95 mmHg
                    </p>
                    <p className="text-sm text-gray-500">
                      Page 3 • Elevated reading
                    </p>
                  </div>
                </motion.div>
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
                    {report.medicationsMentioned.length} medications identified
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.medicationsMentioned.map((medication, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-bold text-lg text-white">
                        {medication.name}
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
                        <span className="text-sm text-gray-400">Purpose:</span>
                        <p className="text-gray-300">{medication.reason}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
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
                {report.testsExplained.map((test, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-lg text-white">
                        {test.name}
                      </h4>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    {test.reason && (
                      <p className="text-gray-300 leading-relaxed">
                        {test.reason}
                      </p>
                    )}
                  </motion.div>
                ))}
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
                {report.futureRisks.map((risk, index) => (
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
                          {risk.confidenceScore}%
                        </div>
                        <div className="text-xs text-gray-400">Likelihood</div>
                      </div>
                    </div>

                    <div className="w-full bg-gray-700/50 rounded-full h-3 mb-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${risk.confidenceScore}%` }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                        className={`h-3 rounded-full bg-gradient-to-r ${getConfidenceColor(risk.confidenceScore)} shadow-lg`}
                      />
                    </div>

                    <p className="text-gray-300 leading-relaxed">{risk.text}</p>
                  </motion.div>
                ))}
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
                {report.recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-gray-300 flex-1 leading-relaxed pr-4">
                        {recommendation.text}
                      </p>
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 shadow-lg ${getUrgencyColor(recommendation.urgency)}`}
                      >
                        {getUrgencyIcon(recommendation.urgency)}
                        <span className="capitalize">
                          {recommendation.urgency}
                        </span>
                      </motion.span>
                    </div>
                  </motion.div>
                ))}
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
            {/* Overall Health Score */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-6 text-center text-white">
                Overall Health Score
              </h3>
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg
                    className="w-32 h-32 transform -rotate-90"
                    viewBox="0 0 120 120"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-700"
                    />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="url(#healthGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                      animate={{
                        strokeDashoffset:
                          2 * Math.PI * 50 * (1 - overallHealthScore / 100),
                      }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient
                        id="healthGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        {overallHealthScore.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">/ 100</div>
                    </div>
                  </div>
                </div>
                <div
                  className={`text-lg font-semibold bg-gradient-to-r ${getHealthScoreColor(overallHealthScore)} bg-clip-text text-transparent`}
                >
                  {getHealthScoreText(overallHealthScore)}
                </div>
              </div>
            </div>

            {/* Key Entities */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center mb-6">
                <Zap className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-white">
                  Key Entities
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
                    <Pill className="w-4 h-4 mr-2" />
                    Medications
                  </h4>
                  <div className="space-y-2">
                    {report.medicationsMentioned
                      .slice(0, 3)
                      .map((med, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-900/30 rounded-lg p-2"
                        >
                          <span className="text-sm text-blue-400 font-medium">
                            {med.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {Math.floor(Math.random() * 20) + 80}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Conditions
                  </h4>
                  <div className="space-y-2">
                    {report.conditionsDetected
                      .slice(0, 3)
                      .map((condition, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-900/30 rounded-lg p-2"
                        >
                          <span className="text-sm text-blue-400 font-medium">
                            {condition.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {condition.confidenceScore}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Labs
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-gray-900/30 rounded-lg p-2">
                      <span className="text-sm text-blue-400 font-medium">
                        BP: 140/90
                      </span>
                      <span className="text-xs text-gray-500">92%</span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-900/30 rounded-lg p-2">
                      <span className="text-sm text-blue-400 font-medium">
                        Cholesterol
                      </span>
                      <span className="text-xs text-gray-500">95%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Symptoms
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-gray-900/30 rounded-lg p-2">
                      <span className="text-sm text-blue-400 font-medium">
                        Headache
                      </span>
                      <span className="text-xs text-gray-500">90%</span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-900/30 rounded-lg p-2">
                      <span className="text-sm text-blue-400 font-medium">
                        Fatigue
                      </span>
                      <span className="text-xs text-gray-500">75%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Dates
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-gray-900/30 rounded-lg p-2">
                      <span className="text-sm text-blue-400 font-medium">
                        2025-09-06
                      </span>
                      <span className="text-xs text-gray-500">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center mb-6">
                <Shield className="w-5 h-5 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold text-white">
                  Quick Actions
                </h3>
              </div>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg shadow-blue-500/25"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Document</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg shadow-emerald-500/25"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </motion.button>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Raw Data Toggle */}
        <AnimatePresence>
          {showRawData && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-green-500/25">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Raw JSON Data
                  </h3>
                  <p className="text-gray-400">
                    Complete analysis report data structure
                  </p>
                </div>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30">
                <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(report, null, 2)}
                </pre>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalysisReportPage;
