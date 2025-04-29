// components/ChicksPieChart.jsx
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

export default function ChicksPieChart() {
  const data = {
    labels: ['Healthy', 'Sick', 'Dead', 'Sold'],
    datasets: [
      {
        label: 'Number of Chicks',
        data: [200, 30, 10, 60], // Mocked data, you can replace with real backend values
        backgroundColor: [
          '#22c55e', // green-500 (healthy)
          '#facc15', // yellow-400 (sick)
          '#ef4444', // red-500 (dead)
          '#3b82f6'  // blue-500 (sold)
        ],
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Chicks Status Distribution'
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Chicks Overview</h3>
      <Pie data={data} options={options} />
    </div>
  );
}
