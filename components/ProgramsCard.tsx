'use client';

import { LifestyleProgram } from '@/types/patient';

interface ProgramsCardProps {
  programs: LifestyleProgram[];
}

export default function ProgramsCard({ programs }: ProgramsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Recommended Lifestyle Programs</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.map((program) => (
          <div key={program.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <h4 className="font-semibold text-gray-900 mb-2">{program.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{program.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Duration: {program.duration}</span>
              <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors">
                Enroll
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
