export interface VitalsData {
  hdl: number;
  ldl: number;
  totalCholesterol: number;
  triglycerides: number;
}

export interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  weight: number;
  height: number;
  glucose: number;
  vitals: VitalsData;
  smokingStatus: boolean;
  alcoholConsumption: 'none' | 'moderate' | 'heavy';
  physicalActivity: 'sedentary' | 'light' | 'moderate' | 'active';
}

export interface HealthScore {
  overall: number;
  cardiovascular: number;
  metabolic: number;
  lifestyle: number;
}

export interface RiskCategory {
  level: 'normal' | 'potential-risk' | 'high-risk';
  description: string;
}

export interface FutureRisk {
  condition: string;
  probability: 'low' | 'moderate' | 'high';
  timeframe: string;
  description: string;
}

export interface HealthRecommendation {
  category: string;
  priority: 'low' | 'medium' | 'high';
  recommendation: string;
}

export interface LifestyleProgram {
  id: string;
  name: string;
  description: string;
  targetConditions: string[];
  duration: string;
}

export interface PatientAnalysis {
  patientId: string;
  patientName: string;
  healthScore: HealthScore;
  riskCategory: RiskCategory;
  futureRisks: FutureRisk[];
  recommendations: HealthRecommendation[];
  recommendedPrograms: LifestyleProgram[];
  analysisDate: string;
}
