import React, { useState, useEffect } from 'react';
import { getMyActivities } from '../api/apiServices';

const MyActivity = ({ user }) => {
  const [postedJobs, setPostedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posted');

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
      <div className="text-center py-5 my-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-secondary">Loading your activities...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-dark mb-1">My Work Activity 📊</h2>
      <p className="text-secondary small mb-4">Track your posted projects and application statuses.</p>

      {/* Tabs */}
      <ul className="nav nav-pills mb-4">
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill fw-semibold me-2 ${activeTab === 'posted' ? 'active' : 'bg-white text-dark'}`}
            onClick={() => setActiveTab('posted')}
          >
            My Posted Works ({postedJobs.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill fw-semibold ${activeTab === 'applied' ? 'active' : 'bg-white text-dark'}`}
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
            <p className="text-muted bg-white p-4 rounded-3">You have not posted any work opportunities yet.</p>
          ) : (
            postedJobs.map((job) => (
              <div key={job._id} className="card border-0 shadow-sm rounded-4 p-4 mb-3 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="fw-bold mb-0 text-dark">{job.title}</h5>
                  <span className="badge bg-success-subtle text-success">{job.budget}</span>
                </div>
                <p className="small text-secondary mb-3">{job.description}</p>

                <h6 className="fw-bold text-primary mt-3 mb-2">Applicants ({job.applications?.length || 0}):</h6>
                {job.applications?.length === 0 ? (
                  <p className="small text-muted mb-0">No applicants yet.</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {job.applications?.map((app, i) => (
                      <div key={i} className="p-3 rounded-3 bg-light border">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="fw-bold mb-0">{app.applicantName}</h6>
                          <a href={app.portfolioLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm rounded-pill">
                            View Portfolio / GitHub
                          </a>
                        </div>
                        <p className="small text-muted mb-0 mt-1">"{app.message}"</p>
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
            <p className="text-muted bg-white p-4 rounded-3">You have not applied to any work opportunities yet.</p>
          ) : (
            appliedJobs.map((job) => (
              <div key={job._id} className="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="fw-bold text-dark mb-1">{job.title}</h5>
                    <p className="small text-muted mb-0">Posted by: {job.posterName}</p>
                  </div>
                  <span className="badge bg-info-subtle text-info border border-info-subtle rounded-pill">
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