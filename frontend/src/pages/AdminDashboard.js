import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllLeaves, getAllUsers, getAllAttendance } from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [lRes, uRes, aRes] = await Promise.all([
          getAllLeaves(), getAllUsers(), getAllAttendance()
        ]);
        setLeaves(lRes.data.leaves);
        setUsers(uRes.data.users);
        setAttendance(aRes.data.attendance);
      } catch {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const pending = leaves.filter(l => l.status === 'Pending');
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date?.startsWith(todayStr) || new Date(a.date).toISOString().startsWith(todayStr));
  const todayPresent = todayAttendance.filter(a => a.status === 'Present').length;

  if (loading) return <div className="loading"><div className="spinner" />Loading admin dashboard...</div>;

  return (
    <div className="page">
      <div className="page-title">Admin Dashboard</div>
      <div className="page-subtitle">Overview of all employees, leaves & attendance</div>

      {/* Stats */}
      <div className="grid-4 mb-3">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div><div className="stat-value" style={{ color: 'var(--accent)' }}>{users.length}</div><div className="stat-label">Total Employees</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div><div className="stat-value" style={{ color: 'var(--warning)' }}>{pending.length}</div><div className="stat-label">Pending Leaves</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div><div className="stat-value" style={{ color: 'var(--success)' }}>{todayPresent}</div><div className="stat-label">Present Today</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div><div className="stat-value" style={{ color: 'var(--info)' }}>{leaves.length}</div><div className="stat-label">Total Leave Requests</div></div>
        </div>
      </div>

      {/* Pending Leaves */}
      <div className="card mb-3">
        <div className="flex-between mb-2">
          <div className="section-title" style={{ margin: 0 }}>⏳ Pending Leave Requests</div>
          <Link to="/admin/leaves" className="btn btn-ghost btn-sm">Manage All</Link>
        </div>
        {pending.length === 0 ? (
          <div className="empty-state"><div className="icon">🎉</div><p>No pending leave requests!</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Employee</th><th>Type</th><th>Start</th><th>End</th><th>Days</th><th>Status</th></tr></thead>
              <tbody>
                {pending.slice(0, 5).map(l => (
                  <tr key={l._id}>
                    <td style={{ fontWeight: 600 }}>{l.employee?.fullName}</td>
                    <td><span className={`badge badge-${l.leaveType.toLowerCase()}`}>{l.leaveType}</span></td>
                    <td>{new Date(l.startDate).toLocaleDateString('en-IN')}</td>
                    <td>{new Date(l.endDate).toLocaleDateString('en-IN')}</td>
                    <td style={{ fontFamily: 'var(--mono)' }}>{l.totalDays}</td>
                    <td><span className="badge badge-pending">Pending</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Employees */}
      <div className="card">
        <div className="flex-between mb-2">
          <div className="section-title" style={{ margin: 0 }}>👥 Employees</div>
          <Link to="/admin/employees" className="btn btn-ghost btn-sm">View All</Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Leave Balance</th><th>Joined</th></tr></thead>
            <tbody>
              {users.slice(0, 5).map(u => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 600 }}>{u.fullName}</td>
                  <td style={{ color: 'var(--text2)' }}>{u.email}</td>
                  <td>
                    <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: u.leaveBalance < 5 ? 'var(--danger)' : 'var(--success)' }}>
                      {u.leaveBalance} days
                    </span>
                  </td>
                  <td style={{ color: 'var(--text3)', fontSize: '0.8rem' }}>{new Date(u.dateOfJoining).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
