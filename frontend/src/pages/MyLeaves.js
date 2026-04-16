import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getMyLeaves, updateLeave, cancelLeave } from '../services/api';

const EditModal = ({ leave, onClose, onSave }) => {
  const [form, setForm] = useState({
    leaveType: leave.leaveType,
    startDate: leave.startDate?.split('T')[0],
    endDate: leave.endDate?.split('T')[0],
    reason: leave.reason || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateLeave(leave._id, form);
      toast.success('Leave updated!');
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">✏️ Edit Leave Request</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Leave Type</label>
            <select className="form-select" value={form.leaveType} onChange={e => setForm({ ...form, leaveType: e.target.value })}>
              <option value="Casual">Casual</option>
              <option value="Sick">Sick</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input className="form-input" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input className="form-input" type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Reason</label>
            <textarea className="form-textarea" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} rows={2} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editLeave, setEditLeave] = useState(null);
  const [filter, setFilter] = useState('All');

  const fetchLeaves = async () => {
    try {
      const res = await getMyLeaves();
      setLeaves(res.data.leaves);
    } catch {
      toast.error('Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this leave request?')) return;
    try {
      await cancelLeave(id);
      toast.success('Leave cancelled');
      setLeaves(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const filtered = filter === 'All' ? leaves : leaves.filter(l => l.status === filter);

  if (loading) return <div className="loading"><div className="spinner" />Loading...</div>;

  return (
    <div className="page">
      <div className="page-title">My Leaves</div>
      <div className="page-subtitle">All your leave requests</div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}
          >{s}</button>
        ))}
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <p>No {filter !== 'All' ? filter.toLowerCase() : ''} leave requests found.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Type</th><th>Start</th><th>End</th><th>Days</th><th>Reason</th><th>Status</th><th>Applied</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => (
                  <tr key={l._id}>
                    <td><span className={`badge badge-${l.leaveType.toLowerCase()}`}>{l.leaveType}</span></td>
                    <td>{new Date(l.startDate).toLocaleDateString('en-IN')}</td>
                    <td>{new Date(l.endDate).toLocaleDateString('en-IN')}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{l.totalDays}</td>
                    <td style={{ color: 'var(--text2)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.reason || '—'}</td>
                    <td><span className={`badge badge-${l.status.toLowerCase()}`}>{l.status}</span></td>
                    <td style={{ color: 'var(--text3)', fontSize: '0.8rem' }}>{new Date(l.appliedDate).toLocaleDateString('en-IN')}</td>
                    <td>
                      {l.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setEditLeave(l)}>✏️</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleCancel(l._id)}>🗑</button>
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

      {editLeave && (
        <EditModal leave={editLeave} onClose={() => setEditLeave(null)} onSave={fetchLeaves} />
      )}
    </div>
  );
};

export default MyLeaves;
