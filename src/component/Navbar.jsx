import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-white shadow-sm"
      style={{ borderBottom: '1px solid #e2e8f0' }}
    >
      <div className="container py-1">
        {/* Brand Logo */}
        <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center" to="/">
          <span className="text-primary">Skill</span>
          <span style={{ color: '#0f172a' }}>Hive</span>
        </Link>

        {/* Right Nav */}
        <div>
          {user ? (
            <div className="d-flex align-items-center gap-3">
              <Link to="/matches" className="text-secondary text-decoration-none small fw-semibold">
                Matches
              </Link>
              <Link to="/jobs" className="text-secondary text-decoration-none small fw-semibold">
                Work Feed
              </Link>
              <Link to="/post-job" className="btn btn-outline-primary btn-sm rounded-pill fw-semibold">
                + Post Work
              </Link>
              <Link to="/activity" className="text-secondary text-decoration-none small fw-semibold">
                My Activity
              </Link>
              <Link to="/profile" className="text-secondary text-decoration-none small fw-semibold">
                Profile
              </Link>

              <span
                className="badge px-3 py-2 rounded-pill fw-medium"
                style={{ backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}
              >
                Hi, {user.name}
              </span>

              <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-3">
                Logout
              </button>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-medium">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm rounded-pill px-3 fw-medium">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;