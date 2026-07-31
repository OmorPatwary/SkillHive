import React, { useState, useEffect } from 'react';
import { getProfile, updateProfileData } from '../api/apiServices';

const Profile = ({ user }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skillsToOffer, setSkillsToOffer] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);

  const [offerInput, setOfferInput] = useState('');
  const [learnInput, setLearnInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ১. পেজ লোড হলে ব্যাকএন্ড থেকে প্রোফাইল ডাটা লোড করা
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const res = await getProfile(user._id);
        const profile = res.data.user || res.data;

        setName(profile.name || '');
        setBio(profile.bio || '');
        setSkillsToOffer(profile.skillsToOffer || []);
        setSkillsToLearn(profile.skillsToLearn || []);
      } catch (error) {
        console.error('Error loading profile:', error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // স্কিল হ্যান্ডলারসমূহ
  const handleAddOfferSkill = () => {
    if (offerInput.trim() && !skillsToOffer.includes(offerInput.trim())) {
      setSkillsToOffer([...skillsToOffer, offerInput.trim()]);
      setOfferInput('');
    }
  };

  const handleRemoveOfferSkill = (skill) => {
    setSkillsToOffer(skillsToOffer.filter(s => s !== skill));
  };

  const handleAddLearnSkill = () => {
    if (learnInput.trim() && !skillsToLearn.includes(learnInput.trim())) {
      setSkillsToLearn([...skillsToLearn, learnInput.trim()]);
      setLearnInput('');
    }
  };

  const handleRemoveLearnSkill = (skill) => {
    setSkillsToLearn(skillsToLearn.filter(s => s !== skill));
  };

  // ২. প্রোফাইল ডাটা সেভ/আপডেট করা
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?._id) return alert('User ID not found');

    try {
      setSaving(true);
      const updatedData = { name, bio, skillsToOffer, skillsToLearn };
      
      const res = await updateProfileData(user._id, updatedData);
      
      // LocalStorage-এ ইউজার ডাটা আপডেট করা
      const currentUserData = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...currentUserData, name }));

      alert(res.data.message || 'Profile updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-secondary">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-3 p-4">
            <h3 className="fw-bold mb-4 text-dark">My Profile Settings</h3>

            <form onSubmit={handleSaveProfile}>
              {/* ১. নাম ও বায়ো */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Short Bio</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell others what you do or love..."
                ></textarea>
              </div>

              <hr className="my-4 opacity-25" />

              {/* ২. যেসব স্কিল শেখাতে পারবেন */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-primary">Skills I Can Teach (Offer)</label>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. React.js, Tailwind CSS"
                    value={offerInput}
                    onChange={(e) => setOfferInput(e.target.value)}
                  />
                  <button type="button" onClick={handleAddOfferSkill} className="btn btn-primary">
                    Add Skill
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {skillsToOffer.map((skill, index) => (
                    <span key={index} className="badge bg-primary-subtle text-primary border border-primary-subtle p-2 fs-6 rounded-pill d-flex align-items-center gap-2">
                      {skill}
                      <button type="button" onClick={() => handleRemoveOfferSkill(skill)} className="btn-close btn-close-sm" aria-label="Remove"></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* ৩. যেসব স্কিল শিখতে চান */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-success">Skills I Want to Learn</label>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Python, Figma"
                    value={learnInput}
                    onChange={(e) => setLearnInput(e.target.value)}
                  />
                  <button type="button" onClick={handleAddLearnSkill} className="btn btn-success">
                    Add Skill
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {skillsToLearn.map((skill, index) => (
                    <span key={index} className="badge bg-success-subtle text-success border border-success-subtle p-2 fs-6 rounded-pill d-flex align-items-center gap-2">
                      {skill}
                      <button type="button" onClick={() => handleRemoveLearnSkill(skill)} className="btn-close btn-close-sm" aria-label="Remove"></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* সেভ বাটন */}
              <button type="submit" disabled={saving} className="btn btn-dark w-100 fw-semibold rounded-pill py-2 mt-2">
                {saving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;