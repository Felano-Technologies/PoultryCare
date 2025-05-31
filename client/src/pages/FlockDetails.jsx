import React, { useEffect, useState } from 'react';
import {
  Egg,
  ActivitySquare,
  Skull,
  HeartPulse,
  Wheat,
  ClipboardList,
  PlusCircle,
  PenLine
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchFlockById, logFlockHealth, logFlockFeed } from '../services/api';

export default function FlockDetails() {
  const { id } = useParams();
  const [flock, setFlock] = useState(null);
  const [healthLogs, setHealthLogs] = useState([]);
  const [feedLogs, setFeedLogs] = useState([]);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showFeedModal, setShowFeedModal] = useState(false);

  const loadFlock = async () => {
    const data = await fetchFlockById(id);
    setFlock(data);
    setHealthLogs(data.healthLogs.reverse());
    setFeedLogs(data.feedLogs.reverse());
  };

  useEffect(() => {
    loadFlock();
  }, [id]);

  if (!flock) return <div className="p-6 text-gray-600">Loading...</div>;

  return (
    <>
      <Navbar />

      <div className="px-4 md:px-8 py-10 max-w-6xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#15803d] flex items-center gap-2">
            <Egg className="w-7 h-7" /> {flock.flockName} Overview
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard icon={<ActivitySquare />} title="Bird Count" value={flock.birdCount} />
          <SummaryCard icon={<Skull />} title="Deaths" value={healthLogs.filter(l => l.type === 'dead').reduce((sum, l) => sum + l.count, 0)} />
          <SummaryCard icon={<HeartPulse />} title="Sick Reports" value={healthLogs.filter(l => l.type === 'sick').length} />
          <SummaryCard icon={<Wheat />} title="Feed Used (kg)" value={feedLogs.reduce((sum, f) => sum + f.quantityKg, 0)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-[#15803d] flex items-center gap-2 mb-2">
              <ClipboardList className="w-5 h-5" /> Health Logs
            </h2>
            {healthLogs.length === 0 ? (
              <p className="text-sm text-gray-500">No health logs yet.</p>
            ) : (
              <ul className="space-y-2 max-h-72 overflow-auto">
                {healthLogs.map((log, index) => (
                  <li key={index} className="border p-3 rounded text-sm">
                    <span className="font-semibold capitalize">{log.type}</span> – {log.count} birds<br />
                    <span className="text-gray-500">{new Date(log.date).toLocaleString()}</span><br />
                    <span className="text-xs italic">{log.remarks}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-[#15803d] flex items-center gap-2 mb-2">
              <ClipboardList className="w-5 h-5" /> Feed Logs
            </h2>
            {feedLogs.length === 0 ? (
              <p className="text-sm text-gray-500">No feed logs yet.</p>
            ) : (
              <ul className="space-y-2 max-h-72 overflow-auto">
                {feedLogs.map((log, index) => (
                  <li key={index} className="border p-3 rounded text-sm">
                    {log.feedType} – {log.quantityKg} kg<br />
                    <span className="text-gray-500">{new Date(log.date).toLocaleString()}</span><br />
                    <span className="text-xs italic">{log.remarks}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            className="flex items-center gap-2 bg-[#15803d] text-white px-4 py-2 rounded hover:bg-green-700 transition"
            onClick={() => setShowHealthModal(true)}
          >
            <PenLine className="w-4 h-4" /> Log Health
          </button>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => setShowFeedModal(true)}
          >
            <PlusCircle className="w-4 h-4" /> Log Feed
          </button>
        </div>

        <HealthLogModal
          open={showHealthModal}
          onClose={() => setShowHealthModal(false)}
          onSubmit={async (data) => {
            await logFlockHealth(flock._id, data);
            await loadFlock();
          }}
        />

        <FeedLogModal
          open={showFeedModal}
          onClose={() => setShowFeedModal(false)}
          onSubmit={async (data) => {
            await logFlockFeed(flock._id, data);
            await loadFlock();
          }}
        />
      </div>

      <Footer />
    </>
  );
}

// SummaryCard component
function SummaryCard({ icon, title, value }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow flex flex-col items-start gap-2">
      <div className="text-[#15803d]">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

// Health Modal
function HealthLogModal({ open, onClose, onSubmit }) {
  const [type, setType] = useState('sick');
  const [count, setCount] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type, count: parseInt(count), remarks });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-3 text-xl" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Log Health Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border p-2 rounded">
            <option value="sick">Sick</option>
            <option value="dead">Dead</option>
            <option value="healthy">Healthy</option>
          </select>
          <input
            type="number"
            placeholder="Count"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            placeholder="Remarks (optional)"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button className="w-full bg-[#15803d] text-white py-2 rounded hover:bg-green-700">Submit</button>
        </form>
      </div>
    </div>
  );
}

// Feed Modal
function FeedLogModal({ open, onClose, onSubmit }) {
  const [feedType, setFeedType] = useState('');
  const [quantityKg, setQuantityKg] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ feedType, quantityKg: parseFloat(quantityKg), remarks });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-3 text-xl" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Log Feed Record</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Feed Type"
            value={feedType}
            onChange={(e) => setFeedType(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Quantity (kg)"
            value={quantityKg}
            onChange={(e) => setQuantityKg(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            placeholder="Remarks (optional)"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Submit</button>
        </form>
      </div>
    </div>
  );
}
