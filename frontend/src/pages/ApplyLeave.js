import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { applyLeave } from '../services/api';

const ApplyLeave = () => {
  const [form, setForm] = useState({ leaveType: 'Casual', startDate: '', endDate: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const totalDays = form.startDate && form.endDate
    ? Math.max(0, Math.floor((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24)) + 1)
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate) {
      toast.error('Please select start and end dates');
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      toast.error('End date must be after start date');
      return;
    }
    setLoading(true);
    try {
      await applyLeave(form);
      toast.success('Leave applied successfully!');
      navigate('/my-leaves');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply leave');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-title">Apply for Leave</div>
      <div className="page-subtitle">Submit a new leave request</div>

      <div style={{ maxWidth: 560 }}>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Leave Type</label>
              <select className="form-select" name="leaveType" value={form.leaveType} onChange={handleChange}>
                <option value="Casual">Casual Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Paid">Paid Leave</option>
              </select>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  className="form-input"
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  className="form-input"
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  min={form.startDate || new Date().toISOString().split('T')[0]}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {totalDays > 0 && (
              <div style={{
                background: 'rgba(108,99,255,0.08)',
                border: '1px solid rgba(108,99,255,0.2)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                color: 'var(--text)',
              }}>
                📆 Total Days: <strong style={{ color: 'var(--accent)' }}>{totalDays} day{totalDays > 1 ? 's' : ''}</strong>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Reason (Optional)</label>
              <textarea
                className="form-textarea"
                name="reason"
                placeholder="Briefly describe the reason for leave..."
                value={form.reason}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? <><div className="spinner" />Submitting...</> : '📝 Submit Leave Request'}
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => navigate('/my-leaves')}>
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Info box */}
        <div className="card mt-2" style={{ background: 'rgba(67,233,123,0.04)', borderColor: 'rgba(67,233,123,0.15)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--success)' }}>ℹ️ Leave Policy</strong><br />
            • Each employee starts with <strong>20 days</strong> leave balance per year.<br />
            • Approved leaves are automatically deducted from your balance.<br />
            • You can cancel or edit <strong>pending</strong> leave requests only.<br />
            • Requests are reviewed by the admin team.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
