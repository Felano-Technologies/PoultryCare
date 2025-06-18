import Flock from '../models/Flock.js';
import Vaccination from '../models/Vaccination.js';

export const createFlock = async (req, res) => {
  const { flockName, type, breed, birdCount, acquiredAt, notes } = req.body;

  try {
    const newFlock = new Flock({
      flockName,
      type,
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

    const flocks = await Flock.find({ farm: farmId }).populate('healthLogs');

    const counts = {
      healthy: 0,
      sick: 0,
      dead: 0,
      sold: 0
    };

    flocks.forEach(flock => {
      // Calculate health status counts from logs
      const deadCount = flock.healthLogs
        .filter(log => log.type === 'dead')
        .reduce((sum, log) => sum + log.count, 0);
      
      const sickCount = flock.healthLogs
        .filter(log => log.type === 'sick')
        .reduce((sum, log) => sum + log.count, 0);
      
      const healthyCount = flock.birdCount - deadCount - sickCount;

      counts.healthy += healthyCount;
      counts.sick += sickCount;
      counts.dead += deadCount;

      // Still keep track of sold flocks if needed
      if (flock.status === 'sold') {
        counts.sold += flock.birdCount;
      }
    });

    res.json(counts);
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to get flock status counts", 
      error: err.message 
    });
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


export const getFeedConsumptionStats = async (req, res) => {
  try {
    const farmId = req.user._id;
    
    // Get all flocks with their feed logs from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const flocks = await Flock.find({ farm: farmId })
      .populate({
        path: 'feedLogs',
        match: { date: { $gte: sevenDaysAgo } }
      });
    
    // Initialize daily totals (Mon-Sun)
    const dayMap = {
      0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 
      4: 'Thu', 5: 'Fri', 6: 'Sat'
    };
    
    const weeklyData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Feed (kg)',
        data: [0, 0, 0, 0, 0, 0, 0], // Initialize with zeros
        fill: false,
        borderColor: '#22c55e', // green-500
        backgroundColor: '#22c55e',
        tension: 0.4,
        pointBackgroundColor: '#16a34a' // green-600
      }]
    };
    
    // Process feed logs and group by day of week
    flocks.forEach(flock => {
      flock.feedLogs.forEach(log => {
        if (!log.date) return;
        
        const dayOfWeek = new Date(log.date).getDay(); // 0-6 (Sun-Sat)
        const dayName = dayMap[dayOfWeek];
        const chartIndex = weeklyData.labels.indexOf(dayName);
        
        if (chartIndex !== -1) {
          weeklyData.datasets[0].data[chartIndex] += log.quantityKg;
        }
      });
    });
    
    res.json(weeklyData);
    
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to get feed consumption stats", 
      error: err.message 
    });
  }
};

export const getFarmStatistics = async (req, res) => {
  try {
    const farmId = req.user._id;
    
    // Get all flocks with their health and feed logs
    const flocks = await Flock.find({ farm: farmId })
      .populate('healthLogs')
      .populate('feedLogs');
    
    // Get all vaccinations for this farm
    const vaccinations = await Vaccination.find({ farm: farmId });
    
    // Initialize statistics
    let stats = {
      totalBirds: 0,
      deadBirds: 0,
      sickBirds: 0,
      totalEggs: 0,
      totalFeed: 0,
      vaccinatedBirds: 0,
      flocksCount: flocks.length
    };
    
    // Calculate statistics from flocks
    flocks.forEach(flock => {
      stats.totalBirds += flock.birdCount || 0;
      
      // Health statistics
      flock.healthLogs.forEach(log => {
        if (log.type === 'dead') stats.deadBirds += log.count;
        if (log.type === 'sick') stats.sickBirds += log.count;
        if (log.type === 'egg') stats.totalEggs += log.count;
      });
      
      // Feed statistics
      stats.totalFeed += flock.feedLogs.reduce((sum, log) => sum + log.quantityKg, 0);
    });
    
    // Calculate vaccination stats separately
    stats.vaccinatedBirds = vaccinations.reduce(
      (sum, vax) => sum + vax.birdsVaccinated, 0
    );
    
    // Calculate derived metrics
    const finalStats = {
      mortalityRate: stats.totalBirds > 0 ? 
        `${((stats.deadBirds / stats.totalBirds) * 100).toFixed(1)}%` : "0%",
      vaccinationCoverage: stats.totalBirds > 0 ? 
        `${((stats.vaccinatedBirds / stats.totalBirds) * 100).toFixed(1)}%` : "0%",
      avgDailyFeed: stats.flocksCount > 0 ? 
        `${(stats.totalFeed / stats.flocksCount / 7).toFixed(1)} kg/day` : "0 kg/day",
      eggProductionRate: stats.totalBirds > 0 ? 
        `${((stats.totalEggs / stats.totalBirds) * 100).toFixed(1)}%` : "0%",
      flocksCount: stats.flocksCount,
      totalBirds: stats.totalBirds,
      lastVaccination: vaccinations.length > 0 ? 
        new Date(Math.max(...vaccinations.map(v => v.date))) : null
    };
    
    res.json(finalStats);
    
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to get farm statistics", 
      error: err.message 
    });
  }
};