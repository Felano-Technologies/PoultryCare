// components/DashboardCard.jsx
import React from 'react';

export default function DashboardCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M12 2v20M2 12h20" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        </svg>
      </div>
    </div>
  );
}
