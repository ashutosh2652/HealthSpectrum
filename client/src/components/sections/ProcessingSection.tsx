import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Eye, Brain, FileCheck, Clock, Zap } from 'lucide-react';

interface ProcessingSectionProps {
  onComplete: () => void;
}

const steps = [
  {
    id: 'upload',
    title: 'Uploading Documents',
    description: 'Securely transferring your files',
    icon: Upload,
    duration: 1000
  },
  {
    id: 'ocr',
    title: 'OCR Scanning',
    description: 'Extracting text from documents',
    icon: Eye,
    duration: 2000
  },
  {
    id: 'analysis',
    title: 'AI Analysis',
    description: 'Analyzing medical content and extracting insights',
    icon: Brain,
    duration: 3000
  },
  {
    id: 'summary',
    title: 'Generating Summary',
    description: 'Creating your personalized health report',
    icon: FileCheck,
    duration: 1500
  }
];

export const ProcessingSection = ({ onComplete }: ProcessingSectionProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let totalTime = 0;
    const intervals: NodeJS.Timeout[] = [];

    steps.forEach((step, index) => {
      const timeout = setTimeout(() => {
        setCurrentStep(index);
        
        // Animate progress for current step
        const stepInterval = setInterval(() => {
          setProgress(prev => {
            const newProgress = Math.min(prev + 1, ((index + 1) / steps.length) * 100);
            return newProgress;
          });
        }, step.duration / 100);
        
        intervals.push(stepInterval);
        
        // Clear interval and move to next step
        setTimeout(() => {
          clearInterval(stepInterval);
          if (index === steps.length - 1) {
            setTimeout(onComplete, 500);
          }
        }, step.duration);
        
      }, totalTime);
      
      totalTime += step.duration;
    });

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [onComplete]);

  return (
    <section className="medical-section min-h-screen flex items-center">
      <div className="medical-container w-full">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-medical-title mb-4">Analyzing Your Documents</h1>
            <p className="text-medical-body">
              Our AI is carefully reviewing your medical documents to provide accurate insights.
            </p>
          </motion.div>

          {/* Progress Circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-64 h-64 mx-auto mb-12"
          >
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="hsl(var(--border))"
                strokeWidth="4"
                fill="none"
                className="opacity-20"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 mx-auto"
                >
                  {React.createElement(steps[currentStep]?.icon || Brain, {
                    className: "w-8 h-8 text-primary-foreground"
                  })}
                </motion.div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {Math.round(progress)}%
                </div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
          </motion.div>

          {/* Current Step */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {steps[currentStep]?.title}
            </h2>
            <p className="text-muted-foreground">
              {steps[currentStep]?.description}
            </p>
          </motion.div>

          {/* Step Progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  card-medical text-center transition-all duration-500
                  ${index <= currentStep 
                    ? 'bg-primary-soft border-primary/30' 
                    : 'opacity-50'
                  }
                `}
              >
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-500
                  ${index <= currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {index < currentStep ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <FileCheck className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                <h3 className="font-medium text-foreground mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Processing Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="card-medical text-center">
              <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground mb-1">~45s</div>
              <div className="text-sm text-muted-foreground">Estimated Time</div>
            </div>
            
            <div className="card-medical text-center">
              <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground mb-1">2 Files</div>
              <div className="text-sm text-muted-foreground">Processing</div>
            </div>
            
            <div className="card-medical text-center">
              <Brain className="w-8 h-8 text-warning mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground mb-1">AI Model</div>
              <div className="text-sm text-muted-foreground">Medical-GPT v2</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};