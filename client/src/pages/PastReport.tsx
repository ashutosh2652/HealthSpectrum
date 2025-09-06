import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Clock, AlertCircle, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

interface PastReportsProps {
  onBack: () => void;
}

interface Report {
  id: number;
  name: string;
  date: string;
  status: "analyzed" | "processing" | "error";
}

const PastReport = ({ onBack }: PastReportsProps) => {
  const [reports] = useState<Report[]>([
    { id: 1, name: "Blood Test.pdf", date: "2025-08-28", status: "analyzed" },
    { id: 2, name: "MRI Scan.jpg", date: "2025-08-20", status: "processing" },
    { id: 3, name: "Prescription.pdf", date: "2025-08-10", status: "error" },
  ]);

  const getStatusIcon = (status: Report["status"]) => {
    switch (status) {
      case "analyzed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "processing":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen cosmic-bg">
      <div className="absolute inset-0 stars-pattern opacity-30"></div>

      {/* Navigation */}
      <Navbar />

      {/* Content */}
      <main className="pt-16 relative z-10">
        <div className="medical-container py-12">
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={onBack}
              variant="ghost"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Button>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search reports..."
                className="pl-10 pr-4 py-2 border border-border/50 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-6">Past Reports</h1>
          <p className="text-muted-foreground mb-10">
            Review your previously uploaded reports and their analysis results.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card/50 rounded-xl shadow-medical overflow-hidden border border-border/50"
          >
            <table className="w-full text-left">
              <thead className="bg-muted/30">
                <tr>
                  <th className="py-4 px-6 text-sm font-semibold text-foreground">Report</th>
                  <th className="py-4 px-6 text-sm font-semibold text-foreground">Date</th>
                  <th className="py-4 px-6 text-sm font-semibold text-foreground">Status</th>
                  <th className="py-4 px-6 text-sm font-semibold text-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-t border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-4 px-6 flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-accent" />
                      <span className="font-medium">{report.name}</span>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">{report.date}</td>
                    <td className="py-4 px-6 flex items-center space-x-2">
                      {getStatusIcon(report.status)}
                      <span className="capitalize">{report.status}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button variant="outline" size="sm" className="mr-2">
                        View
                      </Button>
                      <Button variant="secondary" size="sm">
                        Download
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <div className="mt-10 text-center">
            <Button className="btn-medical-primary">Start New Analysis</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PastReport;
