import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['user', 'ai'], required: true },
    content: { type: String, required: true },
    image: { type: String, default: null }
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);