const Patient = require('../models/Patient');

// @desc  Get all patients (supports ?search=name)
const getPatients = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
    const patients = await Patient.find(filter).sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    next(error);
  }
};

// @desc  Get single patient
const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      res.status(404);
      throw new Error('Patient not found');
    }
    res.json(patient);
  } catch (error) {
    next(error);
  }
};

// @desc  Create patient
const createPatient = async (req, res, next) => {
  try {
    const patient = await Patient.create({ ...req.body, registeredBy: req.user?._id });
    res.status(201).json(patient);
  } catch (error) {
    next(error);
  }
};

// @desc  Update patient
const updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!patient) {
      res.status(404);
      throw new Error('Patient not found');
    }
    res.json(patient);
  } catch (error) {
    next(error);
  }
};

// @desc  Delete patient
const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      res.status(404);
      throw new Error('Patient not found');
    }
    res.json({ message: 'Patient removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPatients, getPatientById, createPatient, updatePatient, deletePatient };
