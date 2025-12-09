'use client';

import { FutureRisk } from '@/types/patient';

interface FutureRisksCardProps {
  futureRisks: FutureRisk[];
}

export default function FutureRisksCard({ futureRisks }: FutureRisksCardProps) {
  const getProbabilityColor = (probability: string) => {
    switch (probability) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Future Health Risks</h3>
      <div className="space-y-4">
        {futureRisks.map((risk, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{risk.condition}</h4>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getProbabilityColor(risk.probability)}`}>
                {risk.probability} probability
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
            <p className="text-xs text-gray-500">Timeframe: {risk.timeframe}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
