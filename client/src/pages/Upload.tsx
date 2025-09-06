import React, { useState } from "react";
import { UploadCloud, FileText, Loader2 } from "lucide-react";

const Upload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle file selection from input
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadedFiles(Array.from(event.target.files));
    }
  };

  // Handle drag and drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      setUploadedFiles(Array.from(event.dataTransfer.files));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // Analyze button → send to backend
  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0) return;

    setIsProcessing(true);

    try {
      const formData = new FormData();
      // for now send only first file
      formData.append("file", uploadedFiles[0]);

      const res = await fetch("http://localhost:5000/api/documents/extract", {
        method: "POST",
        body: formData,
        credentials: "include", // allow cookies if backend sets them
      });

      if (!res.ok) {
        throw new Error("Failed to analyze document");
      }

      const data = await res.json();
      console.log("✅ Extracted Data:", data);

      alert("Extraction Successful! Check console for results.");
    } catch (error) {
      console.error("❌ Error analyzing document:", error);
      alert("Error analyzing document");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
          Medical Document Analysis
        </h1>

        {/* Upload Box */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-blue-400 rounded-2xl p-10 text-center bg-white shadow-lg hover:shadow-xl transition cursor-pointer"
        >
          <UploadCloud className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <p className="text-gray-600">
            Drag and drop medical documents here, or{" "}
            <label className="text-blue-600 font-semibold cursor-pointer hover:underline">
              browse
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Supported: PDF, Images (JPG, PNG)
          </p>
        </div>

        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Uploaded Files
            </h2>
            <ul className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-2 text-gray-600"
                >
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span>{file.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Analyze Button */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={handleAnalyze}
              disabled={isProcessing}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center mx-auto"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Processing...
                </>
              ) : (
                "Analyze Document"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
