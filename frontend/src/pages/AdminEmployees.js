import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAllUsers } from '../services/api';

const AdminEmployees = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllUsers()
      .then(res => setUsers(res.data.users))
      .catch(() => toast.error('Failed to load employees'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading"><div className="spinner" />Loading...</div>;

  return (
    <div className="page">
      <div className="page-title">Employees</div>
      <div className="page-subtitle">All registered employees in the system</div>

      <div className="grid-3 mb-3">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div><div className="stat-value" style={{ color: 'var(--accent)' }}>{users.length}</div><div className="stat-label">Total Employees</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏖️</div>
          <div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>
              {users.length > 0 ? Math.round(users.reduce((a, u) => a + u.leaveBalance, 0) / users.length) : 0}
            </div>
            <div className="stat-label">Avg Leave Balance</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div>
            <div className="stat-value" style={{ color: 'var(--warning)' }}>
              {users.filter(u => u.leaveBalance < 5).length}
            </div>
            <div className="stat-label">Low Balance (&lt;5 days)</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex-between mb-2">
          <div className="section-title" style={{ margin: 0 }}>Employee List</div>
          <input
            className="form-input"
            style={{ width: 240 }}
            placeholder="🔍 Search employees..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="icon">🔍</div><p>No employees found.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Name</th><th>Email</th><th>Leave Balance</th><th>Date Joined</th></tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u._id}>
                    <td style={{ color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '0.75rem', color: 'white', flexShrink: 0
                        }}>
                          {u.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600 }}>{u.fullName}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text2)' }}>{u.email}</td>
                    <td>
                      <span style={{
                        fontFamily: 'var(--mono)', fontWeight: 700,
                        color: u.leaveBalance < 5 ? 'var(--danger)' : u.leaveBalance < 10 ? 'var(--warning)' : 'var(--success)'
                      }}>
                        {u.leaveBalance} days
                      </span>
                    </td>
                    <td style={{ color: 'var(--text3)', fontSize: '0.8rem' }}>
                      {new Date(u.dateOfJoining).toLocaleDateString('en-IN')}
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

export default AdminEmployees;
