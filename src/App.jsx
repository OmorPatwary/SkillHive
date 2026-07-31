import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import ExploreMatches from './pages/ExploreMatches';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// নতুন যুক্ত হওয়া পেজসমূহ
import JobsFeed from './pages/JobsFeed';
import PostJob from './pages/PostJob';
import MyActivity from './pages/MyActivity';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
        <Navbar user={user} setUser={setUser} />

        <div className="container mt-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<ExploreMatches currentUserId={user?._id} />} />
            <Route path="/matches" element={<ExploreMatches currentUserId={user?._id} />} />
            <Route path="/jobs" element={<JobsFeed user={user} />} />
            <Route path="/post-job" element={<PostJob user={user} />} />
            <Route path="/activity" element={<MyActivity user={user} />} />
            <Route path="/bookings" element={<Bookings user={user} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;