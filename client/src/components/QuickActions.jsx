// components/QuickActions.jsx
import React from 'react';

export default function QuickActions() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
      <div className="space-y-4">
        <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
          Add New Bird/Flock
        </button>
        <button className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition">
          Log Vaccination/Treatment
        </button>
        <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
          Book Vet Consultation
        </button>
      </div>
    </div>
  );
}
