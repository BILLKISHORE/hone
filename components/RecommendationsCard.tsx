'use client';

import { HealthRecommendation } from '@/types/patient';

interface RecommendationsCardProps {
  recommendations: HealthRecommendation[];
}

export default function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Health Recommendations</h3>
      <div className="space-y-3">
        {recommendations.map((recommendation, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-600">{recommendation.category}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
                {recommendation.priority} priority
              </span>
            </div>
            <p className="text-sm text-gray-700">{recommendation.recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
