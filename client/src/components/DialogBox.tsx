import { useState } from "react";
import {
  User,
  Pill,
  Save,
  CheckCircle,
  X,
  Edit,
  FileText,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface AnalysisResult {
  documentType: string;
  patientInfo: {
    name: string | null;
    age: string | null;
    dateOfBirth: string | null;
    gender: string | null;
  };
  dateOfDocument: string | null;
  medicalFindings: {
    conditions: Array<{
      name: string;
      severity: string | null;
      notes: string;
    }>;
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      instructions: string;
    }>;
    vitalSigns: Array<{
      type: string;
      value: string;
      unit: string;
      normalRange: string | null;
    }>;
    labResults: Array<{
      test: string;
      result: string;
      unit: string | null;
      normalRange: string | null;
      status: string | null;
    }>;
  };
  recommendations: string[];
  summary: string;
  riskLevel: string;
  keyInsights: string[];
}

interface EditablePatientInfo {
  name: string;
  age: string;
  dateOfBirth: string;
  gender: string;
}

interface DialogBoxProps {
  showResultDialog: boolean;
  setShowResultDialog: (show: boolean) => void;
  analysisResult: AnalysisResult | null;
  editablePatientInfo: EditablePatientInfo;
  setEditablePatientInfo: (
    info:
      | EditablePatientInfo
      | ((prev: EditablePatientInfo) => EditablePatientInfo)
  ) => void;
}

