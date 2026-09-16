import React, { useState } from 'react';
import axios from 'axios';

const SkillMatchCard = ({ match, currentUser, isRequested = false }) => {
  const [requested, setRequested] = useState(isRequested);
  const [loading, setLoading] = useState(false);

  const {
    _id,
    name = "User Name",
    role = "Developer",
    avatar,
    profilePic,
    matchPercentage = 100,
    canTeach = [],
    teachSkill,
    skillsToOffer = [],
    wantsToLearn = [],
    learnSkill,
    skillsToLearn = [],
    bio,
    description = "Looking forward to sharing skills and learning together!"
  } = match || {};

  const userImage = avatar || profilePic;
  
  // Recipient ID সঠিকভাবে বের করার নিরাপদ লজিক
  const recipientId = 
    match?.userId?._id || 
    (typeof match?.userId === 'string' ? match?.userId : null) || 
    match?.postedBy?._id || 
    (typeof match?.postedBy === 'string' ? match?.postedBy : null) || 
    match?.user?._id || 
    (typeof match?.user === 'string' ? match?.user : null) || 
    _id;

  const senderId = currentUser?._id || currentUser?.id;

  const formattedCanTeach = Array.isArray(canTeach) && canTeach.length > 0 
    ? canTeach 
    : Array.isArray(skillsToOffer) && skillsToOffer.length > 0
    ? skillsToOffer
    : teachSkill 
    ? [teachSkill] 
    : [];

  const formattedWantsToLearn = Array.isArray(wantsToLearn) && wantsToLearn.length > 0 
    ? wantsToLearn 
    : Array.isArray(skillsToLearn) && skillsToLearn.length > 0
    ? skillsToLearn
    : learnSkill 
    ? [learnSkill] 
    : [];

  const userBio = bio || description;

  const handleRequest = async () => {
    if (requested || loading) return;

    if (!senderId) {
      alert('Please login to send swap request!');
      return;
    }

    if (!recipientId) {
      alert('Recipient information is missing!');
      return;
    }

    if (String(senderId) === String(recipientId)) {
      alert('You cannot send a swap request to yourself!');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('https://skillhive-74fi.onrender.com/api/notifications/swap-request', {
        senderId: senderId,
        recipientId: recipientId,
        senderName: currentUser?.name || 'A User'
      });

      if (res.data.success) {
        setRequested(true);
      } else {
        alert(res.data.message || 'Failed to send request.');
      }
    } catch (err) {
      console.error('Error sending swap request:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="card border-0 rounded-4 p-3 mb-3 bg-white h-100 d-flex flex-column justify-content-between"
      style={{ 
        border: '1px solid #e2e8f0', 
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)'
      }}
    >
      <div>
        <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
          <div className="d-flex align-items-center gap-2 me-auto" style={{ minWidth: 0 }}>
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-5 shadow-sm flex-shrink-0 overflow-hidden"
              style={{ width: '42px', height: '42px', backgroundColor: '#2563eb' }}
            >
              {userImage ? (
                <img src={userImage} alt={name} className="w-100 h-100 object-fit-cover" />
              ) : (
                name.charAt(0).toUpperCase()
              )}
            </div>
            
            <div className="text-truncate">
              <h6 className="fw-bold mb-0 text-dark fs-6 text-truncate">{name}</h6>
              <small className="text-secondary opacity-75 d-block text-truncate" style={{ fontSize: '0.8rem' }}>{role}</small>
            </div>
          </div>

          <span 
            className="badge px-2 py-1 rounded-pill fw-semibold flex-shrink-0"
            style={{ backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', fontSize: '0.75rem' }}
          >
            {matchPercentage}% Match
          </span>
        </div>

        {userBio && (
          <p className="small text-muted mb-3" style={{ fontSize: '0.85rem' }}>
            "{userBio}"
          </p>
        )}

        <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
          <div className="mb-2">
            <span className="small fw-semibold text-dark d-block mb-1" style={{ fontSize: '0.8rem' }}>⚡ Can Teach:</span>
            <div className="d-flex flex-wrap gap-1">
              {formattedCanTeach.map((skill, idx) => (
                <span key={idx} className="badge rounded-pill fw-medium" style={{ backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', fontSize: '0.75rem' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="small fw-semibold text-dark d-block mb-1" style={{ fontSize: '0.8rem' }}>🎯 Wants to Learn:</span>
            <div className="d-flex flex-wrap gap-1">
              {formattedWantsToLearn.map((skill, idx) => (
                <span key={idx} className="badge rounded-pill fw-medium" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', fontSize: '0.75rem' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center pt-2 border-top gap-2" style={{ borderColor: '#f1f5f9' }}>
        <span className="small text-muted fw-medium flex-shrink-0" style={{ fontSize: '0.78rem' }}>🔄 Free Swap</span>
        <button 
          onClick={handleRequest}
          disabled={requested || loading}
          className={`btn btn-sm rounded-pill px-3 fw-medium flex-shrink-0 ${requested ? 'btn-secondary' : 'btn-primary'}`}
          style={{ fontSize: '0.82rem' }}
        >
          {loading ? 'Sending...' : requested ? 'Pending' : 'Request Swap'}
        </button>
      </div>
    </div>
  );
};

export default SkillMatchCard;