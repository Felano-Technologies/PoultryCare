import React from 'react';

export default function FarmStats() {
  // Mocked statistics
  const stats = {
    avgWeightGain: "1.5 kg/week",
    dailyEggs: 240,
    mortalityRate: "3.3%",
    vaccinationCoverage: "85%"
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Farm Statistics</h3>
      <div className="space-y-2 text-gray-600 text-sm">
        <p><span className="font-bold">Avg Weight Gain:</span> {stats.avgWeightGain}</p>
        <p><span className="font-bold">Daily Egg Production:</span> {stats.dailyEggs} eggs</p>
        <p><span className="font-bold">Mortality Rate:</span> {stats.mortalityRate}</p>
        <p><span className="font-bold">Vaccination Coverage:</span> {stats.vaccinationCoverage}</p>
      </div>
    </div>
  );
}
