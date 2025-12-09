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

// ==========================================
// Health Trend Tracker Types
// ==========================================

export interface VitalReading {
  date: string;
  value: number;
}

export interface PatientHistory {
  patientId: string;
  bloodPressureSystolic: VitalReading[];
  bloodPressureDiastolic: VitalReading[];
  glucose: VitalReading[];
  weight: VitalReading[];
  hdl: VitalReading[];
  ldl: VitalReading[];
  totalCholesterol: VitalReading[];
  triglycerides: VitalReading[];
}

export interface VitalTrend {
  vital: string;
  trend: 'improving' | 'stable' | 'declining';
  percentChange: number;
  analysis: string;
}

export interface TrendAlert {
  type: 'warning' | 'critical';
  message: string;
}

export interface TrendAnalysis {
  patientId: string;
  overallTrend: 'improving' | 'stable' | 'declining';
  trendSummary: string;
  vitalTrends: VitalTrend[];
  alerts: TrendAlert[];
  analysisDate: string;
}

// ==========================================
// Smart Appointment Scheduler Types
// ==========================================

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  scheduledDate: string;
  type: 'follow-up' | 'routine-checkup' | 'urgent' | 'program-review';
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'completed' | 'cancelled';
  aiGenerated: boolean;
  notes?: string;
}

export interface AppointmentSuggestion {
  patientId: string;
  patientName: string;
  suggestedDate: string;
  suggestedType: Appointment['type'];
  priority: Appointment['priority'];
  reasoning: string;
  basedOn: string[];
}
