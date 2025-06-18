import ActivityLog from '../models/ActivityLog.js';

export const getRecentActivities = async (req, res) => {
  try {
    const farmId = req.user._id;
    
    const activities = await ActivityLog.find({ farm: farmId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('flock user');
    
    const formattedActivities = activities.map(act => ({
      id: act._id,
      type: act.activityType,
      date: act.createdAt.toLocaleDateString(),
      time: act.createdAt.toLocaleTimeString(),
      flock: act.flock?.flockName || 'Farm',
      user: act.user?.name || 'System',
      details: act.details,
      metadata: act.metadata
    }));
    
    res.json(formattedActivities);
    
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to get activities", 
      error: err.message 
    });
  }
};

export const logActivity = async (req, res) => {
  try {
    const { activityType, flockId, details, metadata } = req.body;
    
    const activity = await ActivityLog.logActivity({
      farmId: req.user._id,
      userId: req.user._id,
      activityType,
      flockId,
      details,
      metadata
    });
    
    res.status(201).json(activity);
    
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to log activity", 
      error: err.message 
    });
  }
};

export const getActivitiesByType = async (req, res) => {
  try {
    const farmId = req.user._id;
    const { type } = req.params;
    
    const activities = await ActivityLog.find({ 
      farm: farmId,
      activityType: type 
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('flock');
    
    res.json(activities);
    
  } catch (err) {
    res.status(500).json({ 
      message: `Failed to get ${type} activities`, 
      error: err.message 
    });
  }
};