import mongoose from 'mongoose';

const vaccinationSchema = new mongoose.Schema({
  flockName: String,
  breed: String,
  flockName: String,
  age: Number,

  vaccineName: String,
  vaccineType: String,
  manufacturer: String,
  vaccineBatch: String,
  expiryDate: Date,
  dosage: String,

  dateTime: Date,
  administeredBy: String,
  vaccinatedCount: Number,
  withdrawalTime: String,

  preHealthCheck: String,
  postReactions: String,
  nextVaccinationDate: Date,

  storageTemp: String,
  equipmentUsed: String,
  sanitizationStatus: String,

  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('Vaccination', vaccinationSchema);
