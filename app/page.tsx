'use client';

import { useState, useEffect } from 'react';
import PatientSelector from '@/components/PatientSelector';
import PatientDetailsCard from '@/components/PatientDetailsCard';
import HealthScoreCard from '@/components/HealthScoreCard';
import RiskCategoryCard from '@/components/RiskCategoryCard';
import FutureRisksCard from '@/components/FutureRisksCard';
import RecommendationsCard from '@/components/RecommendationsCard';
import ProgramsCard from '@/components/ProgramsCard';
import { PatientAnalysis, PatientData } from '@/types/patient';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
}

export default function Home() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatientData, setSelectedPatientData] = useState<PatientData | null>(null);
  const [analysis, setAnalysis] = useState<PatientAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch('/api/patients');
        if (!response.ok) throw new Error('Failed to fetch patients');
        const data = await response.json();
        setPatients(data);
      } catch {
        setError('Failed to load patients');
      }
    }
    fetchPatients();
  }, []);

  useEffect(() => {
    if (!selectedPatientId) {
      setAnalysis(null);
      setSelectedPatientData(null);
      return;
    }

    async function fetchPatientData() {
      setLoading(true);
      setError(null);
      try {
        const patientResponse = await fetch(`/api/patient/${selectedPatientId}`);
        if (!patientResponse.ok) throw new Error('Failed to fetch patient data');
        const patientData = await patientResponse.json();
        setSelectedPatientData(patientData);

        const analysisResponse = await fetch(`/api/analyze/${selectedPatientId}`);
        if (!analysisResponse.ok) throw new Error('Failed to fetch analysis');
        const analysisData = await analysisResponse.json();
        setAnalysis(analysisData);
      } catch {
        setError('Failed to load patient data');
        setAnalysis(null);
        setSelectedPatientData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPatientData();
  }, [selectedPatientId]);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Clinical Assistant</h1>
          <p className="text-gray-600">Intelligent patient health analysis and risk assessment system</p>
        </div>

        <PatientSelector
          patients={patients}
          selectedPatientId={selectedPatientId}
          onSelectPatient={setSelectedPatientId}
        />

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-6 flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {analysis && selectedPatientData && !loading && (
          <div className="mt-6 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">{analysis.patientName}</h2>
              <p className="text-sm text-gray-500">Patient ID: {analysis.patientId}</p>
              <p className="text-sm text-gray-500">Analysis Date: {new Date(analysis.analysisDate).toLocaleDateString()}</p>
            </div>

            <PatientDetailsCard patient={selectedPatientData} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HealthScoreCard healthScore={analysis.healthScore} />
              <RiskCategoryCard riskCategory={analysis.riskCategory} />
            </div>

            <FutureRisksCard futureRisks={analysis.futureRisks} />

            <RecommendationsCard recommendations={analysis.recommendations} />

            <ProgramsCard programs={analysis.recommendedPrograms} />
          </div>
        )}

        {!selectedPatientId && !loading && (
          <div className="mt-12 text-center text-gray-500">
            <p>Select a patient to view their health analysis</p>
          </div>
        )}
      </div>
    </main>
  );
}
