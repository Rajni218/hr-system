import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyLeaves, getMyAttendance, getTodayAttendance, markAttendance } from '../services/api';
import toast from 'react-hot-toast';

const StatCard = ({ icon, value, label, color }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div>
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

const EmployeeDashboard = () => {
  const { user, setUser } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [todayMarked, setTodayMarked] = useState(false);
  const [marking, setMarking] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [lRes, aRes, tRes] = await Promise.all([
          getMyLeaves(), getMyAttendance(), getTodayAttendance()
        ]);
        setLeaves(lRes.data.leaves);
        setAttendance(aRes.data.attendance);
        setTodayMarked(tRes.data.marked);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleMarkAttendance = async (status) => {
    setMarking(true);
    try {
      await markAttendance({ status });
      setTodayMarked(true);
      setAttendance(prev => [{ status, date: new Date(), _id: Date.now() }, ...prev]);
      toast.success(`Marked as ${status}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setMarking(false);
    }
  };

  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  const approvedLeaves = leaves.filter(l => l.status === 'Approved').length;
  const presentDays = attendance.filter(a => a.status === 'Present').length;

  if (loading) return <div className="loading"><div className="spinner" />Loading dashboard...</div>;

  return (
    <div className="page">
      <div className="page-title">My Dashboard</div>
      <div className="page-subtitle">Overview of your leave & attendance</div>

      {/* Stats */}
      <div className="grid-4 mb-3">
        <StatCard icon="🏖️" value={user?.leaveBalance ?? 0} label="Leave Balance (days)" color="var(--accent)" />
        <StatCard icon="✅" value={presentDays} label="Days Present" color="var(--success)" />
        <StatCard icon="⏳" value={pendingLeaves} label="Pending Leaves" color="var(--warning)" />
        <StatCard icon="📋" value={approvedLeaves} label="Approved Leaves" color="var(--info)" />
      </div>

      {/* Attendance + Profile row */}
      <div className="grid-2 mb-3">
        {/* Today's Attendance */}
        <div className="card">
          <div className="section-title">📅 Today's Attendance</div>
          {todayMarked ? (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
              <p style={{ color: 'var(--success)', fontWeight: 700 }}>Attendance marked for today!</p>
              <p style={{ color: 'var(--text3)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--text2)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Mark your attendance for today:
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-success" style={{ flex: 1 }} onClick={() => handleMarkAttendance('Present')} disabled={marking}>
                  ✅ Present
                </button>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleMarkAttendance('Absent')} disabled={marking}>
                  ❌ Absent
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile card */}
        <div className="card">
          <div className="section-title">👤 My Profile</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              ['Full Name', user?.fullName],
              ['Email', user?.email],
              ['Role', user?.role],
              ['Joined', user?.dateOfJoining ? new Date(user.dateOfJoining).toLocaleDateString('en-IN') : '—'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text3)' }}>{label}</span>
                <span style={{ fontWeight: 600, textTransform: label === 'Role' ? 'capitalize' : 'none' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Leaves */}
      <div className="card mb-3">
        <div className="flex-between mb-2">
          <div className="section-title" style={{ margin: 0 }}>Recent Leave Requests</div>
          <Link to="/my-leaves" className="btn btn-ghost btn-sm">View All</Link>
        </div>
        {leaves.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <p>No leave requests yet. <Link to="/apply-leave" style={{ color: 'var(--accent)' }}>Apply now</Link></p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Type</th><th>Start</th><th>End</th><th>Days</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.slice(0, 5).map(l => (
                  <tr key={l._id}>
                    <td><span className={`badge badge-${l.leaveType.toLowerCase()}`}>{l.leaveType}</span></td>
                    <td>{new Date(l.startDate).toLocaleDateString('en-IN')}</td>
                    <td>{new Date(l.endDate).toLocaleDateString('en-IN')}</td>
                    <td>{l.totalDays}</td>
                    <td><span className={`badge badge-${l.status.toLowerCase()}`}>{l.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="section-title">⚡ Quick Actions</div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/apply-leave" className="btn btn-primary">📝 Apply Leave</Link>
          <Link to="/my-leaves" className="btn btn-ghost">📋 View Leave History</Link>
          <Link to="/my-attendance" className="btn btn-ghost">📅 Attendance History</Link>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
