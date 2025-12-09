'use client';

import { useState, useEffect } from 'react';
import PatientSelector from '@/components/PatientSelector';
import PatientDetailsCard from '@/components/PatientDetailsCard';
import HealthScoreCard from '@/components/HealthScoreCard';
import RiskCategoryCard from '@/components/RiskCategoryCard';
import FutureRisksCard from '@/components/FutureRisksCard';
import RecommendationsCard from '@/components/RecommendationsCard';
import ProgramsCard from '@/components/ProgramsCard';
import TrendChartCard from '@/components/TrendChartCard';
import TrendSummaryCard from '@/components/TrendSummaryCard';
import AppointmentCard from '@/components/AppointmentCard';
import AppointmentSuggestionCard from '@/components/AppointmentSuggestionCard';
import {
  PatientAnalysis,
  PatientData,
  PatientHistory,
  TrendAnalysis,
  Appointment,
  AppointmentSuggestion,
} from '@/types/patient';

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
  const [patientHistory, setPatientHistory] = useState<PatientHistory | null>(null);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentSuggestion, setAppointmentSuggestion] = useState<AppointmentSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingTrends, setLoadingTrends] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
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
      setPatientHistory(null);
      setTrendAnalysis(null);
      setAppointments([]);
      setAppointmentSuggestion(null);
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

    async function fetchTrendData() {
      setLoadingTrends(true);
      try {
        const historyResponse = await fetch(`/api/history/${selectedPatientId}`);
        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setPatientHistory(historyData);

          const trendsResponse = await fetch(`/api/trends/${selectedPatientId}`);
          if (trendsResponse.ok) {
            const trendsData = await trendsResponse.json();
            setTrendAnalysis(trendsData);
          }
        }
      } catch {
        console.error('Failed to load trend data');
      } finally {
        setLoadingTrends(false);
      }
    }

    async function fetchAppointmentData() {
      setLoadingAppointments(true);
      try {
        const appointmentsResponse = await fetch(`/api/appointments/${selectedPatientId}`);
        if (appointmentsResponse.ok) {
          const appointmentsData = await appointmentsResponse.json();
          setAppointments(appointmentsData);
        }

        const suggestionResponse = await fetch(`/api/appointments/suggest/${selectedPatientId}`);
        if (suggestionResponse.ok) {
          const suggestionData = await suggestionResponse.json();
          setAppointmentSuggestion(suggestionData);
        }
      } catch {
        console.error('Failed to load appointment data');
      } finally {
        setLoadingAppointments(false);
      }
    }

    fetchPatientData();
    fetchTrendData();
    fetchAppointmentData();
  }, [selectedPatientId]);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Clinical Assistant</h1>
          <p className="text-gray-600">Intelligent patient health analysis, trend tracking, and appointment scheduling</p>
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
          <div className="mt-6 flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Analyzing patient data...</p>
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

            {loadingTrends ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-600">Loading health trends...</span>
                </div>
              </div>
            ) : (
              patientHistory && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TrendChartCard history={patientHistory} />
                  {trendAnalysis && <TrendSummaryCard trendAnalysis={trendAnalysis} />}
                </div>
              )
            )}

            <FutureRisksCard futureRisks={analysis.futureRisks} />

            <RecommendationsCard recommendations={analysis.recommendations} />

            {loadingAppointments ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-600">Loading appointments...</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AppointmentCard appointments={appointments} />
                {appointmentSuggestion && (
                  <AppointmentSuggestionCard suggestion={appointmentSuggestion} />
                )}
              </div>
            )}

            <ProgramsCard
              programs={analysis.recommendedPrograms}
              patientId={analysis.patientId}
              patientName={analysis.patientName}
            />
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
