import { motion } from 'framer-motion';
import { FileText, Brain, Clock, TrendingUp, AlertTriangle, CheckCircle, Upload, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ResultsSectionProps {
  onStartNew: () => void;
}

const mockResults = {
  conditions: [
    { name: 'Hypertension', confidence: 92, severity: 'moderate' },
    { name: 'High Cholesterol', confidence: 78, severity: 'mild' },
    { name: 'Diabetes Risk', confidence: 45, severity: 'low' }
  ],
  timeline: [
    { date: '2024-01-15', event: 'Blood pressure medication prescribed', source: 'Prescription.pdf' },
    { date: '2024-01-10', event: 'Lab results showing elevated cholesterol', source: 'Lab_Results.pdf' },
    { date: '2023-12-20', event: 'Initial hypertension diagnosis', source: 'Doctor_Report.pdf' }
  ],
  recommendations: [
    { type: 'urgent', text: 'Schedule follow-up with cardiologist within 2 weeks', icon: AlertTriangle },
    { type: 'soon', text: 'Start cholesterol medication as prescribed', icon: Clock },
    { type: 'normal', text: 'Continue monitoring blood pressure daily', icon: CheckCircle }
  ],
  healthScore: 75
};

export const ResultsSection = ({ onStartNew }: ResultsSectionProps) => {
  return (
    <section className="medical-section min-h-screen">
      <div className="medical-container">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-medical-title mb-4">Your Medical Analysis Results</h1>
            <p className="text-medical-body max-w-2xl mx-auto">
              Based on your uploaded documents, here's a comprehensive analysis of your health status and actionable recommendations.
            </p>
          </motion.div>

          {/* Health Score Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-medical-glow mb-8 text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="40"
                    stroke="hsl(var(--border))" strokeWidth="8" fill="none"
                    className="opacity-20"
                  />
                  <motion.circle
                    cx="50" cy="50" r="40"
                    stroke="url(#healthGradient)" strokeWidth="8" fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - mockResults.healthScore / 100)}`}
                    initial={{ strokeDashoffset: `${2 * Math.PI * 40}` }}
                    animate={{ strokeDashoffset: `${2 * Math.PI * 40 * (1 - mockResults.healthScore / 100)}` }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--accent))" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground">{mockResults.healthScore}</div>
                    <div className="text-sm text-muted-foreground">Health Score</div>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Overall Health Assessment</h2>
            <p className="text-muted-foreground">Good health status with some areas requiring attention</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Detected Conditions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="card-medical h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <span>Detected Conditions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockResults.conditions.map((condition, index) => (
                    <motion.div
                      key={condition.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="bg-muted rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-foreground">{condition.name}</h3>
                        <div className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${condition.severity === 'high' ? 'status-critical' : 
                            condition.severity === 'moderate' ? 'status-warning' : 'status-normal'}
                        `}>
                          {condition.severity}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <Progress value={condition.confidence} className="h-2" />
                        </div>
                        <span className="text-sm font-mono text-muted-foreground">
                          {condition.confidence}% confidence
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="card-medical h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span>Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockResults.recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className={`
                        p-3 rounded-lg border-l-4 
                        ${rec.type === 'urgent' ? 'bg-destructive-soft border-destructive' :
                          rec.type === 'soon' ? 'bg-warning-soft border-warning' : 'bg-accent-soft border-accent'}
                      `}
                    >
                      <div className="flex items-start space-x-2">
                        <rec.icon className={`
                          w-4 h-4 mt-0.5 
                          ${rec.type === 'urgent' ? 'text-destructive' :
                            rec.type === 'soon' ? 'text-warning' : 'text-accent'}
                        `} />
                        <p className="text-sm text-foreground">{rec.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Timeline Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Card className="card-medical">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Timeline Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockResults.timeline.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start space-x-4 pb-4 border-b border-border last:border-b-0"
                    >
                      <div className="w-3 h-3 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-foreground">{event.event}</p>
                          <span className="text-xs text-muted-foreground">{event.date}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Source: {event.source}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
          >
            <Button className="btn-medical-primary">
              <Download className="w-5 h-5 mr-2" />
              Download Report
            </Button>
            <Button className="btn-medical-secondary">
              <Share2 className="w-5 h-5 mr-2" />
              Share with Doctor
            </Button>
            <Button 
              onClick={onStartNew}
              className="btn-medical-secondary"
            >
              <Upload className="w-5 h-5 mr-2" />
              Analyze New Documents
            </Button>
          </motion.div>

          {/* Backend Integration Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-primary-soft border border-primary/20 rounded-xl p-6 mt-8 text-center"
          >
            <Brain className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-primary mb-2">Ready for Backend Integration</h3>
            <p className="text-sm text-primary/80 mb-4">
              To enable real document processing, user authentication, and data storage, connect your project to Supabase.
            </p>
            <p className="text-xs text-primary/60">
              Click the green Supabase button in the top right to get started with the backend integration.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};