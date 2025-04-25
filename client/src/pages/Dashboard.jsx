// Dashboard.jsx
import React from 'react';
import DashboardCard from '../components/DashboardCard'
import VaccinationChart from '../components/VaccinationChart'
import QuickActions from '../components/QuickActions'
import ActivityLog from '../components/ActivityLog'

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Farm Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <DashboardCard title="Total Birds" value="300" />
        <DashboardCard title="Upcoming Vaccines" value="4" />
        <DashboardCard title="Active Flocks" value="5" />
      </div>

      {/* Charts and Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <VaccinationChart />
        <ActivityLog />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}
