import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../services/api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const loadUser = async () => {
      try {
        const userData = await fetchUserProfile(token);
        setUser(userData);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return null; // Show nothing until data loads

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2); // Only 2 letters
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">

        {/* Farm Profile Circle */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-green-500 text-white w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold mb-4">
            {getInitials(user.farmName)}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{user.farmName}</h1>
          <p className="text-gray-600">{user.role}</p>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 gap-4 text-gray-700">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Location:</span>
            <span>{user.location}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Years of Experience:</span>
            <span>{user.experience}</span>
          </div>
          {user.farmSize && (
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Farm Size:</span>
              <span>{user.farmSize}</span>
            </div>
          )}
          <div className="flex justify-between pt-4">
            <span className="font-semibold">Phone Number:</span>
            <span>{user.phoneNumber}</span>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-8 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}
