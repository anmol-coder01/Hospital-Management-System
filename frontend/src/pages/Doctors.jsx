import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const emptyForm = { name: '', specialization: '', department: '', phone: '', email: '', fee: '', availableDays: '' };

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/doctors');
      setDoctors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      fee: Number(form.fee) || 0,
      availableDays: form.availableDays.split(',').map((d) => d.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await api.put(`/doctors/${editingId}`, payload);
      } else {
        await api.post('/doctors', payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchDoctors();
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (doctor) => {
    setForm({
      name: doctor.name,
      specialization: doctor.specialization,
      department: doctor.department,
      phone: doctor.phone,
      email: doctor.email || '',
      fee: doctor.fee || '',
      availableDays: (doctor.availableDays || []).join(', '),
    });
    setEditingId(doctor._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doctor?')) return;
    await api.delete(`/doctors/${id}`);
    fetchDoctors();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Doctors</h1>
        {isAdmin && (
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}>
            {showForm ? 'Close' : '+ Add Doctor'}
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <form className="entity-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
          <input name="specialization" placeholder="Specialization" value={form.specialization} onChange={handleChange} required />
          <input name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input name="fee" type="number" placeholder="Consultation fee" value={form.fee} onChange={handleChange} />
          <input name="availableDays" placeholder="Available days (comma separated)" value={form.availableDays} onChange={handleChange} />
          <button type="submit">{editingId ? 'Update Doctor' : 'Save Doctor'}</button>
        </form>
      )}

      {loading ? (
        <p className="loading">Loading doctors...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th><th>Specialization</th><th>Department</th><th>Phone</th><th>Fee</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 && (
              <tr><td colSpan={isAdmin ? 6 : 5} className="empty-row">No doctors found</td></tr>
            )}
            {doctors.map((d) => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>{d.specialization}</td>
                <td>{d.department}</td>
                <td>{d.phone}</td>
                <td>{d.fee ? `$${d.fee}` : '-'}</td>
                {isAdmin && (
                  <td>
                    <button className="btn-sm" onClick={() => handleEdit(d)}>Edit</button>
                    <button className="btn-sm btn-danger" onClick={() => handleDelete(d._id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Doctors;
