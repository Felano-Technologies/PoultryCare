import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Vaccination() {
  const [showModal, setShowModal] = useState(false);
  const [flockName, setFlockName] = useState('');
  const [vaccine, setVaccine] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddVaccination = (e) => {
    e.preventDefault();
    if (!flockName || !vaccine || !date) {
      alert('Please fill in all required fields.');
      return;
    }

    console.log({
      flockName,
      vaccine,
      date,
      notes
    });

    setFlockName('');
    setVaccine('');
    setDate('');
    setNotes('');
    setShowModal(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Vaccination Dashboard</h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Monitor your vaccination records, view health trends, and keep your chicks protected with real-time updates.
        </p>

        {/* Overview Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-sm text-gray-500">Total Batches</h2>
            <p className="text-2xl font-bold text-green-600 mt-1">8</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-sm text-gray-500">Vaccination Coverage</h2>
            <p className="text-2xl font-bold text-green-600 mt-1">92%</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-sm text-gray-500">Next Dose Due</h2>
            <p className="text-lg font-medium text-yellow-600 mt-1">May 3, 2025</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-sm text-gray-500">Missed Vaccinations</h2>
            <p className="text-2xl font-bold text-red-500 mt-1">2</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-sm text-gray-500">Mortality Post-Vaccine</h2>
            <p className="text-2xl font-bold text-red-400 mt-1">1.5%</p>
          </div>
        </div>

        {/* Vaccination Table */}
        <div className="bg-white shadow rounded-lg overflow-x-auto mb-6">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-green-100 text-green-700 uppercase">
              <tr>
                <th className="px-4 py-3">Batch</th>
                <th className="px-4 py-3">Breed</th>
                <th className="px-4 py-3">Vaccine</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">Batch A</td>
                <td className="px-4 py-2">Broiler</td>
                <td className="px-4 py-2">NDV</td>
                <td className="px-4 py-2">2025-04-28</td>
                <td className="px-4 py-2 text-yellow-600 font-semibold">Upcoming</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline text-sm">View</button>
                </td>
              </tr>
              {/* Add dynamic rows later */}
            </tbody>
          </table>
        </div>

        {/* Add Vaccination Button */}
        <button
          onClick={() => setShowModal(true)}
          className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
        >
          Add New Vaccination
        </button>
      </div>

      {/* Add Vaccination Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Add Vaccination Record</h2>

            <form onSubmit={handleAddVaccination} className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">

              {/* 1. Basic Chick Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Basic Chick Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Batch Number" className="border px-3 py-2 rounded" required />
                  <input type="number" placeholder="Age (days)" className="border px-3 py-2 rounded" required />
                  <input type="text" placeholder="Breed" className="border px-3 py-2 rounded" required />
                </div>
              </div>

              {/* 2. Vaccine Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Vaccine Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Vaccine Name" className="border px-3 py-2 rounded" required />
                  <input type="text" placeholder="Type" className="border px-3 py-2 rounded" />
                  <input type="text" placeholder="Manufacturer" className="border px-3 py-2 rounded" />
                  <input type="text" placeholder="Batch Number" className="border px-3 py-2 rounded" />
                  <input type="date" placeholder="Expiry Date" className="border px-3 py-2 rounded" />
                  <input type="text" placeholder="Dosage & Method" className="border px-3 py-2 rounded" />
                </div>
              </div>

              {/* 3. Vaccination Process */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Vaccination Process</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="datetime-local" placeholder="Date & Time" className="border px-3 py-2 rounded" required />
                  <input type="text" placeholder="Administered By" className="border px-3 py-2 rounded" />
                  <input type="number" placeholder="No. Vaccinated" className="border px-3 py-2 rounded" />
                  <input type="text" placeholder="Withdrawal Time" className="border px-3 py-2 rounded" />
                </div>
              </div>

              {/* 4. Health & Monitoring */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Health & Monitoring</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Pre-Vaccination Health Check" className="border px-3 py-2 rounded" />
                  <input type="text" placeholder="Post-Vaccination Reactions" className="border px-3 py-2 rounded" />
                  <input type="date" placeholder="Next Vaccination Date" className="border px-3 py-2 rounded" />
                </div>
              </div>

              {/* 5. Storage & Equipment */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Storage & Equipment</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Storage Temp (°C)" className="border px-3 py-2 rounded" />
                  <input type="text" placeholder="Equipment Used" className="border px-3 py-2 rounded" />
                  <input type="text" placeholder="Sanitization Status" className="border px-3 py-2 rounded" />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button type="submit" className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition">
                  Save Vaccination Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        <Footer />
    </div>
  );
}
