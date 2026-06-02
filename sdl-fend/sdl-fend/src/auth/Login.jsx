import React, { useState } from 'react';
import { api } from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiLock, FiUser } from 'react-icons/fi';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await api("/auth/login", "POST", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);

      toast.success(`Welcome back, ${data.username}!`);
      navigate(data.role === "ADMIN" ? "/admin" : "/user-home");
    } catch (err) { /* Error handled by api.js */ }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center px-3">
      <div className="gemini-card p-4 p-md-5 w-100 shadow-lg" style={{ maxWidth: '440px' }}>
        <div className="text-center mb-5">
          <h2 className="fw-bold m-0">Sign <span className="gemini-text">In</span></h2>
          <p className="text-secondary small mt-2">Welcome back to the Smart Digital Library</p>
        </div>

        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label small text-secondary ps-1">
              <FiUser className="me-2" />Username
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username"
              required
              autoComplete="username"
              onChange={(e) => setForm({...form, username: e.target.value})}
            />
          </div>

          <div className="mb-2">
            <label className="form-label small text-secondary ps-1">
              <FiLock className="me-2" />Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              onChange={(e) => setForm({...form, password: e.target.value})}
            />
          </div>

          <button type="submit" className="btn btn-gemini w-100 py-3 mt-2 shadow-sm">
            Access Library
          </button>

          <div className="text-center mt-4">
            <p className="small text-secondary m-0">
              New here? <Link to="/register" className="text-decoration-none text-primary fw-semibold">Create an account</Link>
            </p>
            <Link to="/" className="small text-muted text-decoration-none d-block mt-3">
              ← Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}