import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Web3Provider, useWeb3 } from './context/Web3Context';
import LayoutUser from './components/user/LayoutUser';
import LayoutAdmin from './components/admin/LayoutAdmin';

// User Pages
import Home from './pages/Home';
import Books from './pages/Books';
import Register from './pages/Register';
import MyBorrow from './pages/MyBorrow';
import MyHistory from './pages/MyHistory';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminBooks from './pages/AdminBooks';
import AdminHistory from './pages/AdminHistory';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const { account, isAdmin, loading } = useWeb3();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!account) return <Navigate to="/" />;
  if (requireAdmin && !isAdmin) return <Navigate to="/books" />;

  return children;
};

function App() {
  return (
    <Web3Provider>
      <Router>
        <Routes>
          {/* Public / Landing */}
          <Route path="/" element={<Home />} />

          {/* User Routes (Light Theme) */}
          <Route
            path="/books"
            element={
              <LayoutUser>
                <Books />
              </LayoutUser>
            }
          />

          <Route
            path="/register"
            element={
              <ProtectedRoute>
                <LayoutUser>
                  <Register />
                </LayoutUser>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-borrow"
            element={
              <ProtectedRoute>
                <LayoutUser>
                  <MyBorrow />
                </LayoutUser>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-history"
            element={
              <ProtectedRoute>
                <LayoutUser>
                  <MyHistory />
                </LayoutUser>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes (Dark Theme) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <LayoutAdmin>
                  <AdminDashboard />
                </LayoutAdmin>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/books"
            element={
              <ProtectedRoute requireAdmin={true}>
                <LayoutAdmin>
                  <AdminBooks />
                </LayoutAdmin>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/history"
            element={
              <ProtectedRoute requireAdmin={true}>
                <LayoutAdmin>
                  <AdminHistory />
                </LayoutAdmin>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Web3Provider>
  );
}

export default App;
