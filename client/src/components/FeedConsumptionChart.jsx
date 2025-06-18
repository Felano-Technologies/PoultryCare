import React, { useEffect, useState } from 'react';
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
import { fetchFlockFeedCounts } from '../services/api'; // Add this to your api.js

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
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Feed Intake Trend</h3>
      <Line data={chartData} options={options} />
    </div>
  );
}