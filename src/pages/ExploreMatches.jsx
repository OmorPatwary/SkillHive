import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SkillMatchCard from '../component/SkillMatchCard';

const ExploreMatches = ({ user, currentUserId }) => {
  const [matchesData, setMatchesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const activeUserId = user?._id || user?.id || currentUserId;

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get('https://skillhive-74fi.onrender.com/api/matches');
        setMatchesData(res.data.matches || res.data || []);
      } catch (err) {
        console.error('Error loading matches page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleBooking = (user) => {
    alert(`Request sent to ${user.name || 'User'}!`);
  };

  const handleStartChat = (authorId) => {
    if (!activeUserId) {
      alert('Chating start করার জন্য আগে Login করুন!');
      return navigate('/login');
    }
    if (activeUserId === authorId) {
      return alert('আপনি নিজের পোস্টেই মেসেজ দিতে পারবেন না!');
    }
    navigate('/chat', { state: { receiverId: authorId } });
  };

  return (
    <div className="container py-3 py-md-4 font-montserrat">
      <div className="mb-3 mb-md-4">
        <h4 className="fw-bold text-dark mb-1 fs-5 fs-md-4">Recommended Skill Matches</h4>
        <p className="text-secondary small mb-0 opacity-75">
          People who want to learn what you teach and vice versa.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted">
          <i className="fa-solid fa-spinner fa-spin fs-4 me-2"></i> Fetching skill posts...
        </div>
      ) : matchesData.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <i className="fa-solid fa-handshake-slash fs-1 text-muted mb-3"></i>
          <p className="text-secondary fw-semibold">No skill posts available in Match section yet!</p>
        </div>
      ) : (
        <div className="row g-3">
          {matchesData.map((item) => (
            <div className="col-12 col-sm-6 col-lg-4" key={item._id}>
              <SkillMatchCard 
                match={item} 
                currentUser={user || { _id: activeUserId }}
                onBook={handleBooking} 
                onChat={() => handleStartChat(item.userId?._id || item.userId || item.postedBy || item.user)} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreMatches;