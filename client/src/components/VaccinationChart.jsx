import React, { useEffect, useState, useRef } from 'react';
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
import { useChartExport } from '../hooks/useChartExport';
import { Download } from 'lucide-react';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function VaccinationChart() {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);
  const { exportChart, isExporting } = useChartExport();

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

  const handleExport = async () => {
    if (!chartRef.current) return;
    
    // Wait for Chart.js to fully render
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Export with custom filename
    await exportChart(chartRef.current, 'vaccination-coverage');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Vaccination Summary</h3>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="p-2 text-green-600 hover:text-green-800 transition-colors"
          title="Export chart"
        >
          <Download className={`h-5 w-5 ${isExporting ? 'opacity-50' : ''}`} />
        </button>
      </div>
      <div ref={chartRef}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}