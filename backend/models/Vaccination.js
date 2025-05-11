const mongoose = require('mongoose');

const VaccinationSchema = new mongoose.Schema({
  flockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flock' },
  vaccineName: String,
  dateGiven: Date,
  nextDue: Date,
  remarks: String,
});

module.exports = mongoose.model('Vaccination', VaccinationSchema);
