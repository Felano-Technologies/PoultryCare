import React, { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { registerFlock } from '../services/api';
import AuthLayout from '../components/AuthLayout'; // same wrapper as login
import { useNavigate } from 'react-router-dom';

export default function FarmSetup() {
  const [flockName, setFlockName] = useState('');
  const [breed, setBreed] = useState('');
  const [birdCount, setBirdCount] = useState('');
  const [acquiredAt, setAcquiredAt] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const flockData = {
      flockName,
      breed,
      birdCount: parseInt(birdCount),
      acquiredAt,
      notes,
      status: "active",
    };

    setLoading(true);
    try {
      await registerFlock(flockData);
      toast.success('Flock registered successfully');
      setFlockName('');
      setBreed('');
      setBirdCount('');
      setAcquiredAt('');
      setNotes('');
      navigate('/dashboard')
    } catch (error) {
      toast.error('Failed to register flock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Register a New Flock">
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Flock Name (e.g. April Batch)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            value={flockName}
            onChange={(e) => setFlockName(e.target.value)}
            required
          />
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Breed (e.g. Broiler)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            required
          />
        </div>

        <div className="relative">
          <input
            type="number"
            placeholder="Number of Birds"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            value={birdCount}
            onChange={(e) => setBirdCount(e.target.value)}
            required
          />
        </div>

        <div className="relative">
          <input
            type="date"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            value={acquiredAt}
            onChange={(e) => setAcquiredAt(e.target.value)}
            required
          />
          <CalendarIcon className="absolute top-3 right-3 text-gray-400" size={20} />
        </div>

        <div className="relative">
          <textarea
            placeholder="Notes (optional)"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: !loading ? 1.05 : 1 }}
          whileTap={{ scale: !loading ? 0.95 : 1 }}
          className={`w-full flex items-center justify-center gap-2 ${
            loading ? 'bg-green-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-green-600'
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
            'Submit'
          )}
        </motion.button>
      </motion.form>
    </AuthLayout>
  );
}
