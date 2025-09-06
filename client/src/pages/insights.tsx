import { motion } from "framer-motion";
import {
  AlertTriangle,
  Brain,
  FileText,
  TestTube,
  Heart,
  Pill,
  ScrollText,
  Stethoscope,
  ThumbsUp,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// This would come from your API/state management
const mockInsightData = {
  summary: "Patient shows signs of hypertension and elevated cholesterol levels. Regular monitoring and lifestyle changes recommended.",
  conditionsDetected: [
    {
      name: "Hypertension",
      confidenceScore: 0.92,
      estimatedOnsetDate: "2024-12-01",
      explanation: "Consistent blood pressure readings above 140/90 mmHg",
      evidenceSnippets: [
        {
          text: "BP reading: 145/95 mmHg on multiple occasions",
          page: 1
        }
      ]
    },
    {
      name: "High Cholesterol",
      confidenceScore: 0.85,
      estimatedOnsetDate: "2024-11-15",
      explanation: "LDL levels consistently above recommended range",
      evidenceSnippets: [
        {
          text: "LDL: 162 mg/dL, HDL: 45 mg/dL",
          page: 2
        }
      ]
    }
  ],
  medicationsMentioned: [
    {
      name: "Lisinopril",
      dosage: "10mg daily",
      reason: "Blood pressure management"
    },
    {
      name: "Atorvastatin",
      dosage: "20mg daily",
      reason: "Cholesterol management"
    }
  ],
  testsExplained: [
    {
      name: "Lipid Panel",
      reason: "Monitor cholesterol levels and cardiovascular health"
    },
    {
      name: "Blood Pressure Monitoring",
      reason: "Track effectiveness of hypertension management"
    }
  ],
  futureRisks: [
    {
      text: "Increased risk of cardiovascular events if blood pressure remains uncontrolled",
      confidenceScore: 0.88
    },
    {
      text: "Potential for atherosclerosis development due to elevated cholesterol",
      confidenceScore: 0.82
    }
  ],
  recommendations: [
    {
      text: "Schedule follow-up appointment in 3 months",
      urgency: "normal"
    },
    {
      text: "Begin daily blood pressure monitoring",
      urgency: "soon"
    },
    {
      text: "Consider dietary consultation for cholesterol management",
      urgency: "normal"
    }
  ]
};

const InsightsPage = () => {
  return (
    <div className="min-h-screen bg-background cosmic-bg">
      <div className="absolute inset-0 stars-pattern opacity-30" />
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Medical Document Analysis
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            AI-powered analysis of your medical documents, providing key insights and recommendations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Summary and Conditions */}
          <div className="space-y-6">
            {/* Summary Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ScrollText className="h-5 w-5 text-primary" />
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/90">{mockInsightData.summary}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Conditions Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    Detected Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {mockInsightData.conditionsDetected.map((condition, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            {condition.name}
                            <Badge variant="secondary">
                              {Math.round(condition.confidenceScore * 100)}%
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              {condition.explanation}
                            </p>
                            <div className="bg-background/50 p-2 rounded-md">
                              <p className="text-xs text-foreground/70">
                                Evidence: {condition.evidenceSnippets[0].text}
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Middle Column - Medications and Tests */}
          <div className="space-y-6">
            {/* Medications Card */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-primary" />
                    Medications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockInsightData.medicationsMentioned.map((med, index) => (
                      <div
                        key={index}
                        className="p-3 bg-background/50 rounded-lg border border-border/50"
                      >
                        <h4 className="font-medium text-foreground">{med.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Dosage: {med.dosage}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Purpose: {med.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tests Card */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5 text-primary" />
                    Medical Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockInsightData.testsExplained.map((test, index) => (
                      <div
                        key={index}
                        className="p-3 bg-background/50 rounded-lg border border-border/50"
                      >
                        <h4 className="font-medium text-foreground">{test.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {test.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Risks and Recommendations */}
          <div className="space-y-6">
            {/* Risks Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    Potential Risks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockInsightData.futureRisks.map((risk, index) => (
                      <div
                        key={index}
                        className="p-3 bg-background/50 rounded-lg border border-border/50"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-sm text-foreground">{risk.text}</p>
                          <Badge variant="outline">
                            {Math.round(risk.confidenceScore * 100)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommendations Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5 text-primary" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockInsightData.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="p-3 bg-background/50 rounded-lg border border-border/50"
                      >
                        <div className="flex items-start gap-2">
                          <p className="text-sm text-foreground flex-1">
                            {rec.text}
                          </p>
                          <Badge
                            variant={
                              rec.urgency === "urgent"
                                ? "destructive"
                                : rec.urgency === "soon"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {rec.urgency}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InsightsPage;
