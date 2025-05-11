const mongoose = require('mongoose');

const PedigreeSchema = new mongoose.Schema({
  flockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flock' },
  generation: Number,
  sire: String, // Father
  dam: String,  // Mother
  notes: String,
  healthInfo: String,
  productivityNotes: String,
});

module.exports = mongoose.model('Pedigree', PedigreeSchema);
