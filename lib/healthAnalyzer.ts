import {
  PatientData,
  HealthScore,
  RiskCategory,
  FutureRisk,
  HealthRecommendation,
  LifestyleProgram,
  PatientAnalysis
} from '@/types/patient';
import { lifestylePrograms } from '@/data/programs';

export class HealthAnalyzer {

  calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }

  calculateHealthScore(patient: PatientData): HealthScore {
    const cardiovascularScore = this.calculateCardiovascularScore(patient);
    const metabolicScore = this.calculateMetabolicScore(patient);
    const lifestyleScore = this.calculateLifestyleScore(patient);

    const overall = Math.round((cardiovascularScore + metabolicScore + lifestyleScore) / 3);

    return {
      overall,
      cardiovascular: cardiovascularScore,
      metabolic: metabolicScore,
      lifestyle: lifestyleScore,
    };
  }

  private calculateCardiovascularScore(patient: PatientData): number {
    let score = 100;

    if (patient.bloodPressure.systolic > 140 || patient.bloodPressure.diastolic > 90) {
      score -= 25;
    } else if (patient.bloodPressure.systolic > 130 || patient.bloodPressure.diastolic > 85) {
      score -= 15;
    } else if (patient.bloodPressure.systolic > 120 || patient.bloodPressure.diastolic > 80) {
      score -= 8;
    }

    if (patient.vitals.totalCholesterol > 240) {
      score -= 20;
    } else if (patient.vitals.totalCholesterol > 200) {
      score -= 10;
    }

    if (patient.vitals.ldl > 160) {
      score -= 15;
    } else if (patient.vitals.ldl > 130) {
      score -= 8;
    }

    if (patient.vitals.hdl < 40) {
      score -= 12;
    } else if (patient.vitals.hdl < 50) {
      score -= 6;
    }

    if (patient.vitals.triglycerides > 200) {
      score -= 15;
    } else if (patient.vitals.triglycerides > 150) {
      score -= 8;
    }

    return Math.max(0, Math.min(100, score));
  }

  private calculateMetabolicScore(patient: PatientData): number {
    let score = 100;
    const bmi = this.calculateBMI(patient.weight, patient.height);

    if (patient.glucose >= 126) {
      score -= 30;
    } else if (patient.glucose >= 100) {
      score -= 15;
    }

    if (bmi >= 30) {
      score -= 20;
    } else if (bmi >= 25) {
      score -= 10;
    }

    if (patient.age > 50) {
      score -= 5;
    } else if (patient.age > 40) {
      score -= 3;
    }

    return Math.max(0, Math.min(100, score));
  }

  private calculateLifestyleScore(patient: PatientData): number {
    let score = 100;

    if (patient.smokingStatus) {
      score -= 30;
    }

    if (patient.alcoholConsumption === 'heavy') {
      score -= 20;
    } else if (patient.alcoholConsumption === 'moderate') {
      score -= 10;
    }

    if (patient.physicalActivity === 'sedentary') {
      score -= 25;
    } else if (patient.physicalActivity === 'light') {
      score -= 12;
    } else if (patient.physicalActivity === 'moderate') {
      score -= 5;
    }

    return Math.max(0, Math.min(100, score));
  }

  determineRiskCategory(healthScore: HealthScore): RiskCategory {
    const overall = healthScore.overall;

    if (overall >= 75) {
      return {
        level: 'normal',
        description: 'Patient is in good health with minimal risk factors',
      };
    } else if (overall >= 50) {
      return {
        level: 'potential-risk',
        description: 'Patient shows some concerning indicators that require monitoring',
      };
    } else {
      return {
        level: 'high-risk',
        description: 'Patient has multiple risk factors requiring immediate attention',
      };
    }
  }

  assessFutureRisks(patient: PatientData): FutureRisk[] {
    const risks: FutureRisk[] = [];
    const bmi = this.calculateBMI(patient.weight, patient.height);

    if (patient.bloodPressure.systolic > 140 || patient.bloodPressure.diastolic > 90) {
      risks.push({
        condition: 'Hypertensive Crisis',
        probability: 'high',
        timeframe: '1-2 years',
        description: 'Elevated blood pressure increases risk of stroke and heart attack',
      });
    } else if (patient.bloodPressure.systolic > 130 || patient.bloodPressure.diastolic > 85) {
      risks.push({
        condition: 'Hypertension',
        probability: 'moderate',
        timeframe: '2-3 years',
        description: 'Blood pressure is in pre-hypertensive range',
      });
    }

    if (patient.glucose >= 126) {
      risks.push({
        condition: 'Type 2 Diabetes',
        probability: 'high',
        timeframe: 'Current',
        description: 'Blood glucose levels indicate diabetes',
      });
    } else if (patient.glucose >= 100) {
      risks.push({
        condition: 'Type 2 Diabetes',
        probability: 'moderate',
        timeframe: '3-5 years',
        description: 'Prediabetic glucose levels increase diabetes risk',
      });
    }

    if (patient.vitals.ldl > 160 || patient.vitals.totalCholesterol > 240) {
      risks.push({
        condition: 'Cardiovascular Disease',
        probability: 'high',
        timeframe: '2-5 years',
        description: 'High cholesterol increases risk of heart disease and stroke',
      });
    } else if (patient.vitals.ldl > 130 || patient.vitals.totalCholesterol > 200) {
      risks.push({
        condition: 'Cardiovascular Disease',
        probability: 'moderate',
        timeframe: '5-10 years',
        description: 'Elevated cholesterol may lead to arterial plaque buildup',
      });
    }

    if (bmi >= 30) {
      risks.push({
        condition: 'Obesity-related Complications',
        probability: 'high',
        timeframe: '1-3 years',
        description: 'Obesity increases risk of diabetes, heart disease, and joint problems',
      });
    }

    if (patient.smokingStatus) {
      risks.push({
        condition: 'Lung Disease and Cancer',
        probability: 'high',
        timeframe: '5-15 years',
        description: 'Smoking significantly increases risk of respiratory diseases and cancer',
      });
    }

    if (patient.alcoholConsumption === 'heavy') {
      risks.push({
        condition: 'Liver Disease',
        probability: 'moderate',
        timeframe: '5-10 years',
        description: 'Heavy alcohol consumption can lead to liver damage',
      });
    }

    if (risks.length === 0) {
      risks.push({
        condition: 'General Age-related Decline',
        probability: 'low',
        timeframe: '10+ years',
        description: 'Normal age-related health changes expected',
      });
    }

    return risks;
  }

  generateRecommendations(patient: PatientData): HealthRecommendation[] {
    const recommendations: HealthRecommendation[] = [];
    const bmi = this.calculateBMI(patient.weight, patient.height);

    if (patient.bloodPressure.systolic > 140 || patient.bloodPressure.diastolic > 90) {
      recommendations.push({
        category: 'Cardiovascular',
        priority: 'high',
        recommendation: 'Reduce sodium intake to less than 2,300mg per day and monitor blood pressure daily',
      });
    }

    if (patient.vitals.ldl > 130 || patient.vitals.totalCholesterol > 200) {
      recommendations.push({
        category: 'Nutrition',
        priority: 'high',
        recommendation: 'Adopt a heart-healthy diet rich in fiber, omega-3 fatty acids, and limit saturated fats',
      });
    }

    if (patient.glucose >= 100) {
      recommendations.push({
        category: 'Nutrition',
        priority: patient.glucose >= 126 ? 'high' : 'medium',
        recommendation: 'Follow a low-glycemic diet, limit refined carbohydrates and sugars',
      });
    }

    if (bmi >= 25) {
      recommendations.push({
        category: 'Weight Management',
        priority: bmi >= 30 ? 'high' : 'medium',
        recommendation: 'Work towards achieving a healthy BMI through balanced diet and regular exercise',
      });
    }

    if (patient.smokingStatus) {
      recommendations.push({
        category: 'Smoking Cessation',
        priority: 'high',
        recommendation: 'Enroll in a smoking cessation program immediately to reduce health risks',
      });
    }

    if (patient.alcoholConsumption === 'heavy') {
      recommendations.push({
        category: 'Alcohol Reduction',
        priority: 'high',
        recommendation: 'Reduce alcohol consumption to moderate levels or seek support for alcohol dependency',
      });
    }

    if (patient.physicalActivity === 'sedentary' || patient.physicalActivity === 'light') {
      recommendations.push({
        category: 'Physical Activity',
        priority: 'medium',
        recommendation: 'Aim for at least 150 minutes of moderate aerobic activity per week',
      });
    }

    if (patient.vitals.hdl < 40) {
      recommendations.push({
        category: 'Cardiovascular',
        priority: 'medium',
        recommendation: 'Increase HDL cholesterol through regular exercise and healthy fats consumption',
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        category: 'Preventive Care',
        priority: 'low',
        recommendation: 'Continue maintaining current healthy lifestyle and regular check-ups',
      });
    }

    return recommendations;
  }

  recommendPrograms(patient: PatientData): LifestyleProgram[] {
    const recommendedPrograms: LifestyleProgram[] = [];
    const conditions = new Set<string>();
    const bmi = this.calculateBMI(patient.weight, patient.height);

    if (patient.bloodPressure.systolic > 130 || patient.bloodPressure.diastolic > 85) {
      conditions.add('hypertension');
      conditions.add('cardiovascular-risk');
    }

    if (patient.vitals.totalCholesterol > 200 || patient.vitals.ldl > 130) {
      conditions.add('high-cholesterol');
      conditions.add('cardiovascular-risk');
    }

    if (patient.glucose >= 100) {
      if (patient.glucose >= 126) {
        conditions.add('diabetes');
      } else {
        conditions.add('prediabetes');
      }
      conditions.add('metabolic-syndrome');
    }

    if (bmi >= 25) {
      if (bmi >= 30) {
        conditions.add('obesity');
      } else {
        conditions.add('overweight');
      }
      conditions.add('metabolic-syndrome');
    }

    if (patient.smokingStatus) {
      conditions.add('smoking');
      conditions.add('cardiovascular-risk');
      conditions.add('respiratory-issues');
    }

    if (patient.alcoholConsumption === 'heavy') {
      conditions.add('alcohol-dependency');
      conditions.add('liver-health');
      conditions.add('metabolic-issues');
    }

    if (patient.physicalActivity === 'sedentary') {
      conditions.add('sedentary-lifestyle');
      conditions.add('cardiovascular-risk');
    }

    if (conditions.size === 0) {
      conditions.add('general-wellness');
      conditions.add('prevention');
    }

    for (const program of lifestylePrograms) {
      const hasMatchingCondition = program.targetConditions.some(condition =>
        conditions.has(condition)
      );
      if (hasMatchingCondition && !recommendedPrograms.find(p => p.id === program.id)) {
        recommendedPrograms.push(program);
      }
    }

    return recommendedPrograms.slice(0, 4);
  }

  analyzePatient(patient: PatientData): PatientAnalysis {
    const healthScore = this.calculateHealthScore(patient);
    const riskCategory = this.determineRiskCategory(healthScore);
    const futureRisks = this.assessFutureRisks(patient);
    const recommendations = this.generateRecommendations(patient);
    const recommendedPrograms = this.recommendPrograms(patient);

    return {
      patientId: patient.id,
      patientName: patient.name,
      healthScore,
      riskCategory,
      futureRisks,
      recommendations,
      recommendedPrograms,
      analysisDate: new Date().toISOString(),
    };
  }
}
