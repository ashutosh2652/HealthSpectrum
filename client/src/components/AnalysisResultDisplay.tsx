import { motion } from "framer-motion";
import {
  FileText,
  Activity,
  Pill,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
  Clock,
  Eye,
  Download,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type HealthAnalysisResult } from "@/services/analysisApi";

interface AnalysisResultDisplayProps {
  result: HealthAnalysisResult;
  onClose?: () => void;
}

export const AnalysisResultDisplay = ({
  result,
  onClose,
}: AnalysisResultDisplayProps) => {
  const getRiskBadgeColor = (riskLevel: string) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 space-y-6"
    >
      {/* Header */}
      <Card className="card-medical-glow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-foreground">
                Analysis Results
              </CardTitle>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  {result.customName}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(result.analysisDate).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {Math.round(result.processingTime / 1000)}s
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge
                variant="outline"
                className={`${getRiskBadgeColor(result.riskLevel)} capitalize`}
              >
                {result.riskLevel} Risk
              </Badge>
              {onClose && (
                <Button variant="outline" onClick={onClose} size="sm">
                  Close
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary */}
      <Card className="card-medical">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Info className="w-5 h-5 mr-2 text-primary" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {result.summary}
          </p>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Conditions Summary */}
            <Card className="card-medical">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                  Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-2">
                  {result.conditions.length}
                </div>
                <p className="text-sm text-muted-foreground">
                  {result.conditions.length === 0
                    ? "No specific conditions identified"
                    : `${result.conditions.length} condition${result.conditions.length > 1 ? "s" : ""} found`}
                </p>
              </CardContent>
            </Card>

            {/* Medications Summary */}
            <Card className="card-medical">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Pill className="w-5 h-5 mr-2 text-blue-500" />
                  Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-2">
                  {result.medications.length}
                </div>
                <p className="text-sm text-muted-foreground">
                  {result.medications.length === 0
                    ? "No medications listed"
                    : `${result.medications.length} medication${result.medications.length > 1 ? "s" : ""} found`}
                </p>
              </CardContent>
            </Card>

            {/* Vital Signs Summary */}
            <Card className="card-medical">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-500" />
                  Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-2">
                  {result.vitalSigns.length}
                </div>
                <p className="text-sm text-muted-foreground">
                  {result.vitalSigns.length === 0
                    ? "No vital signs recorded"
                    : `${result.vitalSigns.length} vital sign${result.vitalSigns.length > 1 ? "s" : ""} recorded`}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <Card className="card-medical">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-muted-foreground">
                        {recommendation}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="conditions" className="space-y-4">
          {result.conditions.length === 0 ? (
            <Card className="card-medical">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  No specific conditions identified in this document.
                </p>
              </CardContent>
            </Card>
          ) : (
            result.conditions.map((condition, index) => (
              <Card key={index} className="card-medical">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {condition.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(condition.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  {condition.evidence.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">
                        Evidence:
                      </h4>
                      <ul className="space-y-1">
                        {condition.evidence.map((evidence, evidenceIndex) => (
                          <li
                            key={evidenceIndex}
                            className="text-sm text-muted-foreground flex items-start"
                          >
                            <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {evidence}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="medications" className="space-y-4">
          {result.medications.length === 0 ? (
            <Card className="card-medical">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  No medications listed in this document.
                </p>
              </CardContent>
            </Card>
          ) : (
            result.medications.map((medication, index) => (
              <Card key={index} className="card-medical">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {medication.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {medication.dosage && (
                      <div>
                        <span className="font-medium text-foreground">
                          Dosage:
                        </span>
                        <span className="text-muted-foreground ml-2">
                          {medication.dosage}
                        </span>
                      </div>
                    )}
                    {medication.frequency && (
                      <div>
                        <span className="font-medium text-foreground">
                          Frequency:
                        </span>
                        <span className="text-muted-foreground ml-2">
                          {medication.frequency}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="vitals" className="space-y-4">
          {result.vitalSigns.length === 0 ? (
            <Card className="card-medical">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  No vital signs recorded in this document.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.vitalSigns.map((vital, index) => (
                <Card key={index} className="card-medical">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-foreground capitalize">
                        {vital.type}
                      </h3>
                      <Activity className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {vital.value} {vital.unit}
                    </div>
                    {vital.date && (
                      <p className="text-sm text-muted-foreground">
                        {vital.date}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <Card className="card-medical">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Analysis completed on{" "}
              {new Date(result.analysisDate).toLocaleString()}
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Full Report
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
