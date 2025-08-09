import React, { useEffect, useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { fetchFlockStatusCounts } from '../services/api';
import { useChartExport } from '../hooks/useChartExport';
import { Download } from 'lucide-react';

// Register the pie chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChicksPieChart() {
  const [statusCounts, setStatusCounts] = useState(null);
  const chartRef = useRef(null);
  const { exportChart, isExporting } = useChartExport();

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

  const handleExport = async () => {
    if (!chartRef.current) return;
    await new Promise(resolve => setTimeout(resolve, 300)); // Wait for chart render
    await exportChart(chartRef.current, 'chicks-status-distribution');
  };

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
          statusCounts.healthy,
          statusCounts.sick,
          statusCounts.dead,
          statusCounts.sold
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
    <div className="bg-white p-6 rounded-lg shadow-md h-full relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Chicks Overview</h3>
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
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}