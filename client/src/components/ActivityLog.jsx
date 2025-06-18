import React, { useEffect, useState } from 'react';
import { getRecentActivities } from '../services/api';

export default function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getRecentActivities();
        setActivities(data);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-[495px] flex items-center justify-center">
        <p className="text-gray-500">Loading activities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-[495px] flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-[495px] overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No recent activities</p>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="flex justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {activity.type} for {activity.flock}
                  {activity.details && `: ${activity.details}`}
                </p>
                <span className="text-xs text-gray-400">
                  {activity.date} {activity.time && `• ${activity.time}`}
                </span>
              </div>
              <div className={`flex items-center justify-center p-2 rounded-full text-xs ${
                activity.type === 'Vaccination' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'Treatment' ? 'bg-yellow-100 text-yellow-600' :
                'bg-green-100 text-green-600'
              }`}>
                {activity.type}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}