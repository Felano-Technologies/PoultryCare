import React from 'react';

export default function NextVaccinationCard() {
  // Mocked upcoming vaccine data
  const nextVaccination = {
    flock: "Flock A",
    vaccine: "Newcastle Disease Vaccine",
    date: "2025-05-02"
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Next Vaccination</h3>
        <p className="text-gray-600 text-sm">
          <span className="font-bold">Flock:</span> {nextVaccination.flock}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-bold">Vaccine:</span> {nextVaccination.vaccine}
        </p>
      </div>
      <div className="mt-4 text-green-600 font-semibold text-sm">
        Scheduled: {nextVaccination.date}
      </div>
    </div>
  );
}
