import React, { useState } from 'react';
import { api } from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiBriefcase, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', role: 'USER' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api("/auth/register", "POST", form);
      toast.success("Registration successful! Welcome to the library.");
      navigate("/login");
    } catch (err) {
      // Error is already toasted by api.js
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center px-3">
      <div className="gemini-card p-4 p-md-5 w-100 shadow-lg" style={{ maxWidth: '450px' }}>
        <div className="text-center mb-5">
          <h2 className="fw-bold m-0">Join <span className="gemini-text">Smart Digital Library</span></h2>
          <p className="text-secondary small mt-2">Create an account to start your digital journey</p>
        </div>

        <form onSubmit={handleRegister} className="d-flex flex-column gap-3">
          {/* Username Field */}
          <div>
            <label className="form-label small text-secondary ps-1">
              <FiUser className="me-2" />Username
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Choose a unique username"
              required
              onChange={(e) => setForm({...form, username: e.target.value})}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="form-label small text-secondary ps-1">
              <FiLock className="me-2" />Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Create a strong password"
              required
              onChange={(e) => setForm({...form, password: e.target.value})}
            />
          </div>

          {/* Role Selection Field */}
          <div className="mb-2">
            <label className="form-label small text-secondary ps-1">
              <FiBriefcase className="me-2" />Account Type
            </label>
            <select
              className="form-select"
              onChange={(e) => setForm({...form, role: e.target.value})}
              value={form.role}
            >
              <option value="USER">Reader (Browse & Borrow)</option>
              <option value="ADMIN">Administrator (Manage Library)</option>
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-gemini w-100 py-3 mt-2 d-flex align-items-center justify-content-center gap-2">
            Create Account <FiArrowRight />
          </button>

          <div className="text-center mt-4">
            <p className="small text-secondary m-0">
              Already have an account? <Link to="/login" className="text-decoration-none text-primary fw-semibold">Sign In</Link>
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