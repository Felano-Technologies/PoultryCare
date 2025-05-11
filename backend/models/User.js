import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  farmName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String, required: true },
  experience: { type: String, required: true },
  farmSize: { type: String },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
