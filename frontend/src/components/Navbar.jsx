import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">🏥 Hospital MS</div>
      <div className="navbar-links">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/patients">Patients</NavLink>
        <NavLink to="/doctors">Doctors</NavLink>
        <NavLink to="/appointments">Appointments</NavLink>
      </div>
      <div className="navbar-user">
        <span>{user.name} ({user.role})</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
