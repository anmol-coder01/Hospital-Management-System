const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true },
    department: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, trim: true, lowercase: true },
    availableDays: [{ type: String }],
    fee: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
