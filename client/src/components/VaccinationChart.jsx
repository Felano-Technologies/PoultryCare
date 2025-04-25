// components/VaccinationChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function VaccinationChart() {
  // Mocked data – replace with real backend data later
  const data = {
    labels: ['Flock A', 'Flock B', 'Flock C', 'Flock D'],
    datasets: [
      {
        label: 'Vaccinated Birds (%)',
        data: [90, 70, 60, 80],
        backgroundColor: '#22c55e', // Tailwind green-500
        borderRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Vaccination Coverage per Flock'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Vaccination Summary</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
