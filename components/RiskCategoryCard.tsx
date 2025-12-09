'use client';

import { RiskCategory } from '@/types/patient';

interface RiskCategoryCardProps {
  riskCategory: RiskCategory;
}

export default function RiskCategoryCard({ riskCategory }: RiskCategoryCardProps) {
  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'normal':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          label: 'Normal',
        };
      case 'potential-risk':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          label: 'Potential Risk',
        };
      case 'high-risk':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          label: 'High Risk',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          label: 'Unknown',
        };
    }
  };

  const badge = getRiskBadge(riskCategory.level);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Risk Category</h3>
      <div className={`px-4 py-3 rounded-lg border-2 ${badge.color} inline-block mb-3`}>
        <span className="font-semibold text-lg">{badge.label}</span>
      </div>
      <p className="text-gray-700">{riskCategory.description}</p>
    </div>
  );
}
