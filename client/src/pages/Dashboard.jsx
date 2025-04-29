import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DashboardCard from '../components/DashboardCard';
import VaccinationChart from '../components/VaccinationChart';
import ChicksPieChart from '../components/ChicksPieChart';
import FeedConsumptionChart from '../components/FeedConsumptionChart';
import FarmCalendar from '../components/FarmCalendar';
import ActivityLog from '../components/ActivityLog';
import NextVaccinationCard from '../components/NextVaccinationCard';
import WeatherWidget from '../components/WeatherWidget';
import FarmStats from '../components/FarmStats';
import NotificationsCard from '../components/NotificationsCard';
import TempHumidityChart from '../components/TempHumidityChart';

import { Egg, Syringe, Users, AlertTriangle } from 'lucide-react';

import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Dashboard() {
  const totalBirds = 300;
  const deadBirds = 10;
  const mortalityRate = ((deadBirds / totalBirds) * 100).toFixed(1) + "%";

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-10">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800" data-aos="fade-down">
          Farm Dashboard
        </h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-aos="fade-up">
          <DashboardCard
            title="Total Birds"
            value={totalBirds}
            icon={<Egg className="w-8 h-8 text-green-500" />}
          />
          <DashboardCard
            title="Upcoming Vaccines"
            value="4"
            icon={<Syringe className="w-8 h-8 text-blue-500" />}
          />
          <DashboardCard
            title="Active Flocks"
            value="5"
            icon={<Users className="w-8 h-8 text-purple-500" />}
          />
          <DashboardCard
            title="Mortality Rate"
            value={mortalityRate}
            icon={<AlertTriangle className="w-8 h-8 text-red-500" />}
          />
        </div>

        {/* Info Widgets Section */}
        <h2 className="text-xl font-semibold text-gray-700 mt-4">Quick Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WeatherWidget data-aos="fade-right" />
          <NextVaccinationCard data-aos="fade-right" />
          <FarmStats data-aos="fade-right" />
        </div>

        {/* Charts and Activities */}
        <h2 className="text-xl font-semibold text-gray-700 mt-8">Farm Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side: Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Full width Vaccination Chart */}
            <div data-aos="fade-up">
              <VaccinationChart />
            </div>

            {/* Two Charts side-by-side: Chicks Pie Chart + TempHumidity Pie Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div data-aos="fade-up" data-aos-delay="100">
                <ChicksPieChart />
              </div>
              <div data-aos="fade-up" data-aos-delay="150">
                <TempHumidityChart />
              </div>
            </div>


            <div data-aos="fade-up" data-aos-delay="200">
                <FeedConsumptionChart />
              </div>
          </div>

          {/* Right Side: Calendar + Notifications + Activity */}
          <div className="space-y-6">
            <div data-aos="fade-left">
              <FarmCalendar />
            </div>
            <div data-aos="fade-left" data-aos-delay="100">
              <NotificationsCard />
            </div>
            <div data-aos="fade-left" data-aos-delay="200">
              <ActivityLog />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
