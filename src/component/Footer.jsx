import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-top py-4 mt-5">
      <div className="container">
        <div className="row align-items-center text-center text-md-start">
          <div className="col-md-6 mb-2 mb-md-0">
            <span className="fw-bold text-dark">Skill<span className="text-primary">Swap</span> ⚡</span>
            <span className="text-muted small ms-2">© 2026. Learn & Share Skills Freely.</span>
          </div>
          <div className="col-md-6 text-md-end">
            <Link to="/matches" className="text-secondary small text-decoration-none me-3">Explore</Link>
            <Link to="/bookings" className="text-secondary small text-decoration-none me-3">Bookings</Link>
            <Link to="/profile" className="text-secondary small text-decoration-none">Profile</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;