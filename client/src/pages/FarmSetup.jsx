import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarIcon } from 'lucide-react';

export default function FarmSetup() {
  const [flockName, setFlockName] = useState('');
  const [breed, setBreed] = useState('');
  const [birdCount, setBirdCount] = useState('');
  const [acquiredAt, setAcquiredAt] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const flockData = {
      flockName,
      breed,
      birdCount: parseInt(birdCount),
      acquiredAt,
      notes,
    };
    console.log('Submitting Flock:', flockData);
    // Send to backend with fetch or axios
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-center">Register New Flock</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input placeholder="Flock Name (e.g. April Batch)" value={flockName} onChange={(e) => setFlockName(e.target.value)} required />
        <Input placeholder="Breed (e.g. Broiler)" value={breed} onChange={(e) => setBreed(e.target.value)} required />
        <Input type="number" placeholder="Number of Birds" value={birdCount} onChange={(e) => setBirdCount(e.target.value)} required />
        <div className="relative">
          <Input type="date" value={acquiredAt} onChange={(e) => setAcquiredAt(e.target.value)} required />
          <CalendarIcon className="absolute right-3 top-3 text-gray-400" size={20} />
        </div>
        <textarea placeholder="Notes (optional)" className="w-full border border-gray-300 rounded-lg p-2" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </div>
  );
}
