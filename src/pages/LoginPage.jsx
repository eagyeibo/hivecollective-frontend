// ─────────────────────────────────────────────────────────────
// src/pages/LoginPage.jsx
// ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import API from '../config';

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_LOGIN}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed.');
        return;
      }

      login(data.user, data.token);
      navigate('/');

    } catch (err) {
      setError('Could not connect to server. Is it running?');
    } finally {
      setLoading(false);
    }
  }
const navigate = useNavigate()
  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 8 }}>Sign in</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
        Welcome back to HiveCollective.
      </p>

      {error && (
        <div style={{ background: '#fef2f2', border: '0.5px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#b91c1c' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Email</label>
        <input
          type="email" name="email" value={form.email} onChange={handleChange}
          placeholder="you@example.com" required
          style={{ width: '100%', marginBottom: 14, boxSizing: 'border-box' }}
        />

        <label style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Password</label>
        <input
          type="password" name="password" value={form.password} onChange={handleChange}
          placeholder="Your password" required
          style={{ width: '100%', marginBottom: 20, boxSizing: 'border-box' }}
        />

        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p style={{ fontSize: 13, color: '#666', marginTop: 16, textAlign: 'center' }}>
        No account yet? <a href="/register">Create one</a>
      </p>
    </div>
  );
}