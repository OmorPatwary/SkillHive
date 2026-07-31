import React from 'react';
import SkillMatchCard from '../component/SkillMatchCard';

const ExploreMatches = () => {
  // ডামি ডাটা (ব্যাকএন্ড API কানেক্ট করা পর্যন্ত টেস্টের জন্য)
  const matchesData = [
    {
      _id: "1",
      name: "Sabbir Hossain",
      role: "Backend Dev",
      matchPercentage: 100,
      canTeach: ["Node.js", "Express", "MongoDB"],
      wantsToLearn: ["React.js", "Tailwind CSS"],
      bio: "Looking to level up my frontend design skills in exchange for Node/Express backend help."
    },
    {
      _id: "2",
      name: "Anika Rahman",
      role: "UI/UX Designer",
      matchPercentage: 85,
      canTeach: ["Figma", "UI Design"],
      wantsToLearn: ["HTML/CSS", "Bootstrap"],
      bio: "Passionate designer wanting to turn my Figma layouts into real code."
    }
  ];

  const handleBooking = (user) => {
    alert(`Request sent to ${user.name}!`);
  };

  return (
    <div className="container py-4">
      <h4 className="fw-bold text-dark mb-1">Recommended Matches</h4>
      <p className="text-secondary small mb-4">People who want to learn what you teach and vice versa.</p>
      
      <div className="row g-3">
        {matchesData.map((item) => (
          <div className="col-md-6 col-lg-4" key={item._id}>
            <SkillMatchCard match={item} onBook={handleBooking} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreMatches;