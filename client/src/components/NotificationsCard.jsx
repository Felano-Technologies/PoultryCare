import React from 'react';

export default function NotificationsCard() {
  // Mocked notifications for now
  const notifications = [
    { id: 1, message: 'Newcastle Vaccine tomorrow for Flock A' },
    { id: 2, message: 'Flock B routine health check due in 2 days' },
    { id: 3, message: 'Weather Alert: Heavy Rain Expected' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-[453px] overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Notifications</h3>
      <ul className="space-y-4">
        {notifications.map((notif) => (
          <li key={notif.id} className="bg-green-100 text-green-700 p-3 rounded-lg text-sm shadow-sm">
            🔔 {notif.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
