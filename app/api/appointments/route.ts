import { NextResponse } from 'next/server';
import { appointments } from '@/data/appointments';

export async function GET() {
  try {
    const sortedAppointments = [...appointments].sort((a, b) =>
      new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
    );

    return NextResponse.json(sortedAppointments, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
