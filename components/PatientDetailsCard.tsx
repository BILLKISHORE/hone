'use client';

import { PatientData } from '@/types/patient';

interface PatientDetailsCardProps {
  patient: PatientData;
}

export default function PatientDetailsCard({ patient }: PatientDetailsCardProps) {
  const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const bmi = calculateBMI(patient.weight, patient.height);

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const DataRow = ({ label, value, unit }: { label: string; value: string | number; unit?: string }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm text-gray-900 font-semibold">
        {value} {unit && <span className="text-gray-500 font-normal">{unit}</span>}
      </span>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Complete Patient Data</h3>

      <div className="space-y-1">
        <div className="mb-4 pb-4 border-b-2 border-gray-200">
          <h4 className="text-md font-semibold text-gray-700 mb-3">Personal Information</h4>
          <DataRow label="Patient ID" value={patient.id} />
          <DataRow label="Name" value={patient.name} />
          <DataRow label="Age" value={patient.age} unit="years" />
          <DataRow label="Gender" value={patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)} />
        </div>

        <div className="mb-4 pb-4 border-b-2 border-gray-200">
          <h4 className="text-md font-semibold text-gray-700 mb-3">Physical Measurements</h4>
          <DataRow label="Height" value={patient.height} unit="cm" />
          <DataRow label="Weight" value={patient.weight} unit="kg" />
          <DataRow label="BMI" value={bmi.toFixed(1)} unit={`(${getBMICategory(bmi)})`} />
        </div>

        <div className="mb-4 pb-4 border-b-2 border-gray-200">
          <h4 className="text-md font-semibold text-gray-700 mb-3">Blood Pressure</h4>
          <DataRow
            label="Systolic / Diastolic"
            value={`${patient.bloodPressure.systolic} / ${patient.bloodPressure.diastolic}`}
            unit="mmHg"
          />
        </div>

        <div className="mb-4 pb-4 border-b-2 border-gray-200">
          <h4 className="text-md font-semibold text-gray-700 mb-3">Blood Sugar</h4>
          <DataRow label="Glucose Level" value={patient.glucose} unit="mg/dL" />
        </div>

        <div className="mb-4 pb-4 border-b-2 border-gray-200">
          <h4 className="text-md font-semibold text-gray-700 mb-3">Cholesterol Profile</h4>
          <DataRow label="HDL (Good Cholesterol)" value={patient.vitals.hdl} unit="mg/dL" />
          <DataRow label="LDL (Bad Cholesterol)" value={patient.vitals.ldl} unit="mg/dL" />
          <DataRow label="Total Cholesterol" value={patient.vitals.totalCholesterol} unit="mg/dL" />
          <DataRow label="Triglycerides" value={patient.vitals.triglycerides} unit="mg/dL" />
        </div>

        <div className="mb-4 pb-4 border-b-2 border-gray-200">
          <h4 className="text-md font-semibold text-gray-700 mb-3">Lifestyle Factors</h4>
          <DataRow
            label="Smoking Status"
            value={patient.smokingStatus ? 'Yes (Smoker)' : 'No (Non-smoker)'}
          />
          <DataRow
            label="Alcohol Consumption"
            value={patient.alcoholConsumption.charAt(0).toUpperCase() + patient.alcoholConsumption.slice(1)}
          />
          <DataRow
            label="Physical Activity"
            value={patient.physicalActivity.charAt(0).toUpperCase() + patient.physicalActivity.slice(1)}
          />
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600">
            All measurements are current as of the latest patient examination.
          </p>
        </div>
      </div>
    </div>
  );
}
