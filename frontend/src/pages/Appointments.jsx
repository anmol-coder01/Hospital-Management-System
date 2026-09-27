import { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyForm = { patient: '', doctor: '', date: '', time: '', reason: '', status: 'Scheduled' };

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [apptRes, patientRes, doctorRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/patients'),
        api.get('/doctors'),
      ]);
      setAppointments(apptRes.data);
      setPatients(patientRes.data);
      setDoctors(doctorRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/appointments/${editingId}`, form);
      } else {
        await api.post('/appointments', form);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (appt) => {
    setForm({
      patient: appt.patient?._id || '',
      doctor: appt.doctor?._id || '',
      date: appt.date ? appt.date.substring(0, 10) : '',
      time: appt.time,
      reason: appt.reason || '',
      status: appt.status,
    });
    setEditingId(appt._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel/delete this appointment?')) return;
    await api.delete(`/appointments/${id}`);
    fetchAll();
  };

  const statusClass = (status) => {
    if (status === 'Completed') return 'badge badge-green';
    if (status === 'Cancelled') return 'badge badge-red';
    return 'badge badge-blue';
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Appointments</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}>
          {showForm ? 'Close' : '+ Book Appointment'}
        </button>
      </div>

      {showForm && (
        <form className="entity-form" onSubmit={handleSubmit}>
          <select name="patient" value={form.patient} onChange={handleChange} required>
            <option value="">Select patient</option>
            {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <select name="doctor" value={form.doctor} onChange={handleChange} required>
            <option value="">Select doctor</option>
            {doctors.map((d) => <option key={d._id} value={d._id}>{d.name} ({d.specialization})</option>)}
          </select>
          <input name="date" type="date" value={form.date} onChange={handleChange} required />
          <input name="time" type="time" value={form.time} onChange={handleChange} required />
          <input name="reason" placeholder="Reason for visit" value={form.reason} onChange={handleChange} />
          <select name="status" value={form.status} onChange={handleChange}>
            <option>Scheduled</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <button type="submit">{editingId ? 'Update Appointment' : 'Book Appointment'}</button>
        </form>
      )}

      {loading ? (
        <p className="loading">Loading appointments...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 && (
              <tr><td colSpan="6" className="empty-row">No appointments found</td></tr>
            )}
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{a.patient?.name || 'N/A'}</td>
                <td>{a.doctor?.name || 'N/A'}</td>
                <td>{a.date ? new Date(a.date).toLocaleDateString() : '-'}</td>
                <td>{a.time}</td>
                <td><span className={statusClass(a.status)}>{a.status}</span></td>
                <td>
                  <button className="btn-sm" onClick={() => handleEdit(a)}>Edit</button>
                  <button className="btn-sm btn-danger" onClick={() => handleDelete(a._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Appointments;
