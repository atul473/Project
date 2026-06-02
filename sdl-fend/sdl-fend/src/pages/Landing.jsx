import React from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';

export default function Landing() {
  return (
    <div className="vh-100 d-flex flex-column position-relative">
      {/* Navbar with Gemini Glass Effect */}
      <nav className="d-flex justify-content-end p-4 gap-3 position-absolute top-0 end-0 w-100" style={{ zIndex: 10 }}>
        {/* ROUNDED LOGIN BUTTON */}
        <Link
          to="/login"
          className="btn btn-outline-light px-4 py-2 d-flex align-items-center rounded-pill"
          style={{
            borderWidth: '1.5px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <FiLogIn className="me-2" /> Login
        </Link>

        <Link to="/register" className="btn btn-gemini px-4 py-2 d-flex align-items-center rounded-pill">
          <FiUserPlus className="me-2" /> Register
        </Link>
      </nav>

      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center px-3">
        <h1 className="display-1 fw-bold mb-4 tracking-tight">
          Smart Digital <span className="gemini-text">Library</span>
        </h1>

        {/* Text is now forced to White as per the Gemini Theme */}
        <p className="lead text-white opacity-90 mb-5" style={{ maxWidth: '750px', lineHeight: '1.6', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          "Where knowledge meets intelligence. Explore a vast universe of books <br className="d-none d-md-block" />
          curated for the modern learner, powered by digital precision."
        </p>

        <div className="mt-2">
           <Link to="/register" className="btn btn-gemini btn-lg px-5 py-3 rounded-pill shadow-lg">
             Get Started!
           </Link>
        </div>
      </div>

      <footer className="p-4 text-center text-white small opacity-50">
        © 2026 SDL • Built for the Future of Learning
      </footer>
    </div>
  );
}