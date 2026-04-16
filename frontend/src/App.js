import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ApplyLeave from './pages/ApplyLeave';
import MyLeaves from './pages/MyLeaves';
import MyAttendance from './pages/MyAttendance';
import AdminLeaves from './pages/AdminLeaves';
import AdminAttendance from './pages/AdminAttendance';
import AdminEmployees from './pages/AdminEmployees';
import Layout from './components/Layout';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner" />Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner" />Loading...</div>;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

    {/* Employee routes */}
    <Route path="/dashboard" element={<ProtectedRoute><Layout><EmployeeDashboard /></Layout></ProtectedRoute>} />
    <Route path="/apply-leave" element={<ProtectedRoute><Layout><ApplyLeave /></Layout></ProtectedRoute>} />
    <Route path="/my-leaves" element={<ProtectedRoute><Layout><MyLeaves /></Layout></ProtectedRoute>} />
    <Route path="/my-attendance" element={<ProtectedRoute><Layout><MyAttendance /></Layout></ProtectedRoute>} />

    {/* Admin routes */}
    <Route path="/admin" element={<ProtectedRoute adminOnly><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
    <Route path="/admin/leaves" element={<ProtectedRoute adminOnly><Layout><AdminLeaves /></Layout></ProtectedRoute>} />
    <Route path="/admin/attendance" element={<ProtectedRoute adminOnly><Layout><AdminAttendance /></Layout></ProtectedRoute>} />
    <Route path="/admin/employees" element={<ProtectedRoute adminOnly><Layout><AdminEmployees /></Layout></ProtectedRoute>} />

    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a30',
            color: '#e8e8f0',
            border: '1px solid #2a2a45',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#43e97b', secondary: '#0f1a14' } },
          error: { iconTheme: { primary: '#ff4757', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
