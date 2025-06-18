import React, { useEffect, useState } from 'react';
import { getNotifications, markNotificationAsRead } from '../services/api';

export default function NotificationsCard() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        // Fallback to mock data
        setNotifications([
          { id: 1, message: 'Newcastle Vaccine tomorrow for Flock A' },
          { id: 2, message: 'Flock B routine health check due in 2 days' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      ));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-[453px] flex items-center justify-center">
        <p className="text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-[453px] overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Notifications</h3>
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No new notifications</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li 
              key={notif.id} 
              className={`p-3 rounded-lg text-sm shadow-sm cursor-pointer transition-colors ${
                notif.isRead 
                  ? 'bg-gray-50 text-gray-600' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
              onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
            >
              <div className="flex items-start">
                <span className="mr-2">🔔</span>
                <div>
                  <p>{notif.message}</p>
                  {notif.date && (
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(notif.date).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}