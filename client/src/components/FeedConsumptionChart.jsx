import React, { useEffect, useState, useRef } from 'react';
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
import { fetchFlockFeedCounts } from '../services/api';
import { useChartExport } from '../hooks/useChartExport';
import { Download } from 'lucide-react';

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
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);
  const { exportChart, isExporting } = useChartExport();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchFlockFeedCounts();
        setChartData(data);
      } catch (error) {
        console.error("Failed to load feed data:", error);
        // Fallback to mock data if API fails
        setChartData({
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Feed (kg)',
            data: [50, 48, 52, 51, 49, 53, 54],
            fill: false,
            borderColor: '#22c55e',
            backgroundColor: '#22c55e',
            tension: 0.4,
            pointBackgroundColor: '#16a34a'
          }]
        });
      }
    };
    
    loadData();
  }, []);

  const handleExport = async () => {
    if (!chartRef.current) return;
    await new Promise(resolve => setTimeout(resolve, 300)); // Wait for chart render
    await exportChart(chartRef.current, 'feed-consumption-trend');
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

  if (!chartData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-full flex items-center justify-center">
        <p className="text-gray-500">Loading feed data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Feed Intake Trend</h3>
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
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}