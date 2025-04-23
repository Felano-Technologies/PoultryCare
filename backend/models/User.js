import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    farmName: { type: String, required: true },
    ownerName: { type: String },
    location: { type: String },
    contactNumber: { type: String },
    establishedDate: { type: Date },
    numberOfBirds: { type: Number },
    breedTypes: [{ type: String }], 
    biosecurityLevel: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    vaccinationSchedule: [{ 
      vaccine: String, 
      date: Date, 
      completed: { type: Boolean, default: false } 
    }],
    pedigreeRecords: [{ 
      birdId: String, 
      parents: [String], 
      notes: String 
    }],
    diseaseHistory: [{
      disease: String,
      treatment: String,
      outcome: String,
      date: Date
    }]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
