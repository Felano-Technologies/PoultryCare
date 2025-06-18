import Notification from '../models/Notification.js';
import Flock from '../models/Flock.js';
import Vaccination from '../models/Vaccination.js';

export const getNotifications = async (req, res) => {
  try {
    const farmId = req.user._id;
    const now = new Date();
    
    // 1. Get system-generated notifications
    const upcomingNotifications = await generateSystemNotifications(farmId);
    
    // 2. Get manual notifications (marked as unread or high priority)
    const manualNotifications = await Notification.find({
      farm: farmId,
      $or: [
        { isRead: false },
        { priority: 'high' }
      ],
      dueDate: { $gte: now }
    }).sort({ dueDate: 1 }).limit(10);
    
    // Combine and format notifications
    const allNotifications = [
      ...upcomingNotifications,
      ...manualNotifications.map(n => ({
        id: n._id,
        type: n.type,
        message: n.message,
        date: n.dueDate,
        priority: n.priority
      }))
    ].sort((a, b) => a.date - b.date);
    
    res.json(allNotifications.slice(0, 10)); // Return top 10
    
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to get notifications", 
      error: err.message 
    });
  }
};

async function generateSystemNotifications(farmId) {
  const now = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(now.getDate() + 3);
  
  // 1. Upcoming vaccinations
  const upcomingVaccinations = await Vaccination.find({
    farm: farmId,
    date: { 
      $gte: now,
      $lte: threeDaysFromNow 
    }
  }).populate('flock');
  
  // 2. Flocks due for health check (last check > 28 days ago)
  const flocksDueForCheckup = await Flock.find({
    farm: farmId,
    $or: [
      { lastHealthCheck: { $lt: new Date(now.setDate(now.getDate() - 28)) } },
      { lastHealthCheck: { $exists: false } }
    ]
  });
  
  // 3. Feed inventory alerts (if you track inventory)
  
  return [
    ...upcomingVaccinations.map(vax => ({
      id: vax._id,
      type: 'vaccination',
      message: `${vax.vaccineName} due for ${vax.flock?.flockName || 'Flock'} on ${vax.date.toLocaleDateString()}`,
      date: vax.date,
      priority: 'high'
    })),
    ...flocksDueForCheckup.map(flock => ({
      id: flock._id,
      type: 'health-check',
      message: `Routine health check overdue for ${flock.flockName}`,
      date: flock.lastHealthCheck || new Date(now.setDate(now.getDate() - 29)),
      priority: 'medium'
    }))
  ];
}

export const createNotification = async (req, res) => {
  try {
    const { type, message, relatedFlock, dueDate, priority } = req.body;
    
    const notification = await Notification.create({
      farm: req.user._id,
      type,
      message,
      relatedFlock,
      dueDate: new Date(dueDate),
      priority: priority || 'medium'
    });
    
    res.status(201).json(notification);
    
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to create notification", 
      error: err.message 
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    res.json(notification);
    
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to mark notification as read", 
      error: err.message 
    });
  }
};