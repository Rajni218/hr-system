import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAllLeaves, reviewLeave } from '../services/api';

const AdminLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchLeaves = async () => {
    try {
      const res = await getAllLeaves();
      setLeaves(res.data.leaves);
    } catch {
      toast.error('Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleReview = async (id, status) => {
    setActionLoading(id + status);
    try {
      await reviewLeave(id, status);
      toast.success(`Leave ${status.toLowerCase()}!`);
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = filter === 'All' ? leaves : leaves.filter(l => l.status === filter);

  if (loading) return <div className="loading"><div className="spinner" />Loading...</div>;

  return (
    <div className="page">
      <div className="page-title">Leave Requests</div>
      <div className="page-subtitle">Review and manage all employee leave requests</div>

      {/* Summary counts */}
      <div className="grid-4 mb-3">
        {['All', 'Pending', 'Approved', 'Rejected'].map(s => {
          const count = s === 'All' ? leaves.length : leaves.filter(l => l.status === s).length;
          const colors = { All: 'var(--accent)', Pending: 'var(--warning)', Approved: 'var(--success)', Rejected: 'var(--danger)' };
          return (
            <div
              key={s}
              className="stat-card"
              onClick={() => setFilter(s)}
              style={{ cursor: 'pointer', borderColor: filter === s ? colors[s] : undefined }}
            >
              <div><div className="stat-value" style={{ color: colors[s] }}>{count}</div><div className="stat-label">{s}</div></div>
            </div>
          );
        })}
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="icon">📭</div><p>No {filter !== 'All' ? filter.toLowerCase() : ''} requests.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Employee</th><th>Type</th><th>Start</th><th>End</th><th>Days</th><th>Reason</th><th>Applied</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(l => (
                  <tr key={l._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{l.employee?.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{l.employee?.email}</div>
                    </td>
                    <td><span className={`badge badge-${l.leaveType.toLowerCase()}`}>{l.leaveType}</span></td>
                    <td>{new Date(l.startDate).toLocaleDateString('en-IN')}</td>
                    <td>{new Date(l.endDate).toLocaleDateString('en-IN')}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>{l.totalDays}</td>
                    <td style={{ color: 'var(--text2)', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.reason || '—'}</td>
                    <td style={{ color: 'var(--text3)', fontSize: '0.8rem' }}>{new Date(l.appliedDate).toLocaleDateString('en-IN')}</td>
                    <td><span className={`badge badge-${l.status.toLowerCase()}`}>{l.status}</span></td>
                    <td>
                      {l.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            className="btn btn-success btn-sm"
                            disabled={!!actionLoading}
                            onClick={() => handleReview(l._id, 'Approved')}
                          >
                            {actionLoading === l._id + 'Approved' ? '...' : '✅'}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            disabled={!!actionLoading}
                            onClick={() => handleReview(l._id, 'Rejected')}
                          >
                            {actionLoading === l._id + 'Rejected' ? '...' : '❌'}
                          </button>
                        </div>
                      )}
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

export default AdminLeaves;
