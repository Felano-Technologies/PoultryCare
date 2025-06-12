import mongoose from 'mongoose';

const aiMessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'ai'], required: true },
    content: { type: String, required: true },
    image: { type: String, default: null },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: 'ai_messages' }
);

export default mongoose.model('AIMessage', aiMessageSchema);
