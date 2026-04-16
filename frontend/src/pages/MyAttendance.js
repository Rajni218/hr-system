import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getMyAttendance, markAttendance, getTodayAttendance } from '../services/api';

const MyAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayMarked, setTodayMarked] = useState(false);
  const [marking, setMarking] = useState(false);

  const fetchData = async () => {
    try {
      const [aRes, tRes] = await Promise.all([getMyAttendance(), getTodayAttendance()]);
      setAttendance(aRes.data.attendance);
      setTodayMarked(tRes.data.marked);
    } catch {
      toast.error('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleMark = async (status) => {
    setMarking(true);
    try {
      await markAttendance({ status });
      toast.success(`Marked ${status}!`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setMarking(false);
    }
  };

  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const absentCount = attendance.filter(a => a.status === 'Absent').length;
  const pct = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;

  if (loading) return <div className="loading"><div className="spinner" />Loading...</div>;

  return (
    <div className="page">
      <div className="page-title">My Attendance</div>
      <div className="page-subtitle">Your attendance history and daily marking</div>

      {/* Summary */}
      <div className="grid-3 mb-3">
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div><div className="stat-value" style={{ color: 'var(--success)' }}>{presentCount}</div><div className="stat-label">Days Present</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div><div className="stat-value" style={{ color: 'var(--danger)' }}>{absentCount}</div><div className="stat-label">Days Absent</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div><div className="stat-value" style={{ color: 'var(--accent)' }}>{pct}%</div><div className="stat-label">Attendance Rate</div></div>
        </div>
      </div>

      {/* Mark today */}
      <div className="card mb-3">
        <div className="section-title">📅 Mark Today's Attendance</div>
        {todayMarked ? (
          <p style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.875rem' }}>
            ✅ You've already marked attendance for today.
          </p>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-success" onClick={() => handleMark('Present')} disabled={marking}>✅ Present</button>
            <button className="btn btn-danger" onClick={() => handleMark('Absent')} disabled={marking}>❌ Absent</button>
          </div>
        )}
      </div>

      {/* History table */}
      <div className="card">
        <div className="section-title">History</div>
        {attendance.length === 0 ? (
          <div className="empty-state"><div className="icon">📭</div><p>No attendance records yet.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Date</th><th>Day</th><th>Status</th><th>Marked At</th></tr>
              </thead>
              <tbody>
                {attendance.map((a, i) => (
                  <tr key={a._id}>
                    <td style={{ color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{i + 1}</td>
                    <td>{new Date(a.date).toLocaleDateString('en-IN')}</td>
                    <td style={{ color: 'var(--text2)' }}>{new Date(a.date).toLocaleDateString('en-IN', { weekday: 'long' })}</td>
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

export default MyAttendance;
