// components/TempHumidityChart.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register the pie chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

export default function TempHumidityChart() {
  const data = {
    labels: ['Temperature (°C)', 'Humidity (%)'],
    datasets: [
      {
        label: 'Environmental Data',
        data: [28, 65], // Example values, replace with real-time data if needed
        backgroundColor: ['#f97316', '#3b82f6'], // Orange for Temp, Blue for Humidity
        hoverBackgroundColor: ['#fb923c', '#60a5fa'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Temperature & Humidity Overview',
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Environment Overview</h3>
      <Pie data={data} options={options} />
    </div>
  );
}
