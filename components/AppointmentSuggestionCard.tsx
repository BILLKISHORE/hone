'use client';

import { useState } from 'react';
import { AppointmentSuggestion } from '@/types/patient';

interface AppointmentSuggestionCardProps {
  suggestion: AppointmentSuggestion;
  onSchedule?: (suggestion: AppointmentSuggestion) => void;
}

export default function AppointmentSuggestionCard({
  suggestion,
  onSchedule,
}: AppointmentSuggestionCardProps) {
  const [isScheduled, setIsScheduled] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getTypeLabel = (type: string) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleScheduleClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSchedule = () => {
    setIsScheduled(true);
    setShowConfirmModal(false);
    if (onSchedule) {
      onSchedule(suggestion);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              AI Appointment Suggestion
            </h3>
            <p className="text-sm text-gray-500">
              Based on health analysis and trends
            </p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">
              Recommended Appointment
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold border ${getPriorityColor(
                suggestion.priority
              )}`}
            >
              {suggestion.priority.toUpperCase()} Priority
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">Date:</span>
              <span className="font-semibold text-gray-900">
                {formatDate(suggestion.suggestedDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">Type:</span>
              <span className="text-gray-700">
                {getTypeLabel(suggestion.suggestedType)}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            AI Reasoning
          </h4>
          <p className="text-sm text-gray-600">{suggestion.reasoning}</p>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Based On
          </h4>
          <div className="flex flex-wrap gap-2">
            {suggestion.basedOn.map((factor, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>

        {isScheduled ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
            <span className="text-green-700 font-medium">
              Appointment Scheduled Successfully
            </span>
          </div>
        ) : (
          <button
            onClick={handleScheduleClick}
            className="w-full py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Schedule This Appointment
          </button>
        )}
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirm Appointment
            </h3>
            <div className="mb-6">
              <p className="text-gray-700 mb-3">
                Schedule the following appointment for{' '}
                <strong>{suggestion.patientName}</strong>?
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">
                      {formatDate(suggestion.suggestedDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold">
                      {getTypeLabel(suggestion.suggestedType)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-sm font-medium ${getPriorityColor(
                        suggestion.priority
                      )}`}
                    >
                      {suggestion.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSchedule}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
