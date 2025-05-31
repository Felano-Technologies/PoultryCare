import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFlocks } from '../services/api'; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Bird, ArrowRight } from 'lucide-react';

export default function FlockList() {
  const [flocks, setFlocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadFlocks() {
      try {
        const data = await fetchFlocks();
        setFlocks(data);
      } catch (error) {
        console.error('Failed to load flocks:', error);
      }
    }
    loadFlocks();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow bg-gray-50 py-12 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-green-600 mb-8 text-center">Your Flocks</h1>

          {flocks.length === 0 ? (
            <div className="text-center text-gray-600">
              <Bird className="mx-auto mb-4 w-12 h-12 text-green-600" />
              <p>No flocks available. Please add one to get started.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {flocks.map((flock) => (
                <div
                  key={flock._id}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-lg transition duration-200 cursor-pointer"
                  onClick={() => navigate(`/flock-details/${flock._id}`)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Bird className="text-green-600 w-6 h-6" />
                    <h2 className="text-xl font-semibold text-gray-800">{flock.flockName}</h2>
                  </div>
                  <p className="text-sm text-gray-600">Bird Count: <span className="font-medium text-gray-800">{flock.birdCount}</span></p>
                  <p className="text-sm text-gray-600">Age: <span className="font-medium text-gray-800">{flock.acquiredAt}</span></p>
                  <div className="mt-4 flex justify-end">
                    <ArrowRight className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
