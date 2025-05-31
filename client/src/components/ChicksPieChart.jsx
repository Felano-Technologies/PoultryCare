// components/ChicksPieChart.jsx
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { fetchFlockStatusCounts } from '../services/api';

// Register the pie chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChicksPieChart() {
  const [statusCounts, setStatusCounts] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const counts = await fetchFlockStatusCounts();
        setStatusCounts(counts);
      } catch (error) {
        console.error("Failed to load chart data");
      }
    };
    loadData();
  }, []);

  if (!statusCounts) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-full flex items-center justify-center text-gray-500">
        Loading chart...
      </div>
    );
  }

  const data = {
    labels: ['Healthy', 'Sick', 'Dead', 'Sold'],
    datasets: [
      {
        label: 'Number of Chicks',
        data: [
          statusCounts.active || 0,
          statusCounts.sold || 0,
          statusCounts.completed || 0,
          statusCounts.dead || 0
        ], 
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
