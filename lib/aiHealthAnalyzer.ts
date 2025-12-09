import OpenAI from 'openai';
import {
  PatientData,
  PatientAnalysis,
  PatientHistory,
  TrendAnalysis,
  AppointmentSuggestion,
  HealthScore,
  RiskCategory,
  FutureRisk,
  HealthRecommendation,
  LifestyleProgram,
  VitalTrend,
  TrendAlert
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

  async analyzeTrends(history: PatientHistory, patient: PatientData): Promise<TrendAnalysis> {
    const formatHistory = (readings: { date: string; value: number }[]) =>
      readings.map(r => `${r.date}: ${r.value}`).join(', ');

    const prompt = `You are an expert clinical health analyst specializing in longitudinal health data analysis. Analyze the following 6-month vital sign history for a patient and identify trends.

Patient: ${patient.name} (${patient.age} years old, ${patient.gender})

Historical Vital Signs (6 months):

Blood Pressure Systolic (mmHg): ${formatHistory(history.bloodPressureSystolic)}
Blood Pressure Diastolic (mmHg): ${formatHistory(history.bloodPressureDiastolic)}
Glucose (mg/dL): ${formatHistory(history.glucose)}
Weight (kg): ${formatHistory(history.weight)}
HDL Cholesterol (mg/dL): ${formatHistory(history.hdl)}
LDL Cholesterol (mg/dL): ${formatHistory(history.ldl)}
Total Cholesterol (mg/dL): ${formatHistory(history.totalCholesterol)}
Triglycerides (mg/dL): ${formatHistory(history.triglycerides)}

Analyze these trends and provide your assessment in the following JSON format:
{
  "overallTrend": "<improving|stable|declining>",
  "trendSummary": "<2-3 sentence summary of overall health trajectory>",
  "vitalTrends": [
    {
      "vital": "<vital name>",
      "trend": "<improving|stable|declining>",
      "percentChange": <number - positive for increase, negative for decrease>,
      "analysis": "<brief analysis of this vital's trend>"
    }
  ],
  "alerts": [
    {
      "type": "<warning|critical>",
      "message": "<alert message for concerning trends>"
    }
  ]
}

Guidelines:
- Consider clinical significance when determining trends (small fluctuations may be "stable")
- For vitals like LDL, weight, BP - decreasing is generally "improving"
- For HDL - increasing is "improving"
- Include 6-8 vital trends (all major metrics)
- Only include alerts for genuinely concerning trends (0-3 alerts typically)
- Critical alerts for dangerous patterns, warning for concerning patterns
- Calculate percent change from first to last reading

Return only valid JSON, no additional text.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-5.1-chat-latest',
        messages: [
          {
            role: 'system',
            content: 'You are a clinical health analyst specializing in trend analysis. Always respond with valid JSON only.'
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

      const aiTrends = JSON.parse(content);

      const trendAnalysis: TrendAnalysis = {
        patientId: history.patientId,
        overallTrend: aiTrends.overallTrend,
        trendSummary: aiTrends.trendSummary,
        vitalTrends: aiTrends.vitalTrends as VitalTrend[],
        alerts: aiTrends.alerts as TrendAlert[],
        analysisDate: new Date().toISOString(),
      };

      return trendAnalysis;
    } catch (error) {
      console.error('AI Trend Analysis Error:', error);
      throw new Error('Failed to analyze patient trends with AI');
    }
  }

  async suggestAppointment(
    patient: PatientData,
    analysis: PatientAnalysis,
    trendAnalysis?: TrendAnalysis
  ): Promise<AppointmentSuggestion> {
    const trendInfo = trendAnalysis
      ? `\nHealth Trends: ${trendAnalysis.overallTrend} - ${trendAnalysis.trendSummary}
Alerts: ${trendAnalysis.alerts.length > 0 ? trendAnalysis.alerts.map(a => `[${a.type}] ${a.message}`).join('; ') : 'None'}`
      : '';

    const prompt = `You are a clinical scheduling assistant. Based on the patient's health analysis and trends, suggest an appropriate follow-up appointment.

Patient: ${patient.name}
Age: ${patient.age} years
Risk Category: ${analysis.riskCategory.level}
Risk Description: ${analysis.riskCategory.description}
Overall Health Score: ${analysis.healthScore.overall}/100
${trendInfo}

Key Future Risks:
${analysis.futureRisks.slice(0, 3).map(r => `- ${r.condition} (${r.probability} probability)`).join('\n')}

Current Date: ${new Date().toISOString().split('T')[0]}

Appointment Scheduling Guidelines:
- High-risk patients: Follow-up in 1-2 weeks
- Potential-risk patients: Follow-up in 2-4 weeks
- Normal patients: Routine checkup in 2-3 months
- Declining trends: Consider earlier appointment regardless of risk level
- Critical alerts: Urgent appointment within 1 week

Provide your appointment suggestion in the following JSON format:
{
  "suggestedDate": "<YYYY-MM-DD format>",
  "suggestedType": "<follow-up|routine-checkup|urgent|program-review>",
  "priority": "<low|medium|high|urgent>",
  "reasoning": "<2-3 sentence explanation for this recommendation>",
  "basedOn": ["<factor 1>", "<factor 2>", "<factor 3>"]
}

Return only valid JSON, no additional text.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-5.1-chat-latest',
        messages: [
          {
            role: 'system',
            content: 'You are a clinical scheduling assistant. Always respond with valid JSON only.'
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

      const aiSuggestion = JSON.parse(content);

      const suggestion: AppointmentSuggestion = {
        patientId: patient.id,
        patientName: patient.name,
        suggestedDate: aiSuggestion.suggestedDate,
        suggestedType: aiSuggestion.suggestedType,
        priority: aiSuggestion.priority,
        reasoning: aiSuggestion.reasoning,
        basedOn: aiSuggestion.basedOn,
      };

      return suggestion;
    } catch (error) {
      console.error('AI Appointment Suggestion Error:', error);
      throw new Error('Failed to generate appointment suggestion with AI');
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
