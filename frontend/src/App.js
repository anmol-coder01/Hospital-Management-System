import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/patients" element={<PrivateRoute><Patients /></PrivateRoute>} />
            <Route path="/doctors" element={<PrivateRoute><Doctors /></PrivateRoute>} />
            <Route path="/appointments" element={<PrivateRoute><Appointments /></PrivateRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
