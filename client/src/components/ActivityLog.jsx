// components/ActivityLog.jsx
import React from 'react';

export default function ActivityLog() {
  const activities = [
    { id: 1, type: 'Vaccination', date: '2025-04-23', flock: 'Flock 1' },
    { id: 2, type: 'Treatment', date: '2025-04-22', flock: 'Flock 2' },
    { id: 3, type: 'Vaccination', date: '2025-04-21', flock: 'Flock 3' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-[495px] overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
      <ul className="space-y-4">
        {activities.map((activity) => (
          <li key={activity.id} className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">{activity.type} for {activity.flock}</p>
              <span className="text-xs text-gray-400">{activity.date}</span>
            </div>
            <div className="flex items-center justify-center bg-green-100 text-green-600 p-2 rounded-full text-xs">
              {activity.type}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
