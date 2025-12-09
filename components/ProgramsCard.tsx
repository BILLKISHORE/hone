'use client';

import { useState } from 'react';
import { LifestyleProgram } from '@/types/patient';

interface ProgramsCardProps {
  programs: LifestyleProgram[];
  patientId?: string;
  patientName?: string;
}

export default function ProgramsCard({ programs, patientName }: ProgramsCardProps) {
  const [enrolledPrograms, setEnrolledPrograms] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<LifestyleProgram | null>(null);

  const handleEnrollClick = (program: LifestyleProgram) => {
    setSelectedProgram(program);
    setShowModal(true);
  };

  const handleConfirmEnroll = () => {
    if (selectedProgram) {
      setEnrolledPrograms(new Set([...enrolledPrograms, selectedProgram.id]));
      setShowModal(false);
      setSelectedProgram(null);
    }
  };

  const handleCancelEnroll = () => {
    setShowModal(false);
    setSelectedProgram(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Recommended Lifestyle Programs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((program) => {
            const isEnrolled = enrolledPrograms.has(program.id);
            return (
              <div key={program.id} className={`border rounded-lg p-4 transition-colors ${
                isEnrolled ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-blue-300'
              }`}>
                <h4 className="font-semibold text-gray-900 mb-2">{program.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{program.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Duration: {program.duration}</span>
                  {isEnrolled ? (
                    <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg font-medium">
                      Enrolled
                    </span>
                  ) : (
                    <button
                      onClick={() => handleEnrollClick(program)}
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Enrollment</h3>
            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                You are about to enroll {patientName ? <strong>{patientName}</strong> : 'this patient'} in:
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
                <h4 className="font-semibold text-blue-900 mb-2">{selectedProgram.name}</h4>
                <p className="text-sm text-blue-800 mb-2">{selectedProgram.description}</p>
                <p className="text-xs text-blue-700">Duration: {selectedProgram.duration}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancelEnroll}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEnroll}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Confirm Enrollment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
