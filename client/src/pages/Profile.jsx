import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile, updateUserProfile } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, CalendarDays, Ruler, Phone, Egg, BadgeCheck, Edit, Save, X } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const loadUser = async () => {
      try {
        const userData = await fetchUserProfile(token);
        setUser(userData);
        setEditedUser(userData);
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };

    if (token) {
      loadUser();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedUser = await updateUserProfile(token, editedUser);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  if (!user) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading profile...</div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Profile Header with Edit Button */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="bg-green-600 h-32 relative">
              {isEditing ? (
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button 
                    onClick={handleSave}
                    className="p-2 bg-white text-green-600 rounded-full shadow hover:bg-green-50 transition"
                  >
                    <Save size={18} />
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="p-2 bg-white text-gray-600 rounded-full shadow hover:bg-gray-100 transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleEditToggle}
                  className="absolute top-4 right-4 p-2 bg-white text-green-600 rounded-full shadow hover:bg-green-50 transition"
                >
                  <Edit size={18} />
                </button>
              )}
            </div>
            
            <div className="px-6 pb-6 relative">
              <div className="flex justify-center -mt-16 mb-4">
                <div className="bg-white p-2 rounded-full shadow-lg">
                  <div className="bg-green-100 text-green-600 w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold">
                    {user.farmName.substring(0, 2).toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-6">
                {isEditing ? (
                  <input
                    type="text"
                    name="farmName"
                    value={editedUser.farmName || ''}
                    onChange={handleInputChange}
                    className="text-2xl font-bold text-center border-b border-green-300 focus:outline-none focus:border-green-500"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">{user.farmName}</h1>
                )}
                <p className="text-green-600 font-medium">{user.role}</p>
              </div>

              {/* Editable Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Flock Size</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="flockSize"
                      value={editedUser.flockSize || ''}
                      onChange={handleInputChange}
                      className="w-full text-lg font-semibold text-center bg-transparent border-b border-green-300 focus:outline-none"
                    />
                  ) : (
                    <p className="text-lg font-semibold">{user.flockSize || 'N/A'}</p>
                  )}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Farm Size</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="farmSize"
                      value={editedUser.farmSize || ''}
                      onChange={handleInputChange}
                      className="w-full text-lg font-semibold text-center bg-transparent border-b border-green-300 focus:outline-none"
                    />
                  ) : (
                    <p className="text-lg font-semibold">{user.farmSize || 'N/A'}</p>
                  )}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Experience</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="experience"
                      value={editedUser.experience || ''}
                      onChange={handleInputChange}
                      className="w-full text-lg font-semibold text-center bg-transparent border-b border-green-300 focus:outline-none"
                    />
                  ) : (
                    <p className="text-lg font-semibold">{user.experience || 'N/A'}</p>
                  )}
                </div>
              </div>

              {/* Editable Details Section */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="flex-shrink-0 h-5 w-5 text-green-600 mt-0.5 mr-3" />
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium text-gray-500">Farm Location</h3>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={editedUser.location || ''}
                        onChange={handleInputChange}
                        className="w-full border-b border-green-300 focus:outline-none"
                      />
                    ) : (
                      <p className="text-gray-900">{user.location || 'Not specified'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <CalendarDays className="flex-shrink-0 h-5 w-5 text-green-600 mt-0.5 mr-3" />
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                    <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Ruler className="flex-shrink-0 h-5 w-5 text-green-600 mt-0.5 mr-3" />
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium text-gray-500">Operation Scale</h3>
                    {isEditing ? (
                      <select
                        name="operationScale"
                        value={editedUser.operationScale || ''}
                        onChange={handleInputChange}
                        className="w-full border-b border-green-300 focus:outline-none"
                      >
                        <option value="">Select scale</option>
                        <option value="Small-scale">Small-scale</option>
                        <option value="Medium-scale">Medium-scale</option>
                        <option value="Large-scale">Large-scale</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{user.operationScale || 'Not specified'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="flex-shrink-0 h-5 w-5 text-green-600 mt-0.5 mr-3" />
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={editedUser.phoneNumber || ''}
                        onChange={handleInputChange}
                        className="w-full border-b border-green-300 focus:outline-none"
                      />
                    ) : (
                      <p className="text-gray-900">{user.phoneNumber || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Editable Sections */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Primary Poultry Type</h3>
                {isEditing && (
                  <button 
                    onClick={handleEditToggle}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Edit size={16} />
                  </button>
                )}
              </div>
              <div className="flex items-center">
                <div className="bg-green-100 text-green-600 p-3 rounded-lg mr-4">
                  <Egg className="h-6 w-6" />
                </div>
                <div className="flex-grow">
                  {isEditing ? (
                    <select
                      name="primaryPoultry"
                      value={editedUser.primaryPoultry || ''}
                      onChange={handleInputChange}
                      className="w-full border-b border-green-300 focus:outline-none"
                    >
                      <option value="">Select poultry type</option>
                      <option value="Broilers">Broilers</option>
                      <option value="Layers">Layers</option>
                      <option value="Breeders">Breeders</option>
                      <option value="Dual-purpose">Dual-purpose</option>
                    </select>
                  ) : (
                    <>
                      <p className="font-medium">{user.primaryPoultry || 'Not specified'}</p>
                      <p className="text-sm text-gray-500">Main production focus</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Certifications</h3>
                {isEditing && (
                  <button 
                    onClick={handleEditToggle}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Edit size={16} />
                  </button>
                )}
              </div>
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    name="certifications"
                    value={editedUser.certifications?.join(', ') || ''}
                    onChange={(e) => {
                      const certs = e.target.value.split(',').map(c => c.trim());
                      setEditedUser(prev => ({ ...prev, certifications: certs }));
                    }}
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                    placeholder="Enter certifications separated by commas"
                  />
                </div>
              ) : (
                user.certifications?.length > 0 ? (
                  <ul className="space-y-2">
                    {user.certifications.map((cert, index) => (
                      <li key={index} className="flex items-center">
                        <span className="bg-green-100 text-green-600 text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                          <BadgeCheck size={14} className="inline" />
                        </span>
                        {cert}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No certifications listed</p>
                )
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}