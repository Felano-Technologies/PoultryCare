import React, { useEffect, useState } from 'react';
import { fetchFarmStats } from '../services/api';

export default function FarmStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchFarmStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
        // Fallback to mock data if API fails
        setStats({
          mortalityRate: "3.3%",
          vaccinationCoverage: "85%",
          avgDailyFeed: "120 kg/day",
          eggProductionRate: "78%",
          flocksCount: 4,
          totalBirds: 1200
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, []);

  if (loading) return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex items-center justify-center">
      <p className="text-gray-500">Loading farm statistics...</p>
    </div>
  );

  if (error) return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex items-center justify-center">
      <p className="text-red-500">Error: {error}</p>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Farm Statistics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard 
          title="Mortality Rate" 
          value={stats.mortalityRate} 
          trend="down" 
          description="Lower is better"
        />
        <StatCard 
          title="Vaccination Coverage" 
          value={stats.vaccinationCoverage} 
          trend="up" 
          description="Higher is better"
        />
        <StatCard 
          title="Avg Daily Feed" 
          value={stats.avgDailyFeed} 
          description="Per flock average"
        />
        <StatCard 
          title="Egg Production" 
          value={stats.eggProductionRate} 
          trend="up"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, description }) {
  const trendColor = trend === 'up' ? 'text-green-500' : 'text-red-500';
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '';
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="text-sm font-medium text-gray-500">{title}</h4>
      <div className="flex items-baseline mt-1">
        <p className="text-xl font-bold">{value}</p>
        {trend && <span className={`ml-2 ${trendColor}`}>{trendIcon}</span>}
      </div>
      {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
    </div>
  );
}