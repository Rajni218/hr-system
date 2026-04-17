import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirm: ''
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ================= VALIDATION =================
    if (!form.fullName || !form.email || !form.password || !form.confirm) {
      toast.error('Please fill all fields');
      console.error("Validation Error: Missing fields", form);
      return;
    }

    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      console.error("Validation Error: Password mismatch");
      return;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      console.error("Validation Error: Password too short");
      return;
    }

    setLoading(true);

    try {
      console.log("Register Request Payload:", {
        fullName: form.fullName,
        email: form.email,
        password: form.password
      });

      // ================= API CALL =================
      const res = await registerUser({
        fullName: form.fullName,
        email: form.email,
        password: form.password
      });

      console.log("Register Success Response:", res.data);

      login(res.data.token, res.data.user);

      toast.success('Account created successfully!');
      navigate('/dashboard');

    } catch (err) {
      // ================= ERROR HANDLING =================
      console.error("❌ Registration Error Object:", err);
      console.error("❌ Backend Response:", err.response?.data);
      console.error("❌ Error Message:", err.message);

      toast.error(
        err.response?.data?.message ||
        err.message ||
        'Registration failed'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>HR System</h1>
          <p>Leave & Attendance Management</p>
        </div>

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-sub">Join as an employee</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              className="form-input"
              type="password"
              name="confirm"
              placeholder="Repeat password"
              value={form.confirm}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="auth-link" style={{ marginTop: '1rem' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
