import { useEffect, useState } from 'react';
import api from '../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0, scheduled: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
          api.get('/patients'),
          api.get('/doctors'),
          api.get('/appointments'),
        ]);
        const scheduled = appointmentsRes.data.filter((a) => a.status === 'Scheduled').length;
        setStats({
          patients: patientsRes.data.length,
          doctors: doctorsRes.data.length,
          appointments: appointmentsRes.data.length,
          scheduled,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="loading">Loading dashboard...</p>;

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <div className="stat-grid">
        <div className="stat-card">
          <h3>{stats.patients}</h3>
          <p>Total Patients</p>
        </div>
        <div className="stat-card">
          <h3>{stats.doctors}</h3>
          <p>Total Doctors</p>
        </div>
        <div className="stat-card">
          <h3>{stats.appointments}</h3>
          <p>Total Appointments</p>
        </div>
        <div className="stat-card highlight">
          <h3>{stats.scheduled}</h3>
          <p>Upcoming (Scheduled)</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
