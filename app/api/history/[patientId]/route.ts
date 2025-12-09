import { NextRequest, NextResponse } from 'next/server';
import { patientHistories } from '@/data/patientHistory';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    const { patientId } = await params;

    const history = patientHistories.find(h => h.patientId === patientId);

    if (!history) {
      return NextResponse.json(
        { error: 'Patient history not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(history, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
