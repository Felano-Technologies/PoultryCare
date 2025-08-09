import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createVaccination, fetchVaccinationStats, fetchVaccinations, deleteVaccination, updateVaccination, exportVaccinationsToExcel } from '../services/api';
import {toast} from 'react-toastify';
import { FaEdit, FaTrash, FaFileExcel } from 'react-icons/fa';

export default function Vaccination() {
  const [loading, setLoading] = useState(false); // <-- Loading state

  const [showModal, setShowModal] = useState(false);
  const [flockName, setFlockName] = useState('');
  const [age, setAge] = useState('');
  const [type, setType] = useState('');
  const [breed, setBreed] = useState('');
  
  const [vaccineName, setVaccineName] = useState('');
  const [vaccineType, setVaccineType] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [vaccineBatch, setVaccineBatch] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [dosage, setDosage] = useState('');
  
  const [dateTime, setDateTime] = useState('');
  const [administeredBy, setAdministeredBy] = useState('');
  const [vaccinatedCount, setVaccinatedCount] = useState('');
  const [withdrawalTime, setWithdrawalTime] = useState('');
  
  const [preHealthCheck, setPreHealthCheck] = useState('');
  const [postReactions, setPostReactions] = useState('');
  const [nextVaccinationDate, setNextVaccinationDate] = useState('');

  const [vaccinations, setVaccinations] = useState([]);
  
const [stats, setStats] = useState(null);
const [editingRecord, setEditingRecord] = useState(null);
  
const resetForm = () => {
  setFlockName('');
  setAge('');
  setType('');
  setBreed('');
  setVaccineName('');
  setVaccineType('');
  setManufacturer('');
  setVaccineBatch('');
  setExpiryDate('');
  setDosage('');
  setDateTime('');
  setAdministeredBy('');
  setVaccinatedCount('');
  setWithdrawalTime('');
  setPreHealthCheck('');
  setPostReactions('');
  setNextVaccinationDate('');
  setEditingRecord(null);
};


  useEffect(() => {
    const loadVaccinations = async () => {
      try {
        const data = await fetchVaccinations();
        setVaccinations(data);
      } catch (err) {
        console.error("Failed to fetch vaccinations");
      }
    };
  
    loadVaccinations();
  }, [showModal]);

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchVaccinationStats();
      setStats(data);
    };
    loadStats();
  }, []);

  const handleAddVaccination = async (e) => {
    e.preventDefault();
    setLoading(true);
    const vaccinationData = {
      flockName,
      type,
      breed,
      age: parseInt(age),
      vaccineName,
      vaccineType,
      manufacturer,
      vaccineBatch,
      expiryDate,
      dosage,
      dateTime,
      administeredBy,
      vaccinatedCount: parseInt(vaccinatedCount),
      withdrawalTime,
      preHealthCheck,
      postReactions,
      nextVaccinationDate,
    };
  
    try {
      await createVaccination(vaccinationData);
      toast.success('Vaccination saved!');
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save vaccination');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record? This cannot be undone.')) {
      try {
        await deleteVaccination(id);
        toast.success('Record deleted');
        const data = await fetchVaccinations();
        setVaccinations(data);
      } catch (error) {
        toast.error('Failed to delete record');
      }
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    // Populate form fields
    setFlockName(record.flockName);
    setAge(record.age);
    setType(record.type);
    setBreed(record.breed);
    setVaccineName(record.vaccineName);
    setVaccineType(record.vaccineType);
    setManufacturer(record.manufacturer);
    setVaccineBatch(record.vaccineBatch);
    setExpiryDate(record.expiryDate);
    setDosage(record.dosage);
    setDateTime(record.dateTime);
    setAdministeredBy(record.administeredBy);
    setVaccinatedCount(record.vaccinatedCount);
    setWithdrawalTime(record.withdrawalTime);
    setPreHealthCheck(record.preHealthCheck);
    setPostReactions(record.postReactions);
    setNextVaccinationDate(record.nextVaccinationDate);
    setShowModal(true);
  };

  const handleExport = async () => {
    try {
      const response = await exportVaccinationsToExcel();
      
      // Create blob URL
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vaccination_records_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Export successful');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(`Failed to export records: ${error.message}`);
    }
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
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-5 shadow rounded-lg">
              <h2 className="text-lg font-bold text-gray-500">Total Batches</h2>
              <p className="text-2xl font-extrabold text-green-600 mt-1">{stats.totalBatches}</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg">
              <h2 className="text-lg font-bold text-gray-500">Vaccination Coverage</h2>
              <p className="text-2xl font-extrabold text-green-600 mt-1">{stats.vaccinationCoverage}%</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg">
              <h2 className="text-lg font-bold text-gray-500">Next Dose Due</h2>
              <p className="text-2xl font-extrabold text-yellow-600 mt-1">
                {stats.nextDoseDue ? new Date(stats.nextDoseDue).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg">
              <h2 className="text-lg font-bold text-gray-500">Missed Vaccinations</h2>
              <p className="text-2xl font-extrabold text-red-500 mt-1">{stats.missedCount}</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg">
              <h2 className="text-lg font-bold text-gray-500">Mortality Post-Vaccine</h2>
              <p className="text-2xl font-extrabold text-red-600 mt-1">{stats.mortalityRate}%</p>
            </div>
          </div>
        )}


        {/* Vaccination Table */}
        <div className="bg-white shadow rounded-lg overflow-x-auto mb-6">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-green-100 text-green-700 uppercase">
              <tr>
                <th className="px-4 py-3">Flock</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Breed</th>
                <th className="px-4 py-3">Vaccine</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vaccinations.map((vax, i) => (
                <tr key={i} className="border-b">
                  <td className="px-4 py-2">{vax.flockName || '-'}</td>
                  <td className="px-4 py-2">{vax.type || '-'}</td>
                  <td className="px-4 py-2">{vax.breed || '-'}</td>
                  <td className="px-4 py-2">{vax.vaccineName || '-'}</td>
                  <td className="px-4 py-2">{vax.dateTime?.slice(0, 10)}</td>
                  <td className="px-4 py-2 text-yellow-600 font-semibold">Upcoming</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button 
                      onClick={() => handleEdit(vax)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDelete(vax._id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Vaccination Button */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            Add New Vaccination
          </button>
          <button
            onClick={handleExport}
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
          >
            Export to Excel
          </button>
        </div>
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
      <h2 className="text-2xl font-bold mb-4">
        {editingRecord ? 'Edit Vaccination Record' : 'Add Vaccination Record'}
      </h2>

      <form onSubmit={handleAddVaccination} className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">

        {/* 1. Basic Chick Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Basic Chick Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" value={flockName} onChange={(e) => setFlockName(e.target.value)} placeholder="Flock Name" className="border px-3 py-2 rounded" required />
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age (days)" className="border px-3 py-2 rounded" required />
            <input type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Type" className="border px-3 py-2 rounded" required />
            <input type="text" value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Breed" className="border px-3 py-2 rounded" required />
          </div>
        </div>

        {/* 2. Vaccine Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Vaccine Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" value={vaccineName} onChange={(e) => setVaccineName(e.target.value)} placeholder="Vaccine Name" className="border px-3 py-2 rounded" required />
            <input type="text" value={vaccineType} onChange={(e) => setVaccineType(e.target.value)} placeholder="Type" className="border px-3 py-2 rounded" />
            <input type="text" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} placeholder="Manufacturer" className="border px-3 py-2 rounded" />
            <input type="text" value={vaccineBatch} onChange={(e) => setVaccineBatch(e.target.value)} placeholder="Batch Number" className="border px-3 py-2 rounded" />
            <input type={expiryDate ? "date" : "text"} value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="border px-3 py-2 rounded" placeholder="Expiry Date"  onFocus={(e) => !expiryDate && (e.target.type = 'date')} onBlur={(e) => !e.target.value && (e.target.type = 'text')} />
            <input type="text" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="Dosage & Method" className="border px-3 py-2 rounded" />
          </div>
        </div>

        {/* 3. Vaccination Process */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Vaccination Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
              type={dateTime ? "datetime-local" : "text"} 
              value={dateTime} 
              onChange={(e) => setDateTime(e.target.value)} 
              className="border px-3 py-2 rounded" 
              placeholder="Date & Time of Vaccination"
              onFocus={() => !dateTime && (e.target.type = 'datetime-local')}
              onBlur={() => !dateTime && (e.target.type = 'text')}
              required 
            />            
            <input type="text" value={administeredBy} onChange={(e) => setAdministeredBy(e.target.value)} placeholder="Administered By" className="border px-3 py-2 rounded" />
            <input type="number" value={vaccinatedCount} onChange={(e) => setVaccinatedCount(e.target.value)} placeholder="No. Vaccinated" className="border px-3 py-2 rounded" />
            <input type="text" value={withdrawalTime} onChange={(e) => setWithdrawalTime(e.target.value)} placeholder="Withdrawal Time" className="border px-3 py-2 rounded" />
          </div>
        </div>

        {/* 4. Health & Monitoring */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Health & Monitoring</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={preHealthCheck} onChange={(e) => setPreHealthCheck(e.target.value)} placeholder="Pre-Vaccination Health Check" className="border px-3 py-2 rounded" />
            <input type="text" value={postReactions} onChange={(e) => setPostReactions(e.target.value)} placeholder="Post-Vaccination Reactions" className="border px-3 py-2 rounded" />
            <input 
              type={nextVaccinationDate ? "date" : "text"}
              value={nextVaccinationDate} 
              onChange={(e) => setNextVaccinationDate(e.target.value)} 
              className="border px-3 py-2 rounded" 
              placeholder="Next Vaccination Date"
              onFocus={(e) => !nextVaccinationDate && (e.target.type = 'date')}
              onBlur={(e) => !e.target.value && (e.target.type = 'text')}
            />
            </div>
        </div>


        {/* Submit */}
        <div className="pt-4">
          <button 
            type="submit"
            disabled={loading}
            whileHover={{ scale: !loading ? 1.05 : 1 }}
            whileTap={{ scale: !loading ? 0.95 : 1 }}
            className={`w-full flex items-center justify-center gap-2 ${
              loading ? "bg-green-400 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-green-600"
            } text-white py-3 rounded-lg shadow-md transition`}
          >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
              Saving...
            </>
          ) : (
            "Save Vaccination Record"
          )}
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
