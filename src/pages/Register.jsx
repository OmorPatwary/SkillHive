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
    <div className="container py-4 py-md-5 font-montserrat">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-6 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-3 p-sm-4 bg-white">
            <h3 className="fw-bold mb-1 text-center text-dark fs-4 fs-md-3">Create Account</h3>
            <p className="text-secondary text-center small mb-4 opacity-75">
              Join SkillSwap and start learning today
            </p>

            {error && (
              <div className="alert alert-danger py-2 px-3 small mb-3 rounded-3" style={{ fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label fw-semibold small text-secondary">Full Name</label>
                <input
                  type="text"
                  className="form-control form-control-md rounded-3"
                  placeholder="Rahul Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small text-secondary">Email Address</label>
                <input
                  type="email"
                  className="form-control form-control-md rounded-3"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small text-secondary">Password</label>
                <input
                  type="password"
                  className="form-control form-control-md rounded-3"
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
                style={{ backgroundColor: '#2563eb', borderColor: '#2563eb' }}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <p className="text-center small text-muted mt-4 mb-0" style={{ fontSize: '0.85rem' }}>
              Already have an account?{' '}
              <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;