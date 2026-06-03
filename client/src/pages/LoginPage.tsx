import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

interface LoginPageProps {
  onLoginSuccess: (token: string) => void;
}

function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('atulparjapati@gmail.com');
  const [password, setPassword] = useState('password123');
  const [status, setStatus] = useState('Enter your credentials to continue.');
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const data = await login(email, password);
      onLoginSuccess(data.token);
      setStatus('Login successful. Redirecting to upload page...');
      navigate('/upload');
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Login failed. Please check your email and password.';
      setStatus(message);
    }
  };

  return (
    <div className="app-shell">
      <header>
        <h1>AI Resume Analyzer</h1>
        <p>Login to access the resume upload and scoring page.</p>
      </header>

      <section className="card auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input value={email} onChange={e => setEmail(e.target.value)} />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </label>
          <button type="submit">Login</button>
        </form>
      </section>

      <section className="card status-card">
        <h2>Status</h2>
        <p>{status}</p>
      </section>
    </div>
  );
}

export default LoginPage;
