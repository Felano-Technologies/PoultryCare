import React, { useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useChartExport } from '../hooks/useChartExport';
import { Download } from 'lucide-react';

// Register the pie chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

export default function TempHumidityChart({ weatherData }) {
  const chartRef = useRef(null);
  const { exportChart, isExporting } = useChartExport();

  const temp = weatherData?.temperature;
  const humidity = weatherData?.humidity;

  const handleExport = async () => {
    if (!chartRef.current) return;
    await new Promise(resolve => setTimeout(resolve, 300)); // Wait for chart render
    await exportChart(chartRef.current, 'environment-overview');
  };

  const data = {
    labels: ['Temperature (°C)', 'Humidity (%)'],
    datasets: [
      {
        label: 'Environmental Data',
        data: [temp || 0, humidity || 0], // Fallback to 0 if undefined
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
    <div className="bg-white p-6 rounded-lg shadow-md h-full relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Environment Overview</h3>
        <button
          onClick={handleExport}
          disabled={isExporting || !weatherData}
          className="p-2 text-green-600 hover:text-green-800 transition-colors"
          title="Export chart"
        >
          <Download className={`h-5 w-5 ${isExporting ? 'opacity-50' : ''}`} />
        </button>
      </div>
      <div ref={chartRef}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}