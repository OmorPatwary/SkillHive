import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { applyForJob } from '../api/apiServices';

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const Home = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);

  // Apply Modal & Chat States
  const [selectedJob, setSelectedJob] = useState(null);
  const [portfolioLink, setPortfolioLink] = useState('');
  const [message, setMessage] = useState('');
  const [applying, setApplying] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://skillhive-74fi.onrender.com/api/jobs');
        setJobs(res.data.jobs || res.data || []);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoadingJobs(false);
      }
    };

    const fetchMatches = async () => {
      try {
        const res = await axios.get('http://skillhive-74fi.onrender.com/api/matches');
        setMatches(res.data.matches || res.data || []);
      } catch (err) {
        console.error('Error fetching matches:', err);
      } finally {
        setLoadingMatches(false);
      }
    };

    fetchJobs();
    fetchMatches();
  }, []);

  const handleStartChat = (posterId) => {
    if (!user?._id) {
      alert('Chatting start করার জন্য আগে Login করুন!');
      return navigate('/login');
    }
    if (user._id === posterId) {
      return alert('আপনি নিজের পোস্টেই মেসেজ দিতে পারবেন না!');
    }
    navigate('/chat', { state: { receiverId: posterId } });
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return alert('Please login to apply');

    try {
      setApplying(true);
      const payload = {
        applicantId: user._id,
        applicantName: user.name,
        applicantEmail: user.email,
        portfolioLink,
        message,
      };

      const res = await applyForJob(selectedJob._id, payload);
      alert(res.data.message || 'Application submitted successfully!');
      setSelectedJob(null);
      setPortfolioLink('');
      setMessage('');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="container py-4 font-montserrat">
      <div className="row g-4">
        
        {/* Skill Exchange Section */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 border-bottom pb-2 gap-2">
              <h5 className="fw-bold text-dark m-0 d-flex align-items-center gap-2">
                <i className="fa-solid fa-handshake text-primary"></i> Skill Exchange
              </h5>
              <Link to="/post-skill" className="btn btn-outline-primary btn-sm rounded-pill fw-semibold">
                <i className="fa-solid fa-plus me-1"></i> Share Skill
              </Link>
            </div>
            
            <p className="text-muted small mb-3">
              List of who wants to learn what and who is willing to teach:
            </p>

            {loadingMatches ? (
              <div className="text-center py-4 text-muted">
                <i className="fa-solid fa-spinner fa-spin me-2"></i> Loading exchanges...
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <p>No skill posts available yet.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {matches.slice(0, 4).map((item) => (
                  <div key={item._id} className="p-3 rounded-3 bg-light border">
                    <div className="d-flex flex-wrap align-items-center justify-content-between mb-2 gap-2">
                      <span className="fw-bold text-dark small d-flex align-items-center gap-2">
                        {/* ঠিক করা ইমেজ অংশ */}
                        <img 
                          src={item.profilePic || DEFAULT_AVATAR} 
                          alt={item.name || 'User'} 
                          className="rounded-circle border" 
                          style={{ width: '28px', height: '28px', objectFit: 'cover' }} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_AVATAR;
                          }}
                        />
                        {item.name || 'User'}
                      </span>
                      <span className={`badge ${item.postType === 'Wants to Teach' ? 'bg-info text-dark' : 'bg-warning text-dark'}`}>
                        {item.postType || 'Skill Post'}
                      </span>
                    </div>
                    <p className="small text-secondary mb-1">
                      <strong>Can Teach:</strong> {item.teachSkill || 'N/A'}
                    </p>
                    <p className="small text-secondary mb-0">
                      <strong>Wants to Learn:</strong> {item.learnSkill || 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 pt-2 border-top text-center">
              <Link to="/matches" className="btn btn-sm btn-outline-primary rounded-pill w-100 fw-semibold">
                Explore All Skill Matches <i className="fa-solid fa-arrow-right ms-1"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Work Opportunities Section */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 border-bottom pb-2 gap-2">
              <h5 className="fw-bold text-dark m-0 d-flex align-items-center gap-2">
                <i className="fa-solid fa-briefcase text-primary"></i> Work Opportunities
              </h5>
              <Link to="/post-job" className="btn btn-primary btn-sm rounded-pill fw-semibold">
                <i className="fa-solid fa-circle-plus me-1"></i> Post Work
              </Link>
            </div>

            {loadingJobs ? (
              <div className="text-center py-5 text-muted">
                <i className="fa-solid fa-spinner fa-spin me-2"></i> Loading work posts...
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-5">
                <i className="fa-solid fa-folder-open fs-1 text-muted mb-2"></i>
                <p className="text-secondary">No work posted yet!</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {jobs.map((job) => (
                  <div key={job._id} className="p-3 border rounded-3 bg-white">
                    <div className="d-flex flex-wrap align-items-center justify-content-between mb-1 gap-2">
                      <h6 className="fw-bold text-dark mb-0">{job.title}</h6>
                      <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                        {job.budget}
                      </span>
                    </div>

                    <div className="d-flex flex-wrap align-items-center gap-2 mb-2 text-muted small">
                      <span><i className="fa-solid fa-user me-1 fw-bold"></i>{job.posterName}</span>
                      <span>•</span>
                      <span><i className="fa-solid fa-tag me-1"></i>{job.category}</span>
                    </div>

                    <p className="text-secondary small mb-3">
                      {job.description?.length > 120 ? `${job.description.substring(0, 120)}...` : job.description}
                    </p>

                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 border-top pt-2">
                      <div className="d-flex flex-wrap gap-1">
                        {job.skillsRequired?.map((skill, sIdx) => (
                          <span key={sIdx} className="badge bg-light text-secondary border rounded-pill">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="d-flex gap-1">
                        <button
                          onClick={() => handleStartChat(job.postedBy)}
                          className="btn btn-outline-primary btn-sm rounded-pill px-2 fw-semibold"
                          style={{ fontSize: '0.75rem' }}
                          title="Chat with poster"
                        >
                          💬 Chat
                        </button>
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="btn btn-sm btn-primary rounded-pill px-3 fw-medium"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
      </div>

      {/* Apply Modal */}
      {selectedJob && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered px-2">
            <div className="modal-content rounded-4 border-0 p-2 p-sm-3">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold fs-6 fs-sm-5">Apply for: {selectedJob.title}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedJob(null)}></button>
              </div>
              <form onSubmit={handleApplySubmit}>
                <div className="modal-body py-3">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">GitHub / Portfolio Link</label>
                    <input
                      type="url"
                      className="form-control form-control-sm"
                      placeholder="https://github.com/yourusername"
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Short Note to Senior</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="3"
                      placeholder="Why are you suitable for this job? Mention your relevant experience..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light btn-sm rounded-pill px-3"
                    onClick={() => setSelectedJob(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={applying} className="btn btn-primary btn-sm rounded-pill px-4">
                    {applying ? 'Submitting...' : 'Send Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;