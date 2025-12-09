import { NextResponse } from 'next/server';
import { patients } from '@/data/patients';

export async function GET() {
  try {
    const patientList = patients.map(patient => ({
      id: patient.id,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
    }));

    return NextResponse.json(patientList, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
