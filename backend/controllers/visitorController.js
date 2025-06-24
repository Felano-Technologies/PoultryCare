import Visitor from '../models/Visitor.js';

export const getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({ farm: req.user.farm })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json(visitors);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createVisitor = async (req, res) => {
  const { name, purpose, risk } = req.body;
  
  try {
    const newVisitor = new Visitor({
      name,
      purpose,
      risk,
      loggedBy: req.user._id,
    });

    await newVisitor.save();
    res.status(201).json(newVisitor);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};