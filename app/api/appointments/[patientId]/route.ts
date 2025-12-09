import { NextRequest, NextResponse } from 'next/server';
import { appointments } from '@/data/appointments';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    const { patientId } = await params;

    const patientAppointments = appointments
      .filter(apt => apt.patientId === patientId)
      .sort((a, b) =>
        new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
      );

    return NextResponse.json(patientAppointments, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
