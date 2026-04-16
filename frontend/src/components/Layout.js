import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EmployeeNav = () => (
  <div className="sidebar-nav">
    <div className="nav-section">
      <div className="nav-label">Main</div>
      <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <span className="icon">🏠</span> Dashboard
      </NavLink>
    </div>
    <div className="nav-section">
      <div className="nav-label">Leave</div>
      <NavLink to="/apply-leave" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <span className="icon">📝</span> Apply Leave
      </NavLink>
      <NavLink to="/my-leaves" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <span className="icon">📋</span> My Leaves
      </NavLink>
    </div>
    <div className="nav-section">
      <div className="nav-label">Attendance</div>
      <NavLink to="/my-attendance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <span className="icon">📅</span> My Attendance
      </NavLink>
    </div>
  </div>
);

const AdminNav = () => (
  <div className="sidebar-nav">
    <div className="nav-section">
      <div className="nav-label">Main</div>
      <NavLink to="/admin" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <span className="icon">📊</span> Dashboard
      </NavLink>
    </div>
    <div className="nav-section">
      <div className="nav-label">Management</div>
      <NavLink to="/admin/employees" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <span className="icon">👥</span> Employees
      </NavLink>
      <NavLink to="/admin/leaves" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <span className="icon">📋</span> Leave Requests
      </NavLink>
      <NavLink to="/admin/attendance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <span className="icon">📅</span> Attendance
      </NavLink>
    </div>
  </div>
);

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>HR System</h1>
        <p>Leave & Attendance</p>
      </div>
      {user?.role === 'admin' ? <AdminNav /> : <EmployeeNav />}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{initials}</div>
          <div>
            <div className="user-name">{user?.fullName}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </div>
    </aside>
  );
};

const Topbar = () => {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  return (
    <div className="topbar">
      <span className="topbar-title">Welcome back 👋</span>
      <span className="topbar-date">{today}</span>
    </div>
  );
};

const Layout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <div className="main-content">
      <Topbar />
      {children}
    </div>
  </div>
);

export default Layout;
