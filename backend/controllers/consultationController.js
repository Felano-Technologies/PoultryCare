import User from '../models/User.js';
import Consultation from '../models/Consultation.js';

// Predefined responses for the chat bot
const CHAT_RESPONSES = {
  greetings: "Hello! How can I assist you with your poultry farming today?",
  diseases: "Common poultry diseases include Newcastle disease, Avian influenza, and Infectious bronchitis. Vaccination and biosecurity are key prevention methods.",
  feed: "For layers, a balanced diet with 16-18% protein and 3-4% calcium is recommended. For broilers, starter feed should have 20-24% protein.",
  default: "I'm sorry, I didn't understand your question. Could you please rephrase it or ask about: diseases, feed, vaccination, or housing?"
};

// @desc    Get experts by role
// @route   GET /api/consultation/experts
// @access  Public
export const getExpertsByRole = async (req, res) => {
  try {
    const { role } = req.query;
    
    if (!role) {
      return res.status(400).json({ message: 'Role parameter is required' });
    }

    const experts = await User.find({ role })
      .select('_id farmName role')
      .sort({ name: 1 });

    res.json(experts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Book a consultation
// @route   POST /api/consultation/bookings
// @access  Private
export const bookConsultation = async (req, res) => {
  try {
    const { expertId, dateTime, issue } = req.body;
    
    // Check if expert exists
    const expert = await User.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }

    // Create new consultation
    const consultation = new Consultation({
      user: req.user._id,
      expert: expertId,
      scheduledTime: dateTime,
      issue,
      status: 'booked'
    });

    const savedConsultation = await consultation.save();
    
    // Populate user and expert info in the response
    const populatedConsultation = await Consultation.findById(savedConsultation._id)
      .populate('user', 'name email')
      .populate('expert', 'name email role');

    res.status(201).json(populatedConsultation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user's consultations
// @route   GET /api/consultation/bookings
// @access  Private
export const getUserConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({
      $or: [
        { user: req.user._id },
        { expert: req.user._id }
      ]
    })
    .populate('user', 'name email')
    .populate('expert', 'name email role')
    .sort({ scheduledTime: -1 });

    res.json(consultations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Handle chat message and return bot response
// @route   POST /api/consultation/chat
// @access  Public
export const handleChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const lowerCaseMessage = message.toLowerCase();

    let response;
    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      response = CHAT_RESPONSES.greetings;
    } else if (lowerCaseMessage.includes('disease') || lowerCaseMessage.includes('sick')) {
      response = CHAT_RESPONSES.diseases;
    } else if (lowerCaseMessage.includes('feed') || lowerCaseMessage.includes('diet')) {
      response = CHAT_RESPONSES.feed;
    } else {
      response = CHAT_RESPONSES.default;
    }

    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};