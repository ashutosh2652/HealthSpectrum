import { AnalysisReport } from '../types/AnalysisReport';

export const demoAnalysisReport: AnalysisReport = {
  _id: '507f1f77bcf86cd799439011',
  patientId: '507f1f77bcf86cd799439012',
  sourceDocuments: ['507f1f77bcf86cd799439013', '507f1f77bcf86cd799439014'],
  summary: `Comprehensive health analysis reveals moderate cardiovascular risks with well-managed hypertension and elevated cholesterol levels. The patient shows good medication compliance with prescribed treatments. Regular monitoring and lifestyle modifications are recommended to maintain optimal health outcomes.`,
  conditionsDetected: [
    {
      name: 'Hypertension',
      confidenceScore: 88,
      estimatedOnsetDate: new Date('2023-03-15'),
      explanation: 'Consistently elevated blood pressure readings above 140/90 mmHg documented across multiple visits. Well-controlled with current medication regimen.',
      evidenceSnippets: [
        {
          documentId: '507f1f77bcf86cd799439013',
          text: 'BP measured 145/95 on multiple occasions during routine visits',
          page: 3
        },
        {
          documentId: '507f1f77bcf86cd799439014',
          text: 'Patient reports good compliance with Lisinopril 10mg daily',
          page: 2
        }
      ],
      userFeedback: {
        isValidated: true,
        notes: 'Confirmed by cardiologist consultation'
      }
    },
    {
      name: 'High Cholesterol',
      confidenceScore: 75,
      estimatedOnsetDate: new Date('2023-01-20'),
      explanation: 'Total cholesterol levels consistently above 240 mg/dL with elevated LDL cholesterol. Responding well to statin therapy.',
      evidenceSnippets: [
        {
          documentId: '507f1f77bcf86cd799439013',
          text: 'Total cholesterol: 248 mg/dL, LDL: 165 mg/dL, HDL: 42 mg/dL',
          page: 5
        }
      ]
    },
    {
      name: 'Migraine Headaches',
      confidenceScore: 90,
      estimatedOnsetDate: new Date('2022-08-01'),
      explanation: 'Recurrent episodes of severe headaches with typical migraine characteristics including photophobia and nausea.',
      evidenceSnippets: [
        {
          documentId: '507f1f77bcf86cd799439014',
          text: 'Patient reported headache episodes 2-3 times per week with visual aura',
          page: 2
        }
      ]
    }
  ],
  medicationsMentioned: [
    {
      name: 'Lisinopril',
      dosage: '10mg daily',
      reason: 'Blood pressure control'
    },
    {
      name: 'Atorvastatin',
      dosage: '20mg daily',
      reason: 'Cholesterol management'
    },
    {
      name: 'Aspirin',
      dosage: '81mg daily',
      reason: 'Cardiovascular protection'
    },
    {
      name: 'Sumatriptan',
      dosage: '50mg as needed',
      reason: 'Migraine relief'
    }
  ],
  testsExplained: [
    {
      name: 'Lipid Panel',
      reason: 'Monitor cholesterol levels and assess cardiovascular risk'
    },
    {
      name: 'Basic Metabolic Panel',
      reason: 'Evaluate kidney function and electrolyte balance'
    },
    {
      name: 'ECG',
      reason: 'Assess cardiac rhythm and detect potential abnormalities'
    },
    {
      name: 'MRI Brain',
      reason: 'Rule out secondary causes of headaches'
    }
  ],
  futureRisks: [
    {
      text: 'Increased risk of cardiovascular events due to hypertension and hyperlipidemia',
      confidenceScore: 72
    },
    {
      text: 'Potential for medication overuse headaches with frequent triptan use',
      confidenceScore: 65
    },
    {
      text: 'Risk of stroke due to combination of hypertension and migraine with aura',
      confidenceScore: 58
    }
  ],
  recommendations: [
    {
      text: 'Continue current antihypertensive therapy and monitor BP monthly',
      urgency: 'normal'
    },
    {
      text: 'Schedule cardiology consultation within 2 weeks for risk stratification',
      urgency: 'soon'
    },
    {
      text: 'Immediate lifestyle modifications: reduce sodium intake to <2g daily',
      urgency: 'urgent'
    },
    {
      text: 'Follow up with lipid panel in 3 months to assess statin effectiveness',
      urgency: 'normal'
    },
    {
      text: 'Consider migraine prophylaxis if headache frequency increases',
      urgency: 'soon'
    }
  ],
  createdAt: new Date('2025-01-20T10:30:00Z'),
  updatedAt: new Date('2025-01-20T10:30:00Z')
};