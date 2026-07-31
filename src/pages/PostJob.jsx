import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../api/apiServices';

const PostJob = ({ user }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      alert('You must be logged in to post a work!');
      return;
    }

    try {
      setLoading(true);
      const skillsArray = skills.split(',').map((s) => s.trim()).filter((s) => s);

      const payload = {
        postedBy: user._id,
        posterName: user.name,
        title,
        category,
        description,
        skillsRequired: skillsArray,
        budget: budget || 'Mentorship / Free',
        deadline,
      };

      const res = await createJob(payload);
      alert(res.data.message || 'Work posted successfully!');
      navigate('/jobs');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to post work');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h3 className="fw-bold text-dark mb-1">Post a Work Opportunity 🚀</h3>
            <p className="text-secondary small mb-4">
              Share tasks, freelancing projects, or departmental work for juniors to apply.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Job / Work Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Need a React & Tailwind portfolio website"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="App Development">App Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Problem Solving / C++">Problem Solving / C++</option>
                    <option value="Graphics & Content">Graphics & Content</option>
                    <option value="Other CS Projects">Other CS Projects</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Budget / Remuneration</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. ৳1500 or Mentorship/Treat"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. React.js, Tailwind CSS, Node.js"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Deadline</label>
                <input
                  type="date"
                  className="form-control"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Detailed Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Explain the requirements, deliverables, and how the junior should approach this work..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 fw-semibold rounded-pill py-2"
                style={{ backgroundColor: '#2563eb', borderColor: '#2563eb' }}
              >
                {loading ? 'Publishing Work...' : 'Publish Work Opportunity'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;