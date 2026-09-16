import React, { useState, useEffect } from 'react';
import { getBookings, acceptBooking, rejectBooking } from '../api/apiServices';

const Bookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meetInput, setMeetInput] = useState({});

  // ১. ব্যাকএন্ড থেকে ইউজারের সব সেশন ও বুকিং রিকোয়েস্ট লোড করা
  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const res = await getBookings(user._id);
        setBookings(res.data.bookings || []);
      } catch (error) {
        console.error('Error loading bookings:', error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [user]);

  const handleInputChange = (id, value) => {
    setMeetInput({ ...meetInput, [id]: value });
  };

  // ২. সেশন Accept করে Google Meet Link ব্যাকএন্ডে পাঠানো
  const handleAccept = async (bookingId) => {
    const link = meetInput[bookingId];
    if (!link) {
      alert('দয়া করে Google Meet লিংকটি প্রবেশ করান!');
      return;
    }

    try {
      const res = await acceptBooking(bookingId, link);
      alert(res.data.message || 'Session accepted successfully!');
      
      // লোকাল স্টেটে বুকিং আপডেট করা
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: 'ACCEPTED', meetLink: link } : b));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to accept booking');
    }
  };

  // ৩. সেশন Reject করা
  const handleReject = async (bookingId) => {
    try {
      const res = await rejectBooking(bookingId);
      alert(res.data.message || 'Session rejected!');
      
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: 'REJECTED' } : b));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reject booking');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 my-5 font-montserrat">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-secondary">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="container py-3 py-md-4 font-montserrat">
      <h3 className="fw-bold mb-1 text-dark fs-4 fs-md-3">My Bookings & Sessions</h3>
      <p className="text-secondary small mb-3 mb-md-4 opacity-75">
        আপনার আগামীর সব সেশন এবং পেন্ডিং রিকোয়েস্টগুলো এখান থেকে ম্যানেজ করুন।
      </p>

      {bookings.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm p-3">
          <p className="text-muted mb-0">No bookings or requests found yet.</p>
        </div>
      ) : (
        <div className="row g-3">
          {bookings.map((booking) => {
            const isProvider = booking.provider._id === user?._id;
            const partner = isProvider ? booking.requester : booking.provider;

            return (
              <div key={booking._id} className="col-12">
                <div className="card border-0 shadow-sm rounded-4 p-2 p-md-3 bg-white">
                  <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3">
                    <div>
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                        <h5 className="fw-bold mb-0 text-dark fs-6 fs-md-5">{partner?.name || 'User'}</h5>
                        <span className={`badge ${booking.bookingType === 'FREE_SWAP' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-primary-subtle text-primary border border-primary-subtle'} rounded-pill`} style={{ fontSize: '0.75rem' }}>
                          {booking.bookingType === 'FREE_SWAP' ? '⚡ Free Swap' : '🎓 Paid Mentorship'}
                        </span>
                        <span className={`badge ${booking.status === 'ACCEPTED' ? 'bg-success' : booking.status === 'PENDING' ? 'bg-warning text-dark' : 'bg-danger'} rounded-pill`} style={{ fontSize: '0.75rem' }}>
                          {booking.status}
                        </span>
                      </div>

                      <p className="mb-1 text-secondary small" style={{ fontSize: '0.85rem' }}>
                        <strong>Role:</strong> {isProvider ? 'You are Teaching' : 'You are Learning'}
                      </p>
                      <p className="mb-0 text-muted small" style={{ fontSize: '0.8rem' }}>
                        <strong>Requested At:</strong> {new Date(booking.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* অ্যাকশন বাটন সেকশন */}
                    <div className="d-flex flex-column gap-2" style={{ minWidth: '220px' }}>
                      {booking.status === 'PENDING' && isProvider && (
                        <div className="d-flex flex-column gap-2">
                          <input
                            type="url"
                            className="form-control form-control-sm"
                            placeholder="Paste Google Meet Link"
                            value={meetInput[booking._id] || ''}
                            onChange={(e) => handleInputChange(booking._id, e.target.value)}
                          />
                          <div className="d-flex gap-2">
                            <button 
                              onClick={() => handleAccept(booking._id)} 
                              className="btn btn-success btn-sm w-100 fw-semibold rounded-pill"
                              style={{ fontSize: '0.82rem' }}
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => handleReject(booking._id)} 
                              className="btn btn-outline-danger btn-sm w-100 rounded-pill"
                              style={{ fontSize: '0.82rem' }}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      )}

                      {booking.status === 'ACCEPTED' && booking.meetLink && (
                        <a 
                          href={booking.meetLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-primary btn-sm fw-semibold rounded-pill px-3 text-center"
                          style={{ backgroundColor: '#2563eb', borderColor: '#2563eb', fontSize: '0.85rem' }}
                        >
                          Join Google Meet 🚀
                        </a>
                      )}

                      {booking.status === 'PENDING' && !isProvider && (
                        <span className="text-muted small fst-italic text-md-end">Waiting for provider approval...</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookings;