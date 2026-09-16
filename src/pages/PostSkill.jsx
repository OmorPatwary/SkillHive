import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import socket from '../socket';

const PostSkill = ({ user: propsUser }) => {
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);
  const currentUser = propsUser || authContext?.user || {};

  const [formData, setFormData] = useState({
    postType: 'Wants to Learn',
    teachSkill: '',
    learnSkill: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: currentUser?.name || 'Anonymous User',
        profilePic: currentUser?.profilePic || currentUser?.avatar || '',
        postType: formData.postType,
        teachSkill: formData.teachSkill,
        learnSkill: formData.learnSkill,
        description: formData.description,
      };

      await axios.post('https://skillhive-74fi.onrender.com/api/matches', payload);

      // সোকেট ইভেন্ট ইমিট করা
      socket.emit('new_post_created', {
        type: 'skill_post',
        title: 'New Skill Exchange Post!',
        message: `${currentUser?.name || 'Someone'} posted a skill: ${formData.teachSkill || formData.learnSkill}`,
        link: '/matches',
      });

      alert('Skill post created successfully!');
      navigate('/matches');
    } catch (err) {
      console.error('Error posting skill:', err);
      alert('Failed to create skill post. Check server connection!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-3 py-md-5 font-montserrat" style={{ maxWidth: '600px' }}>
      <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 bg-white">
        <h4 className="fw-bold text-dark mb-1 fs-5 fs-md-4">Share or Request a Skill</h4>
        <p className="text-muted small mb-3 mb-md-4 opacity-75">
          Want to teach something to juniors or learn a new skill from seniors? Post it here!
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold small text-secondary">I want to:</label>
            <select
              className="form-select form-select-md rounded-3"
              name="postType"
              value={formData.postType}
              onChange={handleChange}
            >
              <option value="Wants to Learn">Learn a Skill</option>
              <option value="Wants to Teach">Teach a Skill</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small text-secondary">Skill You Can Teach / Know:</label>
            <input
              type="text"
              className="form-control form-control-md rounded-3"
              name="teachSkill"
              placeholder="e.g. C++, HTML/CSS, React Basics"
              value={formData.teachSkill}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small text-secondary">
              Skill You Want to Learn / Exchange For:
            </label>
            <input
              type="text"
              className="form-control form-control-md rounded-3"
              name="learnSkill"
              placeholder="e.g. Advanced React, Node.js, UI/UX Design"
              value={formData.learnSkill}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold small text-secondary">Details / Note:</label>
            <textarea
              className="form-control rounded-3"
              style={{ fontSize: '14px', lineHeight: '1.6' }}
              rows="3"
              name="description"
              placeholder="Write a brief note about what you are looking for..."
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary rounded-pill w-100 fw-semibold py-2"
            style={{ backgroundColor: '#2563eb', borderColor: '#2563eb' }}
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Publish Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostSkill;