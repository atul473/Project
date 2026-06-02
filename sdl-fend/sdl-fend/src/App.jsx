    import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import Login from './auth/Login';
import Register from './auth/Register';
import UserHome from './pages/UserHome';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <div className="min-vh-100 position-relative">
        {/* The Gemini Animated Background */}
        <div className="gemini-bg-wrapper"></div>

        <Chatbot />
        <Toaster position="top-right" />

        <div className="position-relative z-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user-home" element={<UserHome />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
export default App;