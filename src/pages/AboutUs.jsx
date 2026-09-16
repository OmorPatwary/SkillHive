import React from 'react';
const AboutUs = () => {
  const founder = {
    name: 'Omor Patwary',
    role: 'Founder & Lead Developer',
    skills: ['React.js', 'Node.js', 'Full-Stack Web', 'UI/UX'],
    image: '/images/omor1.png', 
    bio: 'Passionate about connecting learners and mentors to build a collaborative skill-sharing ecosystem.',
  };

  const friends = [
    {
      name: 'Arif Rahman',
      role: 'Co-Founder / UI/UX Designer',
      skills: ['Figma', 'Tailwind CSS', 'UI Design'],
      image: '/images/arif.png',
      bio: 'Focuses on creating seamless, intuitive, and modern user experiences.',
    },
    {
      name: 'Hemal',
      role: 'Frontend Developer',
      skills: ['JavaScript', 'React.js', 'Bootstrap'],
      image: '/images/hemal.jpg',
      bio: 'Enthusiastic developer committed to crafting clean and responsive UI components.',
    },
    {
      name: 'Jihan',
      role: 'Backend Developer / QA',
      skills: ['Node.js', 'MongoDB', 'API Testing'],
      image: '/images/jihan.png',
      bio: 'Dedicated to ensuring backend scalability and system reliability.',
    },
  ];

  const getFallbackImage = (name, size = 130) => {
    return `https://placehold.co/${size}x${size}/2563eb/FFF?text=${encodeURIComponent(name)}`;
  };

  return (
    <div className="font-montserrat py-4 py-md-5">
      <div className="text-center mb-5">
        <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
          Who We Are
        </span>
        <h1 className="fw-bold text-dark fs-2 fs-md-1">About SkillHive</h1>
        <p
          className="text-secondary mx-auto mt-3 col-12 col-md-8 col-lg-6"
          style={{ fontSize: '1.05rem', lineHeight: '1.7' }}
        >
          SkillHive is a peer-to-peer skill swap and mentorship platform designed to connect passionate learners with skilled mentors. Our mission is to democratize education by enabling people to exchange skills freely or offer paid guidance.
        </p>
      </div>

      <hr className="my-5 opacity-25" />

      {/* Team Section */}
      <div className="mb-4">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark fs-3">Meet the Team Behind SkillHive</h2>
          <p className="text-muted small">The passionate minds driving innovation and community learning.</p>
        </div>

        {/* Founder */}
        <div className="row justify-content-center mb-5">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center border-top border-4 border-primary position-relative bg-white">
              <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-primary px-3 py-2 shadow-sm fs-6">
                ⭐ Founder
              </span>

              <div className="mt-3 mb-3 d-flex justify-content-center">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="rounded-circle border border-3 border-light shadow object-fit-cover"
                  style={{ width: '130px', height: '130px' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getFallbackImage(founder.name, 130);
                  }}
                />
              </div>

              <h3 className="fw-bold text-dark fs-4 mb-1">{founder.name}</h3>
              <p className="text-primary fw-semibold small mb-2">{founder.role}</p>
              <p className="text-secondary small mb-3 mx-auto" style={{ fontSize: '0.9rem', maxWidth: '450px' }}>
                {founder.bio}
              </p>

              <div className="d-flex flex-wrap justify-content-center gap-1 mt-2">
                {founder.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded-pill small"
                    style={{ fontSize: '0.78rem' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="row g-4 justify-content-center">
          {friends.map((member, index) => (
            <div key={index} className="col-12 col-md-4 d-flex align-items-stretch">
              <div className="card border-0 shadow-sm rounded-4 p-4 text-center w-100 bg-white d-flex flex-column justify-content-between">
                <div>
                  <div className="mb-3 d-flex justify-content-center">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="rounded-circle border border-2 border-light shadow-sm object-fit-cover"
                      style={{ width: '110px', height: '110px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getFallbackImage(member.name, 110);
                      }}
                    />
                  </div>

                  <h4 className="fw-bold text-dark fs-5 mb-1">{member.name}</h4>
                  <p className="text-primary fw-medium small mb-2">{member.role}</p>
                  <p className="text-secondary small mb-3" style={{ fontSize: '0.85rem' }}>
                    {member.bio}
                  </p>
                </div>

                <div className="d-flex flex-wrap justify-content-center gap-1 mt-auto">
                  {member.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="badge bg-light text-dark border px-2 py-1 rounded-pill small"
                      style={{ fontSize: '0.75rem' }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;