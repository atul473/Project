import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import { FiPlus, FiEdit, FiTrash2, FiLogOut, FiPackage } from 'react-icons/fi';
import { Modal, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentBook, setCurrentBook] = useState({ title: '', author: '', description: '', price: '' });

  const fetchBooks = () => api("/books").then(setBooks);
  useEffect(() => { fetchBooks(); }, []);

  const handleSave = async () => {
    try {
      const method = currentBook.id ? "PUT" : "POST";
      const url = currentBook.id ? `/admin/books/${currentBook.id}` : "/admin/books";
      await api(url, method, currentBook);
      toast.success(currentBook.id ? "Book updated" : "Book added to library");
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      // Error handled by api.js
    }
  };

  const openModal = (book = null) => {
    if (book) {
      setCurrentBook(book);
    } else {
      setCurrentBook({ title: '', author: '', description: '', price: '' });
    }
    setShowModal(true);
  };

  return (
    <div className="container py-5" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold m-0 text-white">Admin <span className="gemini-text">Dashboard</span></h2>
          <p className="text-white opacity-75 small m-0">Inventory & Asset Management</p>
        </div>
        <div className="d-flex gap-3">
          <button onClick={() => openModal()} className="btn btn-gemini d-flex align-items-center gap-2">
            <FiPlus /> New Book
          </button>
          <button
            onClick={() => { localStorage.clear(); window.location.href="/"; }}
            className="btn btn-outline-danger rounded-pill d-flex align-items-center gap-2"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Books Table Panel */}
      <div className="gemini-card p-0 overflow-hidden shadow-lg">
        <div className="table-responsive">
          <table className="table table-dark table-hover m-0 align-middle">
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                <th className="p-4 border-0 text-white fw-semibold">Asset Name</th>
                <th className="p-4 border-0 text-white fw-semibold">Author</th>
                <th className="p-4 border-0 text-white fw-semibold">Price</th>
                <th className="p-4 border-0 text-end pe-5 text-white fw-semibold">Management</th>
              </tr>
            </thead>
            <tbody className="border-0">
              {books.map(b => (
                <tr key={b.id} className="border-bottom border-white border-opacity-10">
                  <td className="p-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                        <FiPackage />
                      </div>
                      <span className="text-white fw-medium">{b.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-white opacity-90">{b.author}</td>
                  <td className="p-4 text-white fw-bold">₹{b.price}</td>
                  <td className="p-4 text-end pe-5">
                    <button
                      onClick={() => openModal(b)}
                      className="btn btn-sm btn-outline-light me-2 rounded-3 border-opacity-25"
                      style={{ padding: '8px 12px' }}
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={async () => { if(window.confirm("Delete asset?")){ await api(`/admin/books/${b.id}`, "DELETE"); fetchBooks(); }}}
                      className="btn btn-sm btn-outline-danger rounded-3"
                      style={{ padding: '8px 12px' }}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gemini Themed Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        contentClassName="gemini-card border-0"
      >
        <Modal.Header closeButton closeVariant="white" className="border-bottom border-white border-opacity-10 p-4">
          <Modal.Title className="fw-bold text-white">
            {currentBook.id ? 'Edit' : 'Register'} <span className="gemini-text">Asset</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 bg-transparent">
          <div className="d-flex flex-column gap-4">
            <div>
              <label className="text-white fw-medium small mb-2 d-block">Book Title</label>
              <input
                className="form-control"
                placeholder="Enter title..."
                value={currentBook.title}
                onChange={e => setCurrentBook({...currentBook, title: e.target.value})}
              />
            </div>
            <div>
              <label className="text-white fw-medium small mb-2 d-block">Author Name</label>
              <input
                className="form-control"
                placeholder="Enter author..."
                value={currentBook.author}
                onChange={e => setCurrentBook({...currentBook, author: e.target.value})}
              />
            </div>
            <div>
              <label className="text-white fw-medium small mb-2 d-block">Price (INR)</label>
              <input
                className="form-control"
                type="number"
                placeholder="0.00"
                value={currentBook.price}
                onChange={e => setCurrentBook({...currentBook, price: e.target.value})}
              />
            </div>
            <div>
              <label className="text-white fw-medium small mb-2 d-block">Description</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Describe the asset..."
                value={currentBook.description}
                onChange={e => setCurrentBook({...currentBook, description: e.target.value})}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-top border-white border-opacity-10 p-4">
          <button className="btn btn-outline-light rounded-pill px-4" onClick={() => setShowModal(false)}>
            Cancel
          </button>
          <button className="btn btn-gemini px-4 shadow-lg" onClick={handleSave}>
            {currentBook.id ? 'Update Asset' : 'Add to Inventory'}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}