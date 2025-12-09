import OpenAI from 'openai';
import {
  PatientData,
  PatientAnalysis,
  HealthScore,
  RiskCategory,
  FutureRisk,
  HealthRecommendation,
  LifestyleProgram
} from '@/types/patient';
import { lifestylePrograms } from '@/data/programs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIHealthAnalyzer {

  async analyzePatient(patient: PatientData): Promise<PatientAnalysis> {
    const bmi = this.calculateBMI(patient.weight, patient.height);

    const prompt = `You are an expert clinical health analyst. Analyze the following patient data and provide a comprehensive health assessment.

Patient Information:
- Name: ${patient.name}
- Age: ${patient.age} years
- Gender: ${patient.gender}
- Blood Pressure: ${patient.bloodPressure.systolic}/${patient.bloodPressure.diastolic} mmHg
- Weight: ${patient.weight} kg
- Height: ${patient.height} cm
- BMI: ${bmi.toFixed(1)}
- Glucose: ${patient.glucose} mg/dL
- HDL Cholesterol: ${patient.vitals.hdl} mg/dL
- LDL Cholesterol: ${patient.vitals.ldl} mg/dL
- Total Cholesterol: ${patient.vitals.totalCholesterol} mg/dL
- Triglycerides: ${patient.vitals.triglycerides} mg/dL
- Smoking Status: ${patient.smokingStatus ? 'Yes' : 'No'}
- Alcohol Consumption: ${patient.alcoholConsumption}
- Physical Activity: ${patient.physicalActivity}

Available Lifestyle Programs:
${lifestylePrograms.map(p => `- ${p.id}: ${p.name} (${p.description})`).join('\n')}

Provide a comprehensive analysis in the following JSON format:
{
  "healthScore": {
    "overall": <number 0-100>,
    "cardiovascular": <number 0-100>,
    "metabolic": <number 0-100>,
    "lifestyle": <number 0-100>
  },
  "riskCategory": {
    "level": "<normal|potential-risk|high-risk>",
    "description": "<detailed explanation>"
  },
  "futureRisks": [
    {
      "condition": "<condition name>",
      "probability": "<low|moderate|high>",
      "timeframe": "<timeframe>",
      "description": "<detailed explanation>"
    }
  ],
  "recommendations": [
    {
      "category": "<category>",
      "priority": "<low|medium|high>",
      "recommendation": "<specific actionable recommendation>"
    }
  ],
  "recommendedProgramIds": ["<program IDs from the list above>"]
}

Guidelines:
- Health scores should be 0-100 where 100 is perfect health
- Risk level "normal" for scores 75+, "potential-risk" for 50-74, "high-risk" for <50
- Provide 3-6 future risks with realistic probabilities and timeframes
- Provide 4-8 specific, actionable recommendations
- Select 2-4 most relevant program IDs based on patient needs
- Be clinically accurate and consider all patient factors

Return only valid JSON, no additional text.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-5.1-chat-latest',
        messages: [
          {
            role: 'system',
            content: 'You are a clinical health analyst providing structured health assessments. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      const aiAnalysis = JSON.parse(content);

      const recommendedPrograms = this.mapProgramIds(aiAnalysis.recommendedProgramIds);

      const analysis: PatientAnalysis = {
        patientId: patient.id,
        patientName: patient.name,
        healthScore: aiAnalysis.healthScore as HealthScore,
        riskCategory: aiAnalysis.riskCategory as RiskCategory,
        futureRisks: aiAnalysis.futureRisks as FutureRisk[],
        recommendations: aiAnalysis.recommendations as HealthRecommendation[],
        recommendedPrograms: recommendedPrograms,
        analysisDate: new Date().toISOString(),
      };

      return analysis;
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw new Error('Failed to analyze patient data with AI');
    }
  }

  private calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }

  private mapProgramIds(programIds: string[]): LifestyleProgram[] {
    return programIds
      .map(id => lifestylePrograms.find(p => p.id === id))
      .filter((p): p is LifestyleProgram => p !== undefined);
  }
}
