import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import { FiArrowLeft, FiCreditCard, FiHash, FiClock, FiShield, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Cart() {
  const [items, setItems] = useState([]);
  const RENT_FEE = 5;

  useEffect(() => {
    api("/cart").then(setItems);
  }, []);

  const totalDeposit = items.reduce((sum, item) => sum + item.book.price, 0);

  return (
    <div className="container py-5" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navigation - Rounded Pill Style */}
      <Link
        to="/user-home"
        className="btn btn-outline-light rounded-pill mb-5 d-inline-flex align-items-center gap-2 px-4 py-2"
        style={{
          borderWidth: '1.5px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <FiArrowLeft /> Back to Library
      </Link>

      <h2 className="mb-4 fw-bold text-white">
        Your <span className="gemini-text">Borrowed Books</span>
      </h2>

      <div className="row g-4">
        {/* Main List - Glossy Table Panel */}
        <div className="col-lg-8">
          <div className="gemini-card p-0 overflow-hidden shadow-lg border-opacity-10">
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle m-0">
                <thead style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                  <tr>
                    <th className="p-4 border-0 text-white fw-semibold small text-uppercase tracking-wider">
                      <FiHash className="me-2 text-primary" />Book Title
                    </th>
                    <th className="p-4 border-0 text-white fw-semibold small text-uppercase tracking-wider">
                      <FiClock className="me-2 text-primary" />Weekly Rent
                    </th>
                    <th className="p-4 border-0 text-end pe-5 text-white fw-semibold small text-uppercase tracking-wider">
                      <FiShield className="me-2 text-primary" />Deposit
                    </th>
                  </tr>
                </thead>
                <tbody className="border-0">
                  {items.map(item => (
                    <tr key={item.id} className="border-bottom border-white border-opacity-10">
                      <td className="p-4 fw-medium text-white">
                        <FiShoppingBag className="me-3 opacity-50" />
                        {item.book.title}
                      </td>
                      <td className="p-4 text-white opacity-90">₹{RENT_FEE} / week</td>
                      <td className="p-4 text-end pe-5 text-white fw-bold">₹{item.book.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {items.length === 0 && (
              <div className="text-center py-5">
                <p className="text-white opacity-50 m-0 fs-5">Your borrowing list is empty.</p>
                <Link to="/user-home" className="btn btn-gemini mt-3 px-5 rounded-pill">Start Browsing</Link>
              </div>
            )}
          </div>
        </div>

        {/* Checkout Summary - Sticky Glossy Card */}
        <div className="col-lg-4">
          <div className="gemini-card p-4 position-sticky shadow-lg" style={{ top: '2rem', border: '1px solid rgba(255,255,255,0.15)' }}>
            <h5 className="fw-bold text-white mb-4">Summary</h5>

            <div className="d-flex justify-content-between mb-3">
              <span className="text-white opacity-75">Total Items:</span>
              <span className="text-white fw-bold">{items.length} Books</span>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <span className="text-white opacity-75">Rental Cycle:</span>
              <span className="text-white fw-medium">₹{RENT_FEE} / Week</span>
            </div>

            <hr className="border-white border-opacity-20 my-4" />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="text-white opacity-75 fs-6">Total Deposit:</span>
              <span className="h3 m-0 text-white fw-bold" style={{ textShadow: '0 0 15px rgba(75, 144, 255, 0.4)' }}>
                ₹{totalDeposit}
              </span>
            </div>

            <button
              className="btn btn-gemini w-100 py-3 d-flex align-items-center justify-content-center gap-3 rounded-pill shadow-lg"
              disabled={items.length === 0}
              style={{ fontSize: '1.1rem' }}
            >
              <FiCreditCard size={20} /> Process Checkout
            </button>

            <p className="small text-white opacity-50 text-center mt-4 mb-0">
              *Full deposit is returned upon safe book return.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .table-hover tbody tr:hover {
          background-color: rgba(75, 144, 255, 0.05) !important;
        }
        .gemini-card {
          backdrop-filter: blur(20px) saturate(180%);
        }
      `}</style>
    </div>
  );
}