const Appointment = require('../models/Appointment');

const getAppointments = async (req, res, next) => {
  try {
    const { status, doctor, patient } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (doctor) filter.doctor = doctor;
    if (patient) filter.patient = patient;

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name phone age gender')
      .populate('doctor', 'name specialization department')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name phone age gender')
      .populate('doctor', 'name specialization department');
    if (!appointment) {
      res.status(404);
      throw new Error('Appointment not found');
    }
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

const createAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.create(req.body);
    const populated = await appointment.populate([
      { path: 'patient', select: 'name phone age gender' },
      { path: 'doctor', select: 'name specialization department' },
    ]);
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('patient', 'name phone').populate('doctor', 'name specialization');
    if (!appointment) {
      res.status(404);
      throw new Error('Appointment not found');
    }
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      res.status(404);
      throw new Error('Appointment not found');
    }
    res.json({ message: 'Appointment removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
