'use client';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
}

interface PatientSelectorProps {
  patients: Patient[];
  selectedPatientId: string | null;
  onSelectPatient: (patientId: string) => void;
}

export default function PatientSelector({
  patients,
  selectedPatientId,
  onSelectPatient,
}: PatientSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Patient</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((patient) => (
          <button
            key={patient.id}
            onClick={() => onSelectPatient(patient.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedPatientId === patient.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 bg-white'
            }`}
          >
            <div className="font-semibold text-gray-900">{patient.name}</div>
            <div className="text-sm text-gray-600 mt-1">
              ID: {patient.id}
            </div>
            <div className="text-sm text-gray-600">
              {patient.age} years, {patient.gender}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
