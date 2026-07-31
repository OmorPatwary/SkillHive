import React, { useState, useEffect } from 'react';
import { getAllJobs, applyForJob } from '../api/apiServices';

const JobsFeed = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Application Modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [portfolioLink, setPortfolioLink] = useState('');
  const [message, setMessage] = useState('');
  const [applying, setApplying] = useState(false);

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
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Work Feed & Opportunities 💼</h2>
          <p className="text-secondary small mb-0">
            Real projects posted by seniors. Apply with your portfolio and get practical experience.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search by work title or skills (e.g. React, C++, Figma)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
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

      {/* Job Cards */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <p className="text-muted mb-0">No work opportunities available matching your search.</p>
        </div>
      ) : (
        <div className="row g-3">
          {filteredJobs.map((job) => (
            <div key={job._id} className="col-md-6 col-lg-4">
              <div className="card border-0 rounded-4 p-3 h-100 bg-white shadow-sm d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">
                      {job.category}
                    </span>
                    <span className="fw-bold text-success small">{job.budget}</span>
                  </div>

                  <h5 className="fw-bold text-dark mb-2">{job.title}</h5>
                  <p className="small text-muted mb-3" style={{ fontSize: '0.85rem' }}>
                    Posted by: <strong>{job.posterName || 'Senior'}</strong>
                  </p>

                  <p className="small text-secondary mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {job.description}
                  </p>

                  <div className="mb-3">
                    <small className="fw-semibold text-dark d-block mb-1">Required Skills:</small>
                    <div className="d-flex flex-wrap gap-1">
                      {job.skillsRequired?.map((skill, i) => (
                        <span key={i} className="badge bg-light text-dark border rounded-pill">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-top d-flex justify-content-between align-items-center mt-3">
                  <small className="text-muted">Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</small>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold"
                    style={{ backgroundColor: '#2563eb', borderColor: '#2563eb' }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Modal */}
      {selectedJob && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-3">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Apply for: {selectedJob.title}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedJob(null)}></button>
              </div>
              <form onSubmit={handleApplySubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">GitHub / Portfolio Link</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://github.com/yourusername"
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Short Note to Senior</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Why are you suitable for this job? Mention your relevant experience..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light rounded-pill" onClick={() => setSelectedJob(null)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={applying} className="btn btn-primary rounded-pill px-4">
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