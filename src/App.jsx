import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import Navbar from './component/Navbar';
import Footer from './component/Footer';
import ExploreMatches from './pages/ExploreMatches';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import PostSkill from './pages/PostSkill';
import Chat from './pages/Chat';
import JobsFeed from './pages/JobsFeed';
import PostJob from './pages/PostJob';
import MyActivity from './pages/MyActivity';
import AboutUs from './pages/AboutUs';
import Notifications from './pages/Notifications'; // New Import

function App() {
  const { user, setUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div
        className="d-flex flex-column min-vh-100"
        style={{ backgroundColor: '#f8fafc' }}
      >
        <Navbar user={user} setUser={setUser} />

        <div className="container mt-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<Home user={user} />} />

            <Route path="/about" element={<AboutUs />} />

            <Route
              path="/matches"
              element={
                <ExploreMatches currentUserId={user?._id || user?.id} />
              }
            />

            <Route
              path="/jobs"
              element={<JobsFeed user={user} />}
            />

            <Route
              path="/post-job"
              element={<PostJob user={user} />}
            />

            <Route
              path="/activity"
              element={<MyActivity user={user} />}
            />

            <Route
              path="/bookings"
              element={<Bookings user={user} />}
            />

            <Route
              path="/profile"
              element={
                <Profile
                  user={user}
                  setUser={setUser}
                />
              }
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register setUser={setUser} />}
            />

            <Route
              path="/post-skill"
              element={<PostSkill user={user} />}
            />

            <Route
              path="/chat"
              element={<Chat user={user} />}
            />

            {/* New Route for Notifications */}
            <Route
              path="/notifications"
              element={<Notifications user={user} />}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;