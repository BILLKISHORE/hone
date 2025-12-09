'use client';

import { TrendAnalysis } from '@/types/patient';

interface TrendSummaryCardProps {
  trendAnalysis: TrendAnalysis;
}

export default function TrendSummaryCard({ trendAnalysis }: TrendSummaryCardProps) {
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'declining':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return '↗';
      case 'declining':
        return '↘';
      default:
        return '→';
    }
  };

  const getAlertColor = (type: string) => {
    return type === 'critical'
      ? 'bg-red-50 border-red-300 text-red-800'
      : 'bg-yellow-50 border-yellow-300 text-yellow-800';
  };

  const getAlertLabel = (type: string) => {
    return type === 'critical' ? 'CRITICAL' : 'WARNING';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">AI Trend Analysis</h3>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-medium text-gray-600">Overall Trend:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold border ${getTrendColor(
              trendAnalysis.overallTrend
            )}`}
          >
            {getTrendIcon(trendAnalysis.overallTrend)}{' '}
            {trendAnalysis.overallTrend.charAt(0).toUpperCase() +
              trendAnalysis.overallTrend.slice(1)}
          </span>
        </div>
        <p className="text-gray-700 text-sm">{trendAnalysis.trendSummary}</p>
      </div>

      {trendAnalysis.alerts.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Alerts</h4>
          <div className="space-y-2">
            {trendAnalysis.alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}
              >
                <span className="text-sm font-bold mr-2">
                  {getAlertLabel(alert.type)}:
                </span>
                <span className="text-sm">{alert.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Vital Sign Trends</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {trendAnalysis.vitalTrends.map((vital, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">{vital.vital}</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${getTrendColor(
                    vital.trend
                  )}`}
                >
                  {getTrendIcon(vital.trend)} {vital.percentChange > 0 ? '+' : ''}
                  {vital.percentChange.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-gray-600">{vital.analysis}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Analysis Date: {new Date(trendAnalysis.analysisDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
