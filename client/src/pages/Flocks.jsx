import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFlocks, deleteFlock, exportFlock } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Bird, ArrowRight, Edit, Trash2, Download } from 'lucide-react';
import { toast } from 'react-toastify';

export default function FlockList() {
  const [flocks, setFlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadFlocks();
  }, []);

  async function loadFlocks() {
    try {
      setIsLoading(true);
      const data = await fetchFlocks();
      setFlocks(data);
    } catch (error) {
      console.error('Failed to load flocks:', error);
      toast.error('Failed to load flocks');
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (flockId, e) => {
    e.stopPropagation();
    try {
      await deleteFlock(flockId);
      setFlocks(flocks.filter(flock => flock._id !== flockId));
      toast.success('Flock deleted successfully');
    } catch (error) {
      console.error('Failed to delete flock:', error);
      toast.error('Failed to delete flock');
    }
  };

  const handleExport = async (flockId, e) => {
    e.stopPropagation();
    try {
      await exportFlock(flockId);
      toast.success('Export started successfully');
    } catch (error) {
      console.error('Failed to export flock:', error);
      toast.error('Failed to export flock');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow bg-gray-50 py-12 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-green-600 mb-8 text-center">Your Flocks</h1>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                  <div className="animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="rounded-full bg-gray-200 h-6 w-6"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex gap-3">
                        <div className="h-5 w-5 bg-gray-200 rounded"></div>
                        <div className="h-5 w-5 bg-gray-200 rounded"></div>
                        <div className="h-5 w-5 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-5 w-5 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : flocks.length === 0 ? (
            <div className="text-center text-gray-600">
              <Bird className="mx-auto mb-4 w-12 h-12 text-green-600" />
              <p>No flocks available. Please add one to get started.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {flocks.map((flock) => (
                <div
                  key={flock._id}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-lg transition duration-200 cursor-pointer relative"
                  onClick={() => navigate(`/flock-details/${flock._id}`)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Bird className="text-green-600 w-6 h-6" />
                    <h2 className="text-xl font-semibold text-gray-800">{flock.flockName}</h2>
                  </div>
                  <p className="text-sm text-gray-600">Bird Count: <span className="font-medium text-gray-800">{flock.birdCount}</span></p>
                  <p className="text-sm text-gray-600">Age: <span className="font-medium text-gray-800">{flock.acquiredAt}</span></p>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit-flock/${flock._id}`);
                        }}
                        className="text-gray-500 hover:text-green-600 transition"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(flock._id, e)}
                        className="text-gray-500 hover:text-red-600 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={(e) => handleExport(flock._id, e)}
                        className="text-gray-500 hover:text-blue-600 transition"
                        title="Export"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
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