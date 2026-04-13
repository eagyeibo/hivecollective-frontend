// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../config';

// Mini honeycomb corner decoration
function HexCorner() {
  const R = 12;
  const W = R * 1.7321;
  const rowH = R * 1.5;
  function pts(cx, cy) {
    return Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${(cx + R * Math.cos(a)).toFixed(1)},${(cy + R * Math.sin(a)).toFixed(1)}`;
    }).join(' ');
  }
  const hexes = [];
  for (let row = 0; row < 4; row++) {
    const offset = row % 2 === 1 ? W / 2 : 0;
    for (let col = 0; col < 5; col++) {
      hexes.push(pts(col * W + offset, row * rowH));
    }
  }
  return (
    <svg
      aria-hidden="true"
      width="110" height="80"
      style={{ position: 'absolute', top: 0, right: 0, opacity: 0.13, pointerEvents: 'none' }}
      viewBox="0 0 110 80"
    >
      {hexes.map((p, i) => (
        <polygon key={i} points={p} fill="none" stroke="var(--accent)" strokeWidth="1.2" />
      ))}
    </svg>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
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
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed.'); return; }
      login(data.user, data.token);
      navigate('/');
    } catch {
      setError('Could not connect to server. Is it running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100svh - 56px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div
        className="auth-card"
        style={{
          width: '100%', maxWidth: 400,
          background: 'var(--surface-raised)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 40px',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'left',
          position: 'relative',
          overflow: 'hidden',
          animation: 'fadeUp 0.45s ease both',
        }}
      >
        <HexCorner />

        {/* Coloured top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 4,
          background: 'linear-gradient(90deg, var(--accent), var(--accent-2), var(--emerald))',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        }} />

        {/* Logo */}
        <div style={{
          width: 40, height: 40,
          background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
          borderRadius: 11,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, color: '#fff',
          marginBottom: 20,
          boxShadow: '0 3px 14px rgba(124,34,240,0.35)',
        }}>⬡</div>

        <h1 style={{
          fontSize: 22, fontWeight: 700, marginBottom: 6,
          fontFamily: 'var(--heading)', letterSpacing: '-0.4px', color: 'var(--text-h)',
        }}>
          Sign in
        </h1>
        <p style={{ color: 'var(--text)', fontSize: 14, marginBottom: 28, lineHeight: 1.5 }}>
          Welcome back to HiveCollective.
        </p>

        {error && (
          <div style={{
            background: 'rgba(185,28,28,0.07)', border: '1px solid rgba(185,28,28,0.25)',
            borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: 20,
            fontSize: 13, color: '#b91c1c', lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Your password" required />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: 15, marginTop: 4 }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ fontSize: 13, color: 'var(--text)', marginTop: 20, textAlign: 'center' }}>
          No account yet? <a href="/register">Create one</a>
        </p>
      </div>
    </div>
  );
}
