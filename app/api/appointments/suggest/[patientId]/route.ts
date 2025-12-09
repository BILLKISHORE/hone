import { NextRequest, NextResponse } from 'next/server';
import { patients } from '@/data/patients';
import { patientHistories } from '@/data/patientHistory';
import { AIHealthAnalyzer } from '@/lib/aiHealthAnalyzer';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    const { patientId } = await params;

    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    const analyzer = new AIHealthAnalyzer();

    const analysis = await analyzer.analyzePatient(patient);

    const history = patientHistories.find(h => h.patientId === patientId);
    let trendAnalysis;
    if (history) {
      trendAnalysis = await analyzer.analyzeTrends(history, patient);
    }

    const suggestion = await analyzer.suggestAppointment(patient, analysis, trendAnalysis);

    return NextResponse.json(suggestion, { status: 200 });
  } catch (error) {
    console.error('Appointment suggestion error:', error);
    return NextResponse.json(
      { error: 'Failed to generate appointment suggestion' },
      { status: 500 }
    );
  }
}
