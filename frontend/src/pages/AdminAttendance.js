import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAllAttendance, getAllUsers } from '../services/api';

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ employeeId: '', date: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.employeeId) params.employeeId = filters.employeeId;
      if (filters.date) params.date = filters.date;
      const [aRes, uRes] = await Promise.all([getAllAttendance(params), getAllUsers()]);
      setAttendance(aRes.data.attendance);
      setUsers(uRes.data.users);
    } catch {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchData();
  };

  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const absentCount = attendance.filter(a => a.status === 'Absent').length;

  return (
    <div className="page">
      <div className="page-title">Attendance Records</div>
      <div className="page-subtitle">Monitor attendance across all employees</div>

      {/* Summary */}
      <div className="grid-3 mb-3">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div><div className="stat-value" style={{ color: 'var(--accent)' }}>{attendance.length}</div><div className="stat-label">Total Records</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div><div className="stat-value" style={{ color: 'var(--success)' }}>{presentCount}</div><div className="stat-label">Present</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div><div className="stat-value" style={{ color: 'var(--danger)' }}>{absentCount}</div><div className="stat-label">Absent</div></div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-3">
        <div className="section-title">🔍 Filter Attendance</div>
        <form onSubmit={handleFilter} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0, flex: 1, minWidth: 200 }}>
            <label className="form-label">Employee</label>
            <select
              className="form-select"
              value={filters.employeeId}
              onChange={e => setFilters({ ...filters, employeeId: e.target.value })}
            >
              <option value="">All Employees</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.fullName}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0, flex: 1, minWidth: 180 }}>
            <label className="form-label">Date</label>
            <input
              className="form-input"
              type="date"
              value={filters.date}
              onChange={e => setFilters({ ...filters, date: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', paddingBottom: '1rem' }}>
            <button type="submit" className="btn btn-primary btn-sm">Apply</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setFilters({ employeeId: '', date: '' }); setTimeout(fetchData, 0); }}>
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="loading"><div className="spinner" />Loading...</div>
        ) : attendance.length === 0 ? (
          <div className="empty-state"><div className="icon">📭</div><p>No attendance records found.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Employee</th><th>Email</th><th>Date</th><th>Day</th><th>Status</th><th>Marked At</th></tr>
              </thead>
              <tbody>
                {attendance.map((a, i) => (
                  <tr key={a._id}>
                    <td style={{ color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{a.employee?.fullName}</td>
                    <td style={{ color: 'var(--text2)', fontSize: '0.8rem' }}>{a.employee?.email}</td>
                    <td>{new Date(a.date).toLocaleDateString('en-IN')}</td>
                    <td style={{ color: 'var(--text2)' }}>{new Date(a.date).toLocaleDateString('en-IN', { weekday: 'short' })}</td>
                    <td><span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span></td>
                    <td style={{ color: 'var(--text3)', fontSize: '0.8rem', fontFamily: 'var(--mono)' }}>
                      {new Date(a.markedAt || a.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAttendance;
