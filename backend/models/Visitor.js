import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  purpose: { type: String, required: true },
  risk: { 
    type: String, 
    required: true,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  },
  loggedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

const Visitor = mongoose.model('Visitor', visitorSchema);

export default Visitor;