import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UploadPage from './pages/UploadPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('resume-token') ?? '');

  const handleLoginSuccess = (newToken: string) => {
    localStorage.setItem('resume-token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('resume-token');
    setToken('');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route
          path="/upload"
          element={token ? <UploadPage token={token} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to={token ? '/upload' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
