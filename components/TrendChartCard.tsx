'use client';

import { PatientHistory } from '@/types/patient';

interface TrendChartCardProps {
  history: PatientHistory;
}

export default function TrendChartCard({ history }: TrendChartCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  const getChangeIndicator = (values: { value: number }[], isInverseGood: boolean = false) => {
    if (values.length < 2) return { change: 0, direction: 'stable' };
    const first = values[0].value;
    const last = values[values.length - 1].value;
    const change = ((last - first) / first) * 100;

    let direction: 'up' | 'down' | 'stable';
    if (Math.abs(change) < 2) direction = 'stable';
    else if (change > 0) direction = 'up';
    else direction = 'down';

    const isGood = isInverseGood
      ? (direction === 'up')
      : (direction === 'down');

    return { change, direction, isGood };
  };

  const VitalRow = ({
    label,
    readings,
    unit,
    isInverseGood = false,
  }: {
    label: string;
    readings: { date: string; value: number }[];
    unit: string;
    isInverseGood?: boolean;
  }) => {
    const { change, direction, isGood } = getChangeIndicator(readings, isInverseGood);
    const latest = readings[readings.length - 1]?.value;

    return (
      <div className="border-b border-gray-100 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {latest} {unit}
            </span>
            {direction !== 'stable' && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isGood
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {direction === 'up' ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
              </span>
            )}
            {direction === 'stable' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                → stable
              </span>
            )}
          </div>
        </div>
        <div className="flex items-end gap-1 h-8">
          {readings.map((reading, idx) => {
            const min = Math.min(...readings.map(r => r.value));
            const max = Math.max(...readings.map(r => r.value));
            const range = max - min || 1;
            const height = ((reading.value - min) / range) * 100;
            const normalizedHeight = Math.max(20, Math.min(100, height));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-blue-400 rounded-t transition-all"
                  style={{ height: `${normalizedHeight}%` }}
                  title={`${formatDate(reading.date)}: ${reading.value} ${unit}`}
                />
                <span className="text-[10px] text-gray-400">
                  {formatDate(reading.date)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Health Trends (6 Months)</h3>
      <div className="space-y-2">
        <VitalRow
          label="Blood Pressure (Systolic)"
          readings={history.bloodPressureSystolic}
          unit="mmHg"
        />
        <VitalRow
          label="Blood Pressure (Diastolic)"
          readings={history.bloodPressureDiastolic}
          unit="mmHg"
        />
        <VitalRow
          label="Glucose"
          readings={history.glucose}
          unit="mg/dL"
        />
        <VitalRow
          label="Weight"
          readings={history.weight}
          unit="kg"
        />
        <VitalRow
          label="HDL Cholesterol"
          readings={history.hdl}
          unit="mg/dL"
          isInverseGood={true}
        />
        <VitalRow
          label="LDL Cholesterol"
          readings={history.ldl}
          unit="mg/dL"
        />
        <VitalRow
          label="Total Cholesterol"
          readings={history.totalCholesterol}
          unit="mg/dL"
        />
        <VitalRow
          label="Triglycerides"
          readings={history.triglycerides}
          unit="mg/dL"
        />
      </div>
    </div>
  );
}