const DialogBox = ({
  showResultDialog,
  setShowResultDialog,
  analysisResult,
  editablePatientInfo,
  setEditablePatientInfo,
}: DialogBoxProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const navigate = useNavigate();

  const handleGenerateFinalReport = async () => {
    setIsGeneratingReport(true);

    try {
      console.log("🔍 [DIALOG] Starting comprehensive report generation...");

      // Get API URL from environment
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      // Prepare data for comprehensive analysis
      const reportData = {
        patientInfo: editablePatientInfo,
        medications: analysisResult?.medicalFindings.medications || [],
        documentType: analysisResult?.documentType || "Medical Document",
        summary: analysisResult?.summary || "",
        originalAnalysis: analysisResult,
      };

      console.log(
        "📤 [DIALOG] Sending data to backend for comprehensive analysis..."
      );
      console.log("📊 [DIALOG] Report data:", reportData);

      // Send to backend for comprehensive analysis
      const response = await fetch(`${API_BASE_URL}/api/generate-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();

      console.log("✅ [DIALOG] Comprehensive report generated successfully!");
      console.log("📊 [DIALOG] Report result:", result);

      // Store the report data and navigate to Analysis page
      console.log("💾 [DIALOG] Storing data to localStorage...");
      try {
        localStorage.setItem(
          "medicalAnalysisReport",
          JSON.stringify(result.report)
        );
        console.log("✅ [DIALOG] Stored medicalAnalysisReport successfully");

        const metadataToStore = {
          ...result.metadata,
          reportId: result.id,
          patientId: result.patientId,
          generatedDate: result.generatedDate,
          status: result.status,
        };

        localStorage.setItem("reportMetadata", JSON.stringify(metadataToStore));
        console.log("✅ [DIALOG] Stored reportMetadata successfully");
        console.log("📄 [DIALOG] Metadata stored:", metadataToStore);

        // Verify the data was stored
        const verifyReport = localStorage.getItem("medicalAnalysisReport");
        const verifyMetadata = localStorage.getItem("reportMetadata");
        console.log(
          "🔍 [DIALOG] Verification - Report stored:",
          !!verifyReport
        );
        console.log(
          "🔍 [DIALOG] Verification - Metadata stored:",
          !!verifyMetadata
        );
      } catch (storageError) {
        console.error("❌ [DIALOG] localStorage error:", storageError);
      }

      // Close dialog and navigate to Analysis page
      setShowResultDialog(false);

      // Add a small delay to ensure localStorage operations complete
      setTimeout(() => {
        console.log("🚀 [DIALOG] Navigating to analysis page...");
        navigate("/analysis", {
          state: {
            reportData: result.report,
            metadata: {
              ...result.metadata,
              reportId: result.id,
              patientId: result.patientId,
              generatedDate: result.generatedDate,
              status: result.status,
            },
          },
        });
      }, 100);
    } catch (error) {
      console.error("❌ [DIALOG] Report generation failed:", error);
      alert(`Report generation failed: ${error.message}`);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleSaveChanges = () => {
    console.log("Updated Patient Info:", editablePatientInfo);
    console.log("Medications:", analysisResult?.medicalFindings.medications);
    setIsSaved(true);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsSaved(false);
  };

  const handleInputChange = (
    field: keyof EditablePatientInfo,
    value: string
  ) => {
    if (isEditing) {
      setEditablePatientInfo((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <Dialog open={showResultDialog}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl font-bold text-slate-300">
                📄 Extracted Information
              </DialogTitle>
              <DialogDescription className="text-base text-white">
                Review and edit the patient information from your document
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              onClick={handleEdit}
              disabled={isEditing}
              className="px-4 py-2 text-sm text-blue-600 border-blue-300 hover:bg-blue-50 disabled:opacity-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </DialogHeader>

        {analysisResult && (
          <div className="space-y-6 p-1">
            {/* Details Extracted Header
            <div className="text-center py-2">
              <h2 className="text-lg font-semibold text-gray-700">
                ✅ Details Extracted
              </h2>
            </div> */}
            {/* Patient Information Card */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-black">
                <User className="w-5 h-5 text-blue-600" />
                Patient Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editablePatientInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter patient's full name"
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-black ${
                      isEditing ? "bg-white" : "bg-gray-100 cursor-not-allowed"
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Age</label>
                  <input
                    type="number"
                    value={editablePatientInfo.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="Enter age"
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-black ${
                      isEditing ? "bg-white" : "bg-gray-100 cursor-not-allowed"
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={editablePatientInfo.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-black ${
                      isEditing ? "bg-white" : "bg-gray-100 cursor-not-allowed"
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    Gender
                  </label>
                  <select
                    value={editablePatientInfo.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-black ${
                      isEditing ? "bg-white" : "bg-gray-100 cursor-not-allowed"
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Medications Card */}
            {analysisResult.medicalFindings.medications.length > 0 && (
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-black">
                  <Pill className="w-5 h-5 text-green-600" />
                  Medications Found (
                  {analysisResult.medicalFindings.medications.length})
                </h3>
                <div className="space-y-3">
                  {analysisResult.medicalFindings.medications.map(
                    (med, index) => (
                      <div
                        key={index}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                      >
                        <h4 className="font-semibold text-blue-900 text-base mb-2">
                          💊 {med.name}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          {med.dosage && (
                            <div className="text-blue-800">
                              <span className="font-medium text-black">
                                Dosage:
                              </span>{" "}
                              <span className="text-black">{med.dosage}</span>
                            </div>
                          )}
                          {med.frequency && (
                            <div className="text-blue-800">
                              <span className="font-medium text-black">
                                Frequency:
                              </span>{" "}
                              <span className="text-black">
                                {med.frequency}
                              </span>
                            </div>
                          )}
                          {med.instructions && (
                            <div className="text-blue-800 md:col-span-3">
                              <span className="font-medium text-black">
                                Instructions:
                              </span>{" "}
                              <span className="text-black">
                                {med.instructions}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowResultDialog(false)}
                className="px-6 py-3 text-base text-black bg-gray-300"
              >
                Close
              </Button>
              <div className="flex gap-3">
                {isEditing && (
                  <Button
                    variant="outline"
                    onClick={handleSaveChanges}
                    className="px-6 py-3 text-base border-gray-300 transition-all duration-300 text-black bg-blue-500 hover:bg-blue-600"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                )}
                {isSaved && (
                  <Button
                    variant="outline"
                    disabled
                    className="px-6 py-3 text-base border-green-300 bg-green-50 text-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Saved
                  </Button>
                )}
                <Button
                  onClick={handleGenerateFinalReport}
                  disabled={isGeneratingReport}
                  className="px-6 py-3 text-base text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                >
                  {isGeneratingReport ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      📋 Get Final Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogBox;
