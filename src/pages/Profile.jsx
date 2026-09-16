import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getProfile, updateProfileData } from '../api/apiServices';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skillsToOffer, setSkillsToOffer] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [profilePic, setProfilePic] = useState('');

  const [offerInput, setOfferInput] = useState('');
  const [learnInput, setLearnInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        setProfilePic(profile.profilePic || '');
      } catch (error) {
        console.error('Error loading profile:', error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?._id]);

  // ছবির সঠিক সোর্স বা URL নির্ধারণ করার হেলপার ফাংশন
  const getImageSrc = (pic) => {
    if (!pic) return '';
    if (pic.startsWith('data:') || pic.startsWith('http') || pic.startsWith('/')) {
      return pic;
    }
    return `/images/${pic}`;
  };

  // ছবি সেভ এবং ক্যানভাস দিয়ে সাইজ কমানোর (Compress) হ্যান্ডলার
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size is too large! Please choose an image under 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const scaleFactor = MAX_WIDTH / img.width;

          if (scaleFactor < 1) {
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleFactor;
          } else {
            canvas.width = img.width;
            canvas.height = img.height;
          }

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // কনভার্ট টু Base64
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          setProfilePic(compressedBase64);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // স্কিল হ্যান্ডলারসমূহ
  const handleAddOfferSkill = () => {
    if (offerInput.trim() && !skillsToOffer.includes(offerInput.trim())) {
      setSkillsToOffer([...skillsToOffer, offerInput.trim()]);
      setOfferInput('');
    }
  };

  const handleRemoveOfferSkill = (skill) => {
    setSkillsToOffer(skillsToOffer.filter((s) => s !== skill));
  };

  const handleAddLearnSkill = () => {
    if (learnInput.trim() && !skillsToLearn.includes(learnInput.trim())) {
      setSkillsToLearn([...skillsToLearn, learnInput.trim()]);
      setLearnInput('');
    }
  };

  const handleRemoveLearnSkill = (skill) => {
    setSkillsToLearn(skillsToLearn.filter((s) => s !== skill));
  };

  // প্রোফাইল সেভ/আপডেট করা
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?._id) return alert('User ID not found');

    try {
      setSaving(true);
      const updatedData = {
        name,
        bio,
        skillsToOffer,
        skillsToLearn,
        profilePic,
      };

      const res = await updateProfileData(user._id, updatedData);

      // ব্যাকএন্ড থেকে আপডেটেড ইউজার পাওয়া গেলে
      const updatedUserFromBackend = res.data?.user || res.data;

      // AuthContext & LocalStorage Sync
      if (updateUser) {
        updateUser(updatedUserFromBackend);
      } else {
        localStorage.setItem('user', JSON.stringify(updatedUserFromBackend));
      }

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 my-5 font-montserrat">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-secondary">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="container py-3 py-md-4 font-montserrat">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 bg-white">
            <h3 className="fw-bold mb-3 mb-md-4 text-dark fs-4 fs-md-3">My Profile Settings</h3>

            <form onSubmit={handleSaveProfile}>
              {/* প্রোফাইল পিকচার সেকশন */}
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  {profilePic ? (
                    <img
                      src={getImageSrc(profilePic)}
                      alt="Profile"
                      className="rounded-circle border border-2 border-primary shadow-sm"
                      style={{
                        width: '110px',
                        height: '110px',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      onError={() => setProfilePic('')}
                    />
                  ) : (
                    <div
                      className="rounded-circle border border-2 border-primary bg-light d-flex align-items-center justify-content-center shadow-sm"
                      style={{ width: '110px', height: '110px' }}
                    >
                      <svg width="55" height="55" fill="#9ca3af" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path
                          fillRule="evenodd"
                          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                        />
                      </svg>
                    </div>
                  )}

                  <label
                    htmlFor="profilePicInput"
                    className="btn btn-primary rounded-circle position-absolute bottom-0 end-0 shadow-sm d-flex align-items-center justify-content-center p-0"
                    style={{
                      width: '34px',
                      height: '34px',
                      cursor: 'pointer',
                      border: '2px solid white',
                    }}
                    title="Upload Photo"
                  >
                    <span style={{ fontSize: '13px' }}>✏️</span>
                  </label>
                  <input
                    type="file"
                    id="profilePicInput"
                    accept="image/*"
                    className="d-none"
                    onChange={handleImageChange}
                  />
                </div>
                <p className="small text-muted mt-2 mb-0" style={{ fontSize: '0.8rem' }}>
                  Click icon to upload profile picture (Max: 5MB)
                </p>
              </div>

              {/* নাম ও বায়ো */}
              <div className="mb-3">
                <label className="form-label fw-semibold small text-secondary">Full Name</label>
                <input
                  type="text"
                  className="form-control form-control-md rounded-3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small text-secondary">Short Bio</label>
                <textarea
                  className="form-control rounded-3"
                  style={{ fontSize: '14px', lineHeight: '1.6' }}
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell others what you do or love..."
                ></textarea>
              </div>

              <hr className="my-4 opacity-25" />

              {/* যেসব স্কিল শেখাতে পারবেন */}
              <div className="mb-4">
                <label className="form-label fw-semibold small text-primary">Skills I Can Teach (Offer)</label>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control form-control-md rounded-start-3"
                    placeholder="e.g. React.js, Tailwind CSS"
                    value={offerInput}
                    onChange={(e) => setOfferInput(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleAddOfferSkill}
                    className="btn btn-primary fw-semibold px-3"
                    style={{ backgroundColor: '#2563eb', borderColor: '#2563eb', fontSize: '0.85rem' }}
                  >
                    Add Skill
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {skillsToOffer.map((skill, index) => (
                    <span
                      key={index}
                      className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill d-flex align-items-center gap-2"
                      style={{ fontSize: '0.8rem' }}
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveOfferSkill(skill)}
                        className="btn-close btn-close-sm"
                        style={{ fontSize: '0.65rem' }}
                        aria-label="Remove"
                      ></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* যেসব স্কিল শিখতে চান */}
              <div className="mb-4">
                <label className="form-label fw-semibold small text-success">Skills I Want to Learn</label>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control form-control-md rounded-start-3"
                    placeholder="e.g. C++, Figma"
                    value={learnInput}
                    onChange={(e) => setLearnInput(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleAddLearnSkill}
                    className="btn btn-success fw-semibold px-3"
                    style={{ fontSize: '0.85rem' }}
                  >
                    Add Skill
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {skillsToLearn.map((skill, index) => (
                    <span
                      key={index}
                      className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill d-flex align-items-center gap-2"
                      style={{ fontSize: '0.8rem' }}
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveLearnSkill(skill)}
                        className="btn-close btn-close-sm"
                        style={{ fontSize: '0.65rem' }}
                        aria-label="Remove"
                      ></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* সেভ বাটন */}
              <button
                type="submit"
                disabled={saving}
                className="btn btn-dark w-100 fw-semibold rounded-pill py-2 mt-3"
                style={{ fontSize: '0.9rem' }}
              >
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