import Vaccination from '../models/Vaccination.js';
import Flock from '../models/Flock.js';

export const createVaccination = async (req, res) => {
  try {
    const newRecord = new Vaccination({ ...req.body, farm: req.user._id });
    await newRecord.save();
    res.status(201).json({ message: 'Vaccination record saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save record', error: err.message });
  }
};

export const getVaccinations = async (req, res) => {
  try {
    const records = await Vaccination.find({ farm: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch records', error: err.message });
  }
};


export const getVaccinationStats = async (req, res) => {
  try {
    const farmId = req.user._id;

    const flocks = await Flock.find({ farm: farmId, status: 'active' });
    const vaccinations = await Vaccination.find({ farm: farmId });

    const totalBatches = flocks.length;
    const totalBirds = flocks.reduce((sum, f) => sum + (f.birdCount || 0), 0);
    const vaccinatedBirds = vaccinations.reduce((sum, v) => sum + (v.vaccinatedCount || 0), 0);

    const nextDueDates = vaccinations
      .map(v => v.nextVaccinationDate)
      .filter(Boolean)
      .sort((a, b) => new Date(a) - new Date(b));

    const missed = vaccinations.filter(v => {
      const due = new Date(v.dateTime);
      return due < new Date();
    });

    res.status(200).json({
      totalBatches,
      vaccinationCoverage: totalBirds > 0 ? Math.min(100, ((vaccinatedBirds / totalBirds) * 100).toFixed(1)) : 0,
      nextDoseDue: nextDueDates[0] || null,
      missedCount: missed.length,
      mortalityRate: 1.5 // placeholder, you can calculate from a real field
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};



export const getVaccinationChartData = async (req, res) => {
  try {
    const farmId = req.user._id;

    const flocks = await Flock.find({ farm: farmId });
    const vaccinations = await Vaccination.find({ farm: farmId });

    const chartData = flocks.map(flock => {
      const vaccinatedForThisFlock = vaccinations
        .filter(v => v.flockName === flock.flockName)
        .reduce((sum, v) => sum + (v.vaccinatedCount || 0), 0);

      const percentage = flock.birdCount
        ? Math.min(100, ((vaccinatedForThisFlock / flock.birdCount) * 100).toFixed(1))
        : 0;

      return {
        flockName: flock.flockName,
        percentage: Number(percentage)
      };
    });

    res.json(chartData);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chart data', error: err.message });
  }
};

export const getNextVaccination = async (req, res) => {
  try {
    const farmId = req.user._id;

    const upcoming = await Vaccination.find({
      farm: farmId,
      nextVaccinationDate: { $gte: new Date() }
    })
      .sort({ nextVaccinationDate: 1 })
      .limit(1);

    if (!upcoming.length) {
      return res.json(null);
    }

    const next = upcoming[0];
    res.json({
      flock: next.flockName,
      vaccine: next.vaccineName,
      date: next.nextVaccinationDate
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch next vaccination", error: err.message });
  }
};
