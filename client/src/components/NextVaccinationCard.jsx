import React, { useEffect, useState } from 'react';
import { fetchNextVaccination } from '../services/api';

export default function NextVaccinationCard() {
  const [nextVaccination, setNextVaccination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNext = async () => {
      try {
        const data = await fetchNextVaccination();
        setNextVaccination(data);
      } catch (error) {
        console.error("Failed to fetch next vaccination");
      } finally {
        setLoading(false);
      }
    };
    loadNext();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Next Vaccination</h3>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : nextVaccination ? (
          <>
            <p className="text-gray-600 text-sm">
              <span className="font-bold">Flock:</span> {nextVaccination.flock}
            </p>
            <p className="text-gray-600 text-sm">
              <span className="font-bold">Vaccine:</span> {nextVaccination.vaccine}
            </p>
            <p className="mt-4 text-green-600 font-semibold text-sm">
              Scheduled: {new Date(nextVaccination.date).toLocaleDateString()}
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-500">No upcoming vaccinations.</p>
        )}
      </div>
    </div>
  );
}
