import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/apiServices';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { updateUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const cleanEmail = email.toLowerCase().trim();

      const res = await loginUser({
        email: cleanEmail,
        password,
      });

      const loggedInUser = res.data?.user;
      const token = res.data?.token;

      if (!token || !loggedInUser) {
        throw new Error('Invalid login response from server');
      }

      const userId =
        loggedInUser._id ||
        loggedInUser.id ||
        loggedInUser.userId;

      if (!userId) {
        throw new Error('User ID not found in login response');
      }

      const normalizedUser = {
        ...loggedInUser,
        _id: String(userId),
        id: String(userId),
      };

      localStorage.setItem('token', token);
      localStorage.setItem(
        'user',
        JSON.stringify(normalizedUser)
      );

      if (updateUser) {
        updateUser(normalizedUser);
      }

      alert('Login Successful!');

      navigate('/matches');
    } catch (err) {
      console.error('Login error:', err);

      setError(
        err.response?.data?.message ||
          err.message ||
          'Login failed. Invalid credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 py-md-5 font-montserrat">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-6 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-3 p-sm-4 bg-white">
            <h3 className="fw-bold mb-1 text-center text-dark fs-4 fs-md-3">
              Welcome Back
            </h3>

            <p className="text-secondary text-center small mb-4 opacity-75">
              Log in to exchange skills with others
            </p>

            {error && (
              <div
                className="alert alert-danger py-2 px-3 small mb-3 rounded-3"
                style={{ fontSize: '0.85rem' }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-semibold small text-secondary">
                  Email Address
                </label>

                <input
                  type="email"
                  className="form-control form-control-md rounded-3"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small text-secondary">
                  Password
                </label>

                <input
                  type="password"
                  className="form-control form-control-md rounded-3"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 fw-semibold rounded-pill py-2"
                style={{
                  backgroundColor: '#2563eb',
                  borderColor: '#2563eb',
                }}
              >
                {loading
                  ? 'Logging in...'
                  : 'Log In'}
              </button>
            </form>

            <p
              className="text-center small text-muted mt-4 mb-0"
              style={{ fontSize: '0.85rem' }}
            >
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary fw-semibold text-decoration-none"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;