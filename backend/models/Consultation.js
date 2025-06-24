import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledTime: { type: Date, required: true },
  issue: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['booked', 'completed', 'cancelled'],
    default: 'booked'
  },
}, { timestamps: true });

const Consultation = mongoose.model('Consultation', consultationSchema);
export default Consultation;