import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'receptionist' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>
        {error && <p className="error-text">{error}</p>}
        <label>Full Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
        <label>Role</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="receptionist">Receptionist</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default Register;
