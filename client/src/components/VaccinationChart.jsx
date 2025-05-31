import React, { useEffect, useState } from 'react';
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
import { fetchVaccinationChartData } from '../services/api';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function VaccinationChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const data = await fetchVaccinationChartData();
        setChartData(data);
      } catch (error) {
        console.error('Failed to load vaccination chart data');
      }
    };
    loadChartData();
  }, []);

  if (!chartData) {
    return <div className="text-sm text-gray-500">Loading chart...</div>;
  }

  const data = {
    labels: chartData.map(item => item.flockName),
    datasets: [
      {
        label: 'Vaccinated Birds (%)',
        data: chartData.map(item => item.percentage),
        backgroundColor: '#22c55e',
        borderRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
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
