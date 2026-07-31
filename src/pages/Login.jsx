import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/apiServices';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ব্যাকএন্ড API কল
      const res = await loginUser({ email, password });

      // ব্যাকএন্ড থেকে পাওয়া টোকেন ও ইউজার ডাটা localStorage-এ সেভ করা
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // অ্যাপের স্টেট আপডেট করা
      setUser(res.data.user);
      alert('Login Successful!');
      navigate('/matches');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card border-0 shadow-sm rounded-3 p-4">
            <h3 className="fw-bold mb-1 text-center text-dark">Welcome Back</h3>
            <p className="text-secondary text-center small mb-4">Log in to exchange skills with others</p>

            {/* কোনো এরর থাকলে অ্যালার্ট দেখাবে */}
            {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

            <form onSubmit={handleLogin}>
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
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <p className="text-center small text-muted mt-4 mb-0">
              Don't have an account? <Link to="/register" className="text-primary fw-semibold text-decoration-none">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;