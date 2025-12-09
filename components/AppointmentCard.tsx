'use client';

import { Appointment } from '@/types/patient';

interface AppointmentCardProps {
  appointments: Appointment[];
}

export default function AppointmentCard({ appointments }: AppointmentCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gray-100 text-gray-600';
      case 'cancelled':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isUpcoming = (dateStr: string) => {
    return new Date(dateStr) >= new Date();
  };

  const upcomingAppointments = appointments.filter(
    apt => apt.status === 'scheduled' && isUpcoming(apt.scheduledDate)
  );
  const pastAppointments = appointments.filter(
    apt => apt.status === 'completed' || !isUpcoming(apt.scheduledDate)
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Appointments</h3>

      {upcomingAppointments.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Upcoming</h4>
          <div className="space-y-3">
            {upcomingAppointments.map(apt => (
              <div
                key={apt.id}
                className="border border-blue-200 bg-blue-50 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {apt.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(apt.priority)}`}>
                      {apt.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{apt.reason}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">
                    {formatDate(apt.scheduledDate)}
                  </span>
                  {apt.aiGenerated && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      AI Suggested
                    </span>
                  )}
                </div>
                {apt.notes && (
                  <p className="text-xs text-gray-600 mt-2 pt-2 border-t border-blue-200">
                    Note: {apt.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {pastAppointments.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Past Appointments</h4>
          <div className="space-y-2">
            {pastAppointments.slice(0, 3).map(apt => (
              <div
                key={apt.id}
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {apt.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(apt.status)}`}>
                    {apt.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{apt.reason}</p>
                <span className="text-xs text-gray-500">{formatDate(apt.scheduledDate)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {appointments.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-4">
          No appointments scheduled for this patient.
        </p>
      )}
    </div>
  );
}
