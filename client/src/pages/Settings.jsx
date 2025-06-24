import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile, updateUserProfile } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Settings, Mail, Lock, Bell, Save, X, Edit } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSettings, setEditedSettings] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUserProfile();
        setUser(userData);
        setEditedSettings({
          email: userData.email,
          notificationPreferences: userData.notificationPreferences || true
        });
      } catch (error) {
        navigate('/login');
      }
    };
    loadUser();
  }, [navigate]);

  const handleSave = async () => {
    try {
      const updatedUser = await updateUserProfile(editedSettings);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!user) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading settings...</div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Settings className="h-6 w-6 mr-2 text-green-600" />
                Account Settings
              </h1>
            </div>

            <div className="divide-y divide-gray-200">
              {/* Email Settings */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-green-600" />
                    Email Address
                  </h2>
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <button 
                        onClick={handleSave}
                        className="p-1.5 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition"
                      >
                        <Save size={18} />
                      </button>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="p-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition"
                    >
                      <Edit size={18} />
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedSettings.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                ) : (
                  <p className="text-gray-700">{user.email}</p>
                )}
              </div>

              {/* Notification Settings */}
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                  <Bell className="h-5 w-5 mr-2 text-green-600" />
                  Notification Preferences
                </h2>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="notificationPreferences"
                    checked={editedSettings.notificationPreferences}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">
                    Receive email notifications
                  </span>
                </label>
              </div>

              {/* Password Settings */}
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                  <Lock className="h-5 w-5 mr-2 text-green-600" />
                  Password
                </h2>
                <button
                  onClick={() => navigate('/forgot-password')}
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}