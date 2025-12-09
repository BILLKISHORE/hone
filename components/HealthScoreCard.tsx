'use client';

import { HealthScore } from '@/types/patient';

interface HealthScoreCardProps {
  healthScore: HealthScore;
}

export default function HealthScoreCard({ healthScore }: HealthScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 75) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const ScoreItem = ({ label, score }: { label: string; score: number }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className={`px-3 py-1 rounded-full ${getScoreBackground(score)}`}>
        <span className={`font-semibold ${getScoreColor(score)}`}>
          {score}/100
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Health Score</h3>
      <div className="space-y-3">
        <div className={`p-4 rounded-lg ${getScoreBackground(healthScore.overall)}`}>
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-gray-700">Overall Health</span>
            <span className={`text-2xl font-bold ${getScoreColor(healthScore.overall)}`}>
              {healthScore.overall}/100
            </span>
          </div>
        </div>
        <ScoreItem label="Cardiovascular Health" score={healthScore.cardiovascular} />
        <ScoreItem label="Metabolic Health" score={healthScore.metabolic} />
        <ScoreItem label="Lifestyle Score" score={healthScore.lifestyle} />
      </div>
    </div>
  );
}
