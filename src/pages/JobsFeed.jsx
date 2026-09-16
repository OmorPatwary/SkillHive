import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 useNavigate Import করা হয়েছে
import { getAllJobs, applyForJob } from '../api/apiServices';

const JobsFeed = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [selectedJob, setSelectedJob] = useState(null);
  const [portfolioLink, setPortfolioLink] = useState('');
  const [message, setMessage] = useState('');
  const [applying, setApplying] = useState(false);

  const navigate = useNavigate(); // 👈 useNavigate Hook initialize

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await getAllJobs();
      setJobs(res.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = (posterId) => {
    if (!user?._id) {
      alert('Chating start করার জন্য আগে Login করুন!');
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
      fetchJobs();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skillsRequired?.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-secondary">Loading work opportunities...</p>
      </div>
    );
  }

  return (
    <div className="container py-3 py-md-4 font-montserrat">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3 mb-md-4">
        <div>
          <h2 className="fw-bold text-dark mb-1 fs-4 fs-md-2">Work Feed & Opportunities 💼</h2>
          <p className="text-secondary small mb-0 opacity-75">
            Real projects posted by seniors. Apply with your portfolio and get practical experience.
          </p>
        </div>
      </div>

      <div className="row g-2 g-md-3 mb-4">
        <div className="col-12 col-md-8">
          <input
            type="text"
            className="form-control form-control-md"
            placeholder="Search by work title or skills (e.g. React, C++, Figma)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-4">
          <select
            className="form-select form-select-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="App Development">App Development</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Problem Solving / C++">Problem Solving / C++</option>
            <option value="Graphics & Content">Graphics & Content</option>
          </select>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm p-3">
          <p className="text-muted mb-0">No work opportunities available matching your search.</p>
        </div>
      ) : (
        <div className="row g-3">
          {filteredJobs.map((job) => (
            <div key={job._id} className="col-12 col-sm-6 col-lg-4">
              <div className="card border-0 rounded-4 p-3 h-100 bg-white shadow-sm d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
                    <span
                      className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill text-truncate"
                      style={{ maxWidth: '70%', fontSize: '0.75rem' }}
                    >
                      {job.category}
                    </span>
                    <span className="fw-bold text-success small flex-shrink-0" style={{ fontSize: '0.85rem' }}>
                      {job.budget}
                    </span>
                  </div>

                  <h5 className="fw-bold text-dark mb-2 fs-6">{job.title}</h5>
                  <p className="small text-muted mb-3" style={{ fontSize: '0.8rem' }}>
                    Posted by: <strong>{job.posterName || 'Senior'}</strong>
                  </p>

                  <p
                    className="small text-secondary mb-3"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontSize: '0.85rem',
                    }}
                  >
                    {job.description}
                  </p>

                  <div className="mb-3">
                    <small className="fw-semibold text-dark d-block mb-1" style={{ fontSize: '0.8rem' }}>
                      Required Skills:
                    </small>
                    <div className="d-flex flex-wrap gap-1">
                      {job.skillsRequired?.map((skill, i) => (
                        <span
                          key={i}
                          className="badge bg-light text-dark border rounded-pill text-truncate"
                          style={{ fontSize: '0.75rem', maxWidth: '100%' }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 💬 Card Footer (Chat & Apply Buttons) */}
                <div className="pt-2 border-top d-flex justify-content-between align-items-center mt-3 gap-2">
                  <small className="text-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>
                    Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
                  </small>
                  
                  <div className="d-flex gap-1">
                    {/* 💬 Chat Button */}
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
                      className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold flex-shrink-0"
                      style={{ backgroundColor: '#2563eb', borderColor: '#2563eb', fontSize: '0.8rem' }}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

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

export default JobsFeed;