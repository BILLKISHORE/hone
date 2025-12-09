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

    const history = patientHistories.find(h => h.patientId === patientId);
    if (!history) {
      return NextResponse.json(
        { error: 'Patient history not found' },
        { status: 404 }
      );
    }

    const analyzer = new AIHealthAnalyzer();
    const trendAnalysis = await analyzer.analyzeTrends(history, patient);

    return NextResponse.json(trendAnalysis, { status: 200 });
  } catch (error) {
    console.error('Trend analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze patient trends' },
      { status: 500 }
    );
  }
}
