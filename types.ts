export interface StaticTestInput {
  projectTitle: string;
  userStory: string;
  acceptanceCriteria: string;
  prerequisites: string;
  additionalInfo: string;
}

export type SeverityType = 'critical' | 'high' | 'medium' | 'low';
export type PriorityType = 'high' | 'medium' | 'low';

interface SeverityBreakdown {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface ExecutiveSummary {
  totalDefects: number;
  severityBreakdown: SeverityBreakdown;
  primaryConcerns: string[];
  overallQualityAssessment: string;
}

export interface Defect {
  id: string;
  location: string;
  severity: SeverityType;
  type: string;
  description: string;
  impact: string;
  recommendation: string;
}

interface DefectsByCategory {
  requirements: Defect[];
  design: Defect[];
  code: Defect[];
  documentation: Defect[];
}

interface ImprovementRecommendation {
  priority: PriorityType;
  area: string;
  recommendation: string;
  rationale: string;
}

interface ReviewMetrics {
  artifactsReviewed: number;
  reviewCoverage: string;
  reviewDuration: string;
  reviewerConfidence: 'High' | 'Medium' | 'Low' | string;
}

export interface AnalysisResult {
  executiveSummary: ExecutiveSummary;
  defectsByCategory: DefectsByCategory;
  positiveFindings: string[];
  improvementRecommendations: ImprovementRecommendation[];
  reviewMetrics: ReviewMetrics;
}
