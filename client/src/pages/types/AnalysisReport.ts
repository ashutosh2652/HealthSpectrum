// TypeScript interfaces based on the Mongoose schema
export interface EvidenceSnippet {
  documentId: string;
  text: string;
  page: number;
}

export interface UserFeedback {
  isValidated?: boolean;
  notes?: string;
}

export interface ConditionDetected {
  name: string;
  confidenceScore: number;
  estimatedOnsetDate?: Date;
  explanation?: string;
  evidenceSnippets: EvidenceSnippet[];
  userFeedback?: UserFeedback;
}

export interface MedicationMentioned {
  name: string;
  dosage?: string;
  reason?: string;
}

export interface TestExplained {
  name: string;
  reason?: string;
}

export interface FutureRisk {
  text: string;
  confidenceScore: number;
}

export interface Recommendation {
  text: string;
  urgency: 'normal' | 'soon' | 'urgent';
}

export interface AnalysisReport {
  _id: string;
  patientId: string;
  sourceDocuments: string[];
  summary?: string;
  conditionsDetected: ConditionDetected[];
  medicationsMentioned: MedicationMentioned[];
  testsExplained: TestExplained[];
  futureRisks: FutureRisk[];
  recommendations: Recommendation[];
  createdAt: Date;
  updatedAt: Date;
}