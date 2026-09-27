import { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyForm = { name: '', age: '', gender: 'Male', phone: '', email: '', address: '', bloodGroup: '', medicalHistory: '' };

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPatients = async (query = '') => {
    setLoading(true);
    try {
      const { data } = await api.get(`/patients${query ? `?search=${query}` : ''}`);
      setPatients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/patients/${editingId}`, form);
      } else {
        await api.post('/patients', form);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchPatients();
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (patient) => {
    setForm({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email || '',
      address: patient.address || '',
      bloodGroup: patient.bloodGroup || '',
      medicalHistory: patient.medicalHistory || '',
    });
    setEditingId(patient._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient record?')) return;
    await api.delete(`/patients/${id}`);
    fetchPatients();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPatients(search);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Patients</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}>
          {showForm ? 'Close' : '+ Add Patient'}
        </button>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button type="submit">Search</button>
      </form>

      {showForm && (
        <form className="entity-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
          <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required />
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input name="bloodGroup" placeholder="Blood group" value={form.bloodGroup} onChange={handleChange} />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
          <textarea name="medicalHistory" placeholder="Medical history" value={form.medicalHistory} onChange={handleChange} />
          <button type="submit">{editingId ? 'Update Patient' : 'Save Patient'}</button>
        </form>
      )}

      {loading ? (
        <p className="loading">Loading patients...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th><th>Age</th><th>Gender</th><th>Phone</th><th>Blood Group</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 && (
              <tr><td colSpan="6" className="empty-row">No patients found</td></tr>
            )}
            {patients.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>{p.phone}</td>
                <td>{p.bloodGroup || '-'}</td>
                <td>
                  <button className="btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="btn-sm btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Patients;
