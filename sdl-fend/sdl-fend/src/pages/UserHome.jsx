import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import { FiShoppingCart, FiLogOut, FiSearch, FiBook } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function UserHome() {
  const [books, setBooks] = useState([]);

  const loadBooks = async (q = "") => {
    try {
      const data = await api(q ? `/books/search?keyword=${q}` : "/books");
      setBooks(data);
    } catch (err) {
      // Error handled by api.js
    }
  };

  useEffect(() => { loadBooks(); }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="container py-5" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
        <h2 className="fw-bold m-0 text-white">Smart <span className="gemini-text">Library</span></h2>
        <div className="d-flex gap-3">
          {/* ROUNDED PILL CART BUTTON */}
          <Link
            to="/cart"
            className="btn btn-outline-light rounded-pill px-4 d-flex align-items-center gap-2"
            style={{
              borderWidth: '1.5px',
              transition: 'all 0.3s ease',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <FiShoppingCart /> <span>Cart</span>
          </Link>

          <button
            onClick={handleLogout}
            className="btn btn-outline-danger rounded-pill px-4 d-flex align-items-center gap-2"
          >
            <FiLogOut /> <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Search Bar - Gemini Pill Style */}
      <div className="input-group gemini-card p-1 mb-5 rounded-pill shadow-lg border-opacity-25">
        <span className="input-group-text bg-transparent border-0 ps-4 text-white">
          <FiSearch size={20} />
        </span>
        <input
          type="text"
          className="form-control bg-transparent border-0 text-white shadow-none py-3"
          placeholder="Search by title, author, or keywords..."
          onChange={e => loadBooks(e.target.value)}
        />
      </div>

      {/* Book Grid */}
      <div className="row g-4">
        {books.map(b => (
          <div className="col-md-6 col-lg-4" key={b.id}>
            <div className="gemini-card p-4 h-100 d-flex flex-column item-card-hover">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="p-3 bg-primary bg-opacity-10 rounded-4 text-primary">
                  <FiBook size={24} />
                </div>
                <span className="badge bg-white bg-opacity-10 rounded-pill px-3 py-2 text-white border border-white border-opacity-10">
                   ₹{b.price}
                </span>
              </div>

              <h5 className="fw-bold text-white mb-2">{b.title}</h5>
              <p className="text-white small flex-grow-1 opacity-75 mb-4" style={{ lineHeight: '1.6' }}>
                {b.description}
              </p>

              <div className="mt-auto pt-3 border-top border-white border-opacity-10">
                <button
                  onClick={() => { api(`/cart/${b.id}`, "POST"); toast.success("Added to cart!"); }}
                  className="btn btn-gemini w-100 py-2 rounded-pill shadow-sm"
                >
                  Borrow Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CSS for Card Hover Effect */}
      <style>{`
        .item-card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .item-card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(75, 144, 255, 0.2) !important;
          border-color: rgba(75, 144, 255, 0.4) !important;
        }
      `}</style>
    </div>
  );
}