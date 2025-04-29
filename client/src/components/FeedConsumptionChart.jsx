import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function FeedConsumptionChart() {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Feed (kg)',
        data: [50, 48, 52, 51, 49, 53, 54], // Mock data
        fill: false,
        borderColor: '#22c55e', // green-500
        backgroundColor: '#22c55e',
        tension: 0.4,
        pointBackgroundColor: '#16a34a' // green-600
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
        text: 'Daily Feed Consumption'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Feed (kg)'
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Feed Intake Trend</h3>
      <Line data={data} options={options} />
    </div>
  );
}
