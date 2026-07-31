import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/apiServices';

const Register = ({ setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ব্যাকএন্ড API কল
      const res = await registerUser({ name, email, password });

      // টোকেন ও ইউজার ডাটা সেভ করা
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setUser(res.data.user);
      alert('Account created successfully!');
      navigate('/profile'); // অ্যাকাউন্ট খোলার পর প্রোফাইলে স্কিল সেট করার জন্য যাবে
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card border-0 shadow-sm rounded-3 p-4">
            <h3 className="fw-bold mb-1 text-center text-dark">Create Account</h3>
            <p className="text-secondary text-center small mb-4">Join SkillSwap and start learning today</p>

            {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rahul Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 fw-semibold rounded-pill py-2"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <p className="text-center small text-muted mt-4 mb-0">
              Already have an account? <Link to="/login" className="text-primary fw-semibold text-decoration-none">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;