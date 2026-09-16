import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Notifications = ({ user, refreshUnreadCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = user?._id || user?.id;

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await axios.put(`http://localhost:5000/api/notifications/read/${notif._id}`);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
        if (refreshUnreadCount) refreshUnreadCount();
      } catch (err) {
        console.error('Error marking as read:', err);
      }
    }

    if (notif.type === 'message' || notif.type === 'swap_response') {
      if (notif.status === 'accepted') {
        navigate('/chat', { state: { receiverId: notif.sender?._id } });
      } else {
        navigate('/chat');
      }
    } else if (notif.type === 'application' || notif.type === 'job_post') {
      navigate('/activity');
    } else if (notif.type === 'swap_request' || notif.type === 'skill_post') {
      navigate('/notifications');
    } else if (notif.link) {
      navigate(notif.link);
    } else {
      navigate('/activity');
    }
  };

  const handleRespond = async (e, notifId, action, senderId) => {
    e.stopPropagation();
    try {
      const res = await axios.put(`http://localhost:5000/api/notifications/respond/${notifId}`, {
        status: action
      });

      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notifId ? { ...item, status: action, isRead: true } : item
          )
        );
        if (refreshUnreadCount) refreshUnreadCount();

        if (action === 'accepted' && senderId) {
          navigate('/chat', { state: { receiverId: senderId } });
        }
      }
    } catch (err) {
      console.error('Error responding to request:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/read-all/${userId}`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      if (refreshUnreadCount) refreshUnreadCount();
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const getProfilePicUrl = (pic) => {
    if (!pic) return '';
    if (pic.startsWith('http') || pic.startsWith('data:')) return pic;
    return `http://localhost:5000/${pic.replace(/^\//, '')}`;
  };

  if (loading) {
    return <div className="text-center py-5">Loading notifications...</div>;
  }

  return (
    <div className="container py-4" style={{ maxWidth: '800px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold font-montserrat mb-0">Notifications</h4>
        {notifications.some((n) => !n.isRead) && (
          <button
            className="btn btn-sm btn-outline-primary rounded-pill"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card border-0 shadow-sm p-4 text-center text-muted">
          No notifications found.
        </div>
      ) : (
        <div className="list-group shadow-sm rounded-3">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleNotificationClick(notif)}
              className={`list-group-item list-group-item-action p-3 d-flex align-items-center justify-content-between gap-3 border-0 border-bottom ${
                !notif.isRead ? 'bg-light fw-medium' : ''
              }`}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex align-items-center gap-3">
                {notif.sender?.profilePic ? (
                  <img
                    src={getProfilePicUrl(notif.sender.profilePic)}
                    alt="Sender"
                    className="rounded-circle"
                    style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                    style={{ width: '45px', height: '45px' }}
                  >
                    <i className="fa-solid fa-bell"></i>
                  </div>
                )}

                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h6 className="mb-0 fw-bold">{notif.title}</h6>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {new Date(notif.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </small>
                  </div>
                  <p className="mb-0 text-secondary small">{notif.message}</p>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                {notif.type === 'swap_request' && (
                  <div className="d-flex align-items-center gap-2">
                    {notif.status === 'pending' || !notif.status ? (
                      <>
                        <button
                          onClick={(e) => handleRespond(e, notif._id, 'accepted', notif.sender?._id)}
                          className="btn btn-sm btn-success rounded-pill px-3"
                        >
                          Accept
                        </button>
                        <button
                          onClick={(e) => handleRespond(e, notif._id, 'rejected', notif.sender?._id)}
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span
                        className={`badge rounded-pill px-3 py-2 ${
                          notif.status === 'accepted' ? 'bg-success' : 'bg-danger'
                        }`}
                      >
                        {notif.status === 'accepted' ? 'Accepted' : 'Rejected'}
                      </span>
                    )}
                  </div>
                )}

                {!notif.isRead && (
                  <span
                    className="bg-primary rounded-circle"
                    style={{ width: '10px', height: '10px' }}
                  ></span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;