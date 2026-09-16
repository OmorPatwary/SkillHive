import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyActivities } from '../api/apiServices';

const MyActivity = ({ user }) => {
  const [postedJobs, setPostedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posted');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const res = await getMyActivities(user._id);
        setPostedJobs(res.data.postedJobs || []);
        setAppliedJobs(res.data.appliedJobs || []);
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center py-5 my-5 font-montserrat">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-secondary">Loading your activities...</p>
      </div>
    );
  }

  return (
    <div className="container py-3 py-md-4 font-montserrat">
      <h3 className="fw-bold text-dark mb-1 fs-4 fs-md-3">My Work Activity 📊</h3>
      <p className="text-secondary small mb-3 mb-md-4 opacity-75">
        Track your posted projects and application statuses.
      </p>

      {/* Tabs */}
      <ul className="nav nav-pills gap-2 mb-4">
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill fw-semibold border-0 ${
              activeTab === 'posted' ? 'active bg-primary' : 'bg-white text-dark shadow-sm'
            }`}
            style={{ fontSize: '0.85rem' }}
            onClick={() => setActiveTab('posted')}
          >
            My Posted Works ({postedJobs.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill fw-semibold border-0 ${
              activeTab === 'applied' ? 'active bg-primary' : 'bg-white text-dark shadow-sm'
            }`}
            style={{ fontSize: '0.85rem' }}
            onClick={() => setActiveTab('applied')}
          >
            My Applications ({appliedJobs.length})
          </button>
        </li>
      </ul>

      {/* Content */}
      {activeTab === 'posted' ? (
        <div>
          {postedJobs.length === 0 ? (
            <div className="bg-white p-4 rounded-4 shadow-sm text-center">
              <p className="text-muted mb-0 small">You have not posted any work opportunities yet.</p>
            </div>
          ) : (
            postedJobs.map((job) => (
              <div key={job._id} className="card border-0 shadow-sm rounded-4 p-3 p-md-4 mb-3 bg-white">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-2">
                  <h5 className="fw-bold mb-0 text-dark fs-6 fs-md-5">{job.title}</h5>
                  <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill" style={{ fontSize: '0.75rem' }}>
                    {job.budget}
                  </span>
                </div>
                <p className="small text-secondary mb-3 opacity-75">{job.description}</p>

                <hr className="my-2 text-muted opacity-25" />

                <h6 className="fw-bold text-primary mt-2 mb-3 fs-6">
                  Applicants ({job.applications?.length || 0}):
                </h6>
                {job.applications?.length === 0 ? (
                  <p className="small text-muted mb-0 fst-italic">No applicants yet.</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {job.applications?.map((app, i) => (
                      <div key={i} className="p-3 rounded-3 bg-light border border-0 shadow-2xs">
                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                          <h6 className="fw-bold mb-0 text-dark fs-6">{app.applicantName}</h6>
                          
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            {app.portfolioLink && (
                              <a
                                href={app.portfolioLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline-primary btn-sm rounded-pill"
                                style={{ fontSize: '0.75rem' }}
                              >
                                View Portfolio / GitHub
                              </a>
                            )}
                            <button
                              onClick={() => navigate('/chat', { state: { recipientId: app.applicantId || app.userId || app.applicant } })}
                              className="btn btn-primary btn-sm rounded-pill d-flex align-items-center gap-1"
                              style={{ fontSize: '0.75rem' }}
                            >
                              <i className="fa-solid fa-comments"></i> Chat
                            </button>
                          </div>
                        </div>
                        <p className="small text-secondary mb-0 mt-2 bg-white p-2 rounded border-start border-3 border-primary" style={{ fontSize: '0.82rem' }}>
                          "{app.message}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div>
          {appliedJobs.length === 0 ? (
            <div className="bg-white p-4 rounded-4 shadow-sm text-center">
              <p className="text-muted mb-0 small">You have not applied to any work opportunities yet.</p>
            </div>
          ) : (
            appliedJobs.map((job) => (
              <div key={job._id} className="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
                <div className="d-flex justify-content-between align-items-center gap-2">
                  <div>
                    <h5 className="fw-bold text-dark mb-1 fs-6 fs-md-5">{job.title}</h5>
                    <p className="small text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                      Posted by: <span className="fw-semibold text-dark">{job.posterName}</span>
                    </p>
                  </div>
                  <span className="badge bg-info-subtle text-info border border-info-subtle rounded-pill" style={{ fontSize: '0.75rem' }}>
                    Applied
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyActivity;