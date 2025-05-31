import Flock from '../models/Flock.js';

export const createFlock = async (req, res) => {
  const { flockName, breed, birdCount, acquiredAt, notes } = req.body;

  try {
    const newFlock = new Flock({
      flockName,
      breed,
      birdCount,
      acquiredAt,
      notes,
      farm: req.user._id, // from auth middleware
    });

    await newFlock.save();
    res.status(201).json({ message: 'Flock registered successfully', flock: newFlock });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create flock', error: err.message });
  }
};

export const getFlocksByFarm = async (req, res) => {
  try {
    const flocks = await Flock.find({ farm: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(flocks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch flocks', error: err.message });
  }
};


export const getFlockStatusCounts = async (req, res) => {
  try {
    const farmId = req.user._id;

    const flocks = await Flock.find({ farm: farmId });

    const counts = {
      active: 0,
      sold: 0,
      completed: 0,
      dead: 0
    };

    flocks.forEach(flock => {
      if (flock.status && counts[flock.status] !== undefined) {
        counts[flock.status] += flock.birdCount || 0;
      }
    });

    res.json(counts);
  } catch (err) {
    res.status(500).json({ message: "Failed to get flock status counts", error: err.message });
  }
};

export const getFlockById = async (req, res) => {
  try {
    const flock = await Flock.findOne({ _id: req.params.id, farm: req.user._id });
    if (!flock) return res.status(404).json({ message: "Flock not found" });
    res.json(flock);
  } catch (err) {
    res.status(500).json({ message: "Error fetching flock", error: err.message });
  }
};

export const logFlockHealth = async (req, res) => {
  const { type, count, remarks } = req.body;

  try {
    const flock = await Flock.findOne({ _id: req.params.id, farm: req.user._id });
    if (!flock) return res.status(404).json({ message: "Flock not found" });

    flock.healthLogs.push({ type, count, remarks });

    if (type === 'dead') {
      flock.birdCount = Math.max(0, flock.birdCount - count);
    }

    await flock.save();
    res.json({ message: "Health log added", flock });
  } catch (err) {
    res.status(500).json({ message: "Failed to log health", error: err.message });
  }
};

export const logFlockFeed = async (req, res) => {
  const { feedType, quantityKg, remarks } = req.body;

  try {
    const flock = await Flock.findOne({ _id: req.params.id, farm: req.user._id });
    if (!flock) return res.status(404).json({ message: "Flock not found" });

    flock.feedLogs.push({ feedType, quantityKg, remarks });

    await flock.save();
    res.json({ message: "Feed log added", flock });
  } catch (err) {
    res.status(500).json({ message: "Failed to log feed", error: err.message });
  }
};
