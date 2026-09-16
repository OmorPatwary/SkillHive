import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import socket from '../socket';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const { user, logout } = useContext(AuthContext);

  const userId = user?._id || user?.id;

  useEffect(() => {
    if (userId) {
      socket.emit('register_user', userId);

     const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `https://skillhive-74fi.onrender.com/api/notifications/${userId}`
        );

        const unreadCount = res.data.filter((n) => !n.isRead).length;
        setUnreadNotifications(unreadCount);
      } catch (err) {
        console.error('Error fetching unread notifications:', err);
      }
    };

      fetchNotifications();

      const handleNotification = () => {
        fetchNotifications();
      };

      socket.on('get_notification', handleNotification);

      return () => {
        socket.off('get_notification', handleNotification);
      };
    }
  }, [userId, location.pathname]);

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    setIsOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setIsOpen(false);

  const getProfilePicUrl = (pic) => {
    if (!pic) return '';

    if (pic.startsWith('http') || pic.startsWith('data:')) {
      return pic;
    }

    return `http://skillhive-74fi.onrender.com/${pic.replace(/^\//, '')}`;
  };

  const navLinkStyle = ({ isActive }) =>
    `small fw-semibold font-montserrat transition-all d-inline-flex align-items-center gap-1 text-decoration-none py-2 py-lg-0 ${
      isActive ? 'text-primary fw-bold' : 'text-secondary'
    }`;

  const mobileNavLinkStyle = ({ isActive }) =>
    `skillhive-mobile-link ${
      isActive ? 'skillhive-mobile-link-active' : ''
    }`;

  const mobilePostLinkStyle = ({ isActive }) =>
    `skillhive-mobile-post-btn ${
      isActive ? 'skillhive-mobile-post-btn-active' : ''
    }`;

  return (
    <>
      <nav
        className="navbar navbar-light bg-white shadow-sm sticky-top"
        style={{ borderBottom: '1px solid #e2e8f0', zIndex: 1100 }}
      >
        <div className="container py-1">
          <Link
            className="navbar-brand fw-bold fs-4 d-flex align-items-center font-montserrat text-decoration-none"
            to="/"
            onClick={closeMenu}
          >
            <span className="text-primary">Skill</span>
            <span style={{ color: '#0f172a' }}>Hive</span>
          </Link>

          <button
            className="navbar-toggler border-0 shadow-none d-lg-none"
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="skillhive-desktop-menu d-none d-lg-flex ms-auto">
            <div className="d-flex align-items-center gap-3">
              <NavLink
                to="/about"
                className={navLinkStyle}
              >
                <i className="fa-solid fa-circle-info"></i>
                About Us
              </NavLink>

              {user ? (
                <>
                  <NavLink
                    to="/matches"
                    className={navLinkStyle}
                  >
                    <i className="fa-solid fa-handshake"></i>
                    Matches
                  </NavLink>

                  <NavLink
                    to="/jobs"
                    className={navLinkStyle}
                  >
                    <i className="fa-solid fa-briefcase"></i>
                    Work Feed
                  </NavLink>

                  <NavLink
                    to="/post-job"
                    className="btn btn-outline-primary btn-sm rounded-pill fw-semibold font-montserrat d-inline-flex align-items-center justify-content-center gap-1"
                  >
                    <i className="fa-solid fa-circle-plus"></i>
                    Post Work
                  </NavLink>

                  <NavLink
                    to="/activity"
                    className={navLinkStyle}
                  >
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    My Activity
                  </NavLink>

                  <NavLink
                    to="/chat"
                    className={navLinkStyle}
                  >
                    <i className="fa-solid fa-comments"></i>
                    Messages
                  </NavLink>

                  <NavLink
                    to="/notifications"
                    className={navLinkStyle}
                  >
                    <div className="position-relative d-inline-flex align-items-center gap-1">
                      <i className="fa-solid fa-bell"></i>
                      <span>Notifications</span>

                      {unreadNotifications > 0 && (
                        <span className="badge rounded-pill bg-danger ms-1">
                          {unreadNotifications}
                        </span>
                      )}
                    </div>
                  </NavLink>

                  <NavLink
                    to="/profile"
                    className={navLinkStyle}
                  >
                    <i className="fa-solid fa-circle-user"></i>
                    Profile
                  </NavLink>

                  <div className="d-flex align-items-center gap-2">
                    {user?.profilePic ? (
                      <img
                        src={getProfilePicUrl(user.profilePic)}
                        alt={user.name || 'User'}
                        className="rounded-circle border border-primary"
                        style={{
                          width: '38px',
                          height: '38px',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-light border d-flex align-items-center justify-content-center"
                        style={{
                          width: '38px',
                          height: '38px',
                        }}
                      >
                        <i
                          className="fa-solid fa-user text-secondary"
                          style={{ fontSize: '14px' }}
                        ></i>
                      </div>
                    )}

                    <span
                      className="badge px-3 py-2 rounded-pill fw-medium font-montserrat d-inline-flex align-items-center justify-content-center gap-1"
                      style={{
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                      }}
                    >
                      Hi, {user?.name || 'User'}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger btn-sm rounded-pill px-3 font-montserrat d-inline-flex align-items-center justify-content-center gap-1"
                  >
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-medium font-montserrat d-inline-flex align-items-center justify-content-center gap-1"
                  >
                    <i className="fa-solid fa-right-to-bracket"></i>
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="btn btn-primary btn-sm rounded-pill px-3 fw-medium font-montserrat d-inline-flex align-items-center justify-content-center gap-1"
                  >
                    <i className="fa-solid fa-user-plus"></i>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div
          className="skillhive-mobile-overlay"
          onClick={closeMenu}
        ></div>
      )}

      <div
        className={`skillhive-mobile-drawer ${
          isOpen ? 'skillhive-drawer-open' : ''
        }`}
      >
        <div className="skillhive-drawer-header">
          <Link
            to="/"
            className="text-decoration-none fw-bold fs-4 font-montserrat"
            onClick={closeMenu}
          >
            <span className="text-primary">Skill</span>
            <span style={{ color: '#0f172a' }}>Hive</span>
          </Link>

          <button
            className="skillhive-close-btn"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="skillhive-mobile-links">
          <NavLink
            to="/about"
            className={mobileNavLinkStyle}
            onClick={closeMenu}
          >
            <i className="fa-solid fa-circle-info"></i>
            <span>About Us</span>
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/matches"
                className={mobileNavLinkStyle}
                onClick={closeMenu}
              >
                <i className="fa-solid fa-handshake"></i>
                <span>Matches</span>
              </NavLink>

              <NavLink
                to="/jobs"
                className={mobileNavLinkStyle}
                onClick={closeMenu}
              >
                <i className="fa-solid fa-briefcase"></i>
                <span>Work Feed</span>
              </NavLink>

              <NavLink
                to="/post-job"
                className={mobilePostLinkStyle}
                onClick={closeMenu}
              >
                <i className="fa-solid fa-circle-plus"></i>
                <span>Post Work</span>
              </NavLink>

              <NavLink
                to="/activity"
                className={mobileNavLinkStyle}
                onClick={closeMenu}
              >
                <i className="fa-solid fa-clock-rotate-left"></i>
                <span>My Activity</span>
              </NavLink>

              <NavLink
                to="/chat"
                className={mobileNavLinkStyle}
                onClick={closeMenu}
              >
                <i className="fa-solid fa-comments"></i>
                <span>Messages</span>
              </NavLink>

              <NavLink
                to="/notifications"
                className={mobileNavLinkStyle}
                onClick={closeMenu}
              >
                <div className="d-flex align-items-center gap-2 w-100">
                  <i className="fa-solid fa-bell"></i>
                  <span>Notifications</span>

                  {unreadNotifications > 0 && (
                    <span className="badge rounded-pill bg-danger ms-auto">
                      {unreadNotifications}
                    </span>
                  )}
                </div>
              </NavLink>

              <NavLink
                to="/profile"
                className={mobileNavLinkStyle}
                onClick={closeMenu}
              >
                <i className="fa-solid fa-circle-user"></i>
                <span>Profile</span>
              </NavLink>

              <div className="skillhive-mobile-user">
                {user?.profilePic ? (
                  <img
                    src={getProfilePicUrl(user.profilePic)}
                    alt={user.name || 'User'}
                    className="rounded-circle border border-primary"
                    style={{
                      width: '42px',
                      height: '42px',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-light border d-flex align-items-center justify-content-center"
                    style={{
                      width: '42px',
                      height: '42px',
                    }}
                  >
                    <i className="fa-solid fa-user text-secondary"></i>
                  </div>
                )}

                <div>
                  <small className="text-secondary d-block">
                    Welcome back
                  </small>

                  <strong>{user?.name || 'User'}</strong>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="skillhive-mobile-logout"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="skillhive-mobile-login"
                onClick={closeMenu}
              >
                <i className="fa-solid fa-right-to-bracket"></i>
                Login
              </Link>

              <Link
                to="/register"
                className="skillhive-mobile-signup"
                onClick={closeMenu}
              >
                <i className="fa-solid fa-user-plus"></i>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        .skillhive-mobile-drawer {
          position: fixed;
          top: 0;
          left: 0;
          width: 285px;
          max-width: 82%;
          height: 100vh;
          background: #ffffff;
          z-index: 1200;
          transform: translateX(-100%);
          transition: transform 0.3s ease-in-out;
          box-shadow: 5px 0 25px rgba(0, 0, 0, 0.12);
          overflow-y: auto;
        }

        .skillhive-drawer-open {
          transform: translateX(0);
        }

        .skillhive-mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          z-index: 1150;
        }

        .skillhive-drawer-header {
          height: 70px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e2e8f0;
        }

        .skillhive-close-btn {
          width: 38px;
          height: 38px;
          border: none;
          border-radius: 50%;
          background: #f1f5f9;
          color: #334155;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .skillhive-close-btn:hover {
          background: #e2e8f0;
        }

        .skillhive-mobile-links {
          padding: 18px 10px 30px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .skillhive-mobile-link {
          width: 100%;
          min-height: 44px;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .skillhive-mobile-link i {
          width: 20px;
          text-align: center;
          font-size: 15px;
        }

        .skillhive-mobile-link:hover {
          background: #f8fafc;
          color: #2563eb;
        }

        .skillhive-mobile-link-active {
          background: #dbeafe !important;
          color: #2563eb !important;
          font-weight: 700;
          box-shadow: inset 3px 0 0 #2563eb;
        }

        .skillhive-mobile-link-active i {
          color: #2563eb;
        }

        .skillhive-mobile-post-btn {
          width: 100%;
          min-height: 44px;
          padding: 12px 14px;
          border: 1px solid #2563eb !important;
          border-radius: 10px;
          color: #2563eb !important;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          margin: 7px 0;
          transition: all 0.2s ease;
        }

        .skillhive-mobile-post-btn:hover {
          background: #eff6ff !important;
        }

        .skillhive-mobile-post-btn-active {
          background: #dbeafe !important;
          color: #2563eb !important;
          border-color: #2563eb !important;
          font-weight: 700;
          box-shadow: inset 3px 0 0 #2563eb;
        }

        .skillhive-mobile-user {
          margin-top: 15px;
          padding: 15px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .skillhive-mobile-user strong {
          font-size: 14px;
          color: #0f172a;
        }

        .skillhive-mobile-logout {
          width: 100%;
          margin-top: 8px;
          padding: 12px;
          border: 1px solid #dc3545;
          background: white;
          color: #dc3545;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
        }

        .skillhive-mobile-logout:hover {
          background: #dc3545;
          color: white;
        }

        .skillhive-mobile-login {
          width: 100%;
          min-height: 44px;
          padding: 12px 14px;
          border: 1px solid #2563eb !important;
          border-radius: 10px;
          color: #2563eb !important;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
        }

        .skillhive-mobile-signup {
          width: 100%;
          min-height: 44px;
          padding: 12px 14px;
          background: #2563eb !important;
          color: white !important;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
        }

        @media (min-width: 992px) {
          .skillhive-mobile-drawer,
          .skillhive-mobile-overlay {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;