import { NextRequest, NextResponse } from 'next/server';
import { patients } from '@/data/patients';
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

    return NextResponse.json(analysis, { status: 200 });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze patient data' },
      { status: 500 }
    );
  }
}
