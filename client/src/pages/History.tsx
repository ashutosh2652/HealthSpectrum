import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  FileText,
  Clock,
  Eye,
  Download,
  Search,
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Brain,
  ArrowRight,
  MoreVertical,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";

// Legacy health analysis result interface (for existing data compatibility)
interface HealthAnalysisResult {
  id: string;
  fileName: string;
  customName?: string;
  analysisDate: string;
  status: "completed" | "processing" | "failed";
  reportType: string;
  summary: string;
  conditions: Array<{
    name: string;
    confidence: number;
    evidence: string[];
    location: any;
  }>;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    evidence: string[];
    location: any;
  }>;
  vitalSigns: Array<{
    type: string;
    value: string;
    unit: string;
    date: string;
    evidence: string[];
    location: any;
  }>;
  recommendations: string[];
  riskLevel: "low" | "medium" | "high";
  pageCount: number;
  processingTime: number;
  errors: string[];
}

// Interface for history reports
interface HistoryReport {
  id: string;
  fileName: string;
  uploadDate: string;
  analysisDate: string;
  status: "completed" | "processing" | "error";
  reportType: string;
  riskLevel: "low" | "medium" | "high";
  keyFindings?: string[];
  conditions?: Array<{
    name: string;
    confidence?: number;
    evidence?: string[];
  }>;
  fileSize: string;
}

const History = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedReport, setSelectedReport] = useState<HistoryReport | null>(
    null
  );

  // Mock data - replace with actual API call
  const [reports] = useState<HistoryReport[]>([
    {
      id: "1",
      fileName: "Blood_Test_Results_Jan2024.pdf",
      uploadDate: "2024-01-15",
      analysisDate: "2024-01-15",
      status: "completed",
      reportType: "Blood Test",
      riskLevel: "low",
      keyFindings: [
        "Normal cholesterol levels",
        "Slightly low Vitamin D",
        "Healthy blood sugar",
      ],
      fileSize: "2.3 MB",
    },
    {
      id: "2",
      fileName: "MRI_Scan_Dec2023.pdf",
      uploadDate: "2023-12-20",
      analysisDate: "2023-12-20",
      status: "completed",
      reportType: "MRI Scan",
      riskLevel: "medium",
      keyFindings: [
        "Minor disc degeneration",
        "No tumors detected",
        "Follow-up recommended",
      ],
      fileSize: "5.7 MB",
    },
    {
      id: "3",
      fileName: "Prescription_Analysis.jpg",
      uploadDate: "2023-11-08",
      analysisDate: "2023-11-08",
      status: "completed",
      reportType: "Prescription",
      riskLevel: "low",
      keyFindings: [
        "Valid prescription format",
        "No drug interactions",
        "Dosage appropriate",
      ],
      fileSize: "1.2 MB",
    },
    {
      id: "4",
      fileName: "X_Ray_Chest_Oct2023.pdf",
      uploadDate: "2023-10-25",
      analysisDate: "2023-10-25",
      status: "processing",
      reportType: "X-Ray",
      riskLevel: "medium",
      keyFindings: [],
      fileSize: "3.1 MB",
    },
  ]);

  // Status icon
  const getStatusIcon = (status: HistoryReport["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "processing":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  // Risk badge style
  const getRiskBadgeColor = (riskLevel: HistoryReport["riskLevel"]) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Filter + sort
  const filteredReports = useMemo(() => {
    let result = reports.filter((report) => {
      const matchesSearch =
        report.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || report.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

    if (sortBy === "newest") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      );
    } else if (sortBy === "oldest") {
      result = [...result].sort(
        (a, b) =>
          new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
      );
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) => a.fileName.localeCompare(b.fileName));
    } else if (sortBy === "type") {
      result = [...result].sort((a, b) =>
        a.reportType.localeCompare(b.reportType)
      );
    }

    return result;
  }, [reports, searchTerm, filterStatus, sortBy]);

  // Stats
  const stats = [
    {
      title: "Total Reports",
      value: reports.length,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Completed Analysis",
      value: reports.filter((r) => r.status === "completed").length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Processing",
      value: reports.filter((r) => r.status === "processing").length,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "High Risk Findings",
      value: reports.filter((r) => r.riskLevel === "high").length,
      icon: TrendingUp,
      color: "text-red-600",
      bgColor: "bg-red-100",
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
                <span className="text-medical-title">Medical</span>
                <br />
                <span className="text-foreground">History & Reports</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Access and manage all your analyzed medical documents in one
                place. Track your health journey with detailed insights and
                recommendations.
              </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-6 rounded-xl bg-background/80 border border-border shadow-md hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                    >
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Search and Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card-medical p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search reports by name or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background border-border focus:border-primary"
                  />
                </div>

                <div className="flex gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="processing">Processing</option>
                    <option value="error">Error</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Name A-Z</option>
                    <option value="type">Type</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Reports Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              {filteredReports.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card-medical-glow p-12 text-center"
                >
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    No Reports Found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm || filterStatus !== "all"
                      ? "Try adjusting your search or filter criteria."
                      : "Upload your first medical document to get started with AI analysis."}
                  </p>
                  <Button
                    className="btn-medical-primary"
                    onClick={() => navigate("/upload")} // ✅ SPA navigation
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Upload New Document
                  </Button>
                </motion.div>
              ) : (
                filteredReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="card-medical-glow hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow flex-shrink-0">
                            <FileText className="w-6 h-6 text-primary-foreground" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-semibold text-foreground mb-2 truncate">
                              {report.fileName}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(
                                  report.analysisDate
                                ).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <Activity className="w-4 h-4 mr-1" />
                                {report.reportType || "Medical Document"}
                              </span>
                              <span>{report.fileSize || "Unknown size"}</span>
                            </div>

                            <div className="flex items-center space-x-3 mb-4">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(report.status)}
                                <span className="text-sm font-medium capitalize">
                                  {report.status}
                                </span>
                              </div>

                              {report.status === "completed" && (
                                <Badge
                                  variant="outline"
                                  className={`${getRiskBadgeColor(
                                    report.riskLevel
                                  )} capitalize`}
                                >
                                  {report.riskLevel} Risk
                                </Badge>
                              )}
                            </div>

                            {report.conditions &&
                              report.conditions.length > 0 && (
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-foreground mb-2">
                                    Key Findings:
                                  </h4>
                                  <ul className="space-y-1">
                                    {report.conditions
                                      .slice(0, 2)
                                      .map((condition, idx) => (
                                        <li
                                          key={idx}
                                          className="text-sm text-muted-foreground flex items-start"
                                        >
                                          <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                          {condition.name}
                                        </li>
                                      ))}
                                    {report.conditions.length > 2 && (
                                      <li className="text-sm text-accent">
                                        +{report.conditions.length - 2} more
                                        findings
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-accent hover:text-accent-foreground"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Report
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-accent hover:text-accent-foreground"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-accent hover:text-accent-foreground"
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>

                        {report.status === "completed" && (
                          <Button
                            size="sm"
                            className="btn-medical-primary group"
                            onClick={() => setSelectedReport(report)}
                          >
                            View Analysis
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>

            {/* Load More Button */}
            {filteredReports.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center mt-12"
              >
                <Button
                  variant="outline"
                  className="hover:bg-accent hover:text-accent-foreground"
                >
                  Load More Reports
                </Button>
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default History;
