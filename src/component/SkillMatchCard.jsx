import React from 'react';

const SkillMatchCard = ({ match, onBook }) => {
  // Props Destructuring with Fallbacks
  const {
    _id,
    name = "User Name",
    role = "Developer",
    avatar,
    matchPercentage = 100,
    canTeach = [],
    wantsToLearn = [],
    bio = "Looking forward to sharing skills and learning together!"
  } = match || {};

  return (
    <div 
      className="card border-0 rounded-4 p-3 mb-3 bg-white h-100"
      style={{ 
        border: '1px solid #e2e8f0', 
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      {/* Card Header: Avatar, Name & Match Badge */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-3">
          {/* Profile Image / Initials Avatar */}
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-5 shadow-sm"
            style={{ 
              width: '48px', 
              height: '48px', 
              backgroundColor: '#2563eb',
              flexShrink: 0 
            }}
          >
            {avatar ? (
              <img src={avatar} alt={name} className="rounded-circle w-100 h-100 object-fit-cover" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
          
          <div>
            <h6 className="fw-bold mb-0 text-dark fs-6">{name}</h6>
            <small className="text-secondary opacity-75">{role}</small>
          </div>
        </div>

        {/* 100% Match Badge */}
        <span 
          className="badge px-3 py-2 rounded-pill fw-semibold small"
          style={{ 
            backgroundColor: '#ecfdf5', 
            color: '#059669', 
            border: '1px solid #a7f3d0' 
          }}
        >
          {matchPercentage}% Match
        </span>
      </div>

      {/* Bio / Tagline */}
      {bio && (
        <p className="small text-muted mb-3 fs-7" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          "{bio}"
        </p>
      )}

      {/* Skill Swap Box */}
      <div 
        className="p-3 rounded-3 mb-3 flex-grow-1" 
        style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}
      >
        {/* Can Teach Section */}
        <div className="mb-2">
          <span className="small fw-semibold text-dark d-block mb-1">
            ⚡ Can Teach:
          </span>
          <div className="d-flex flex-wrap gap-1">
            {canTeach.length > 0 ? (
              canTeach.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="badge rounded-pill fw-medium small"
                  style={{ backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="small text-muted fs-7">Not specified</span>
            )}
          </div>
        </div>

        {/* Wants to Learn Section */}
        <div>
          <span className="small fw-semibold text-dark d-block mb-1">
            🎯 Wants to Learn:
          </span>
          <div className="d-flex flex-wrap gap-1">
            {wantsToLearn.length > 0 ? (
              wantsToLearn.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="badge rounded-pill fw-medium small"
                  style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="small text-muted fs-7">Not specified</span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="d-flex justify-content-between align-items-center pt-1 border-top" style={{ borderColor: '#f1f5f9' }}>
        <span className="small text-muted fw-medium" style={{ fontSize: '0.8rem' }}>
          🔄 Free Swap
        </span>
        <button 
          onClick={() => onBook && onBook(match)}
          className="btn btn-primary btn-sm rounded-pill px-4 fw-medium"
          style={{ backgroundColor: '#2563eb', borderColor: '#2563eb' }}
        >
          Request Swap
        </button>
      </div>
    </div>
  );
};

export default SkillMatchCard;