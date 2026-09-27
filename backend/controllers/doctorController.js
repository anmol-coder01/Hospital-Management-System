const Doctor = require('../models/Doctor');

const getDoctors = async (req, res, next) => {
  try {
    const { department } = req.query;
    const filter = department ? { department } : {};
    const doctors = await Doctor.find(filter).sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      res.status(404);
      throw new Error('Doctor not found');
    }
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const createDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    next(error);
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doctor) {
      res.status(404);
      throw new Error('Doctor not found');
    }
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      res.status(404);
      throw new Error('Doctor not found');
    }
    res.json({ message: 'Doctor removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor };
