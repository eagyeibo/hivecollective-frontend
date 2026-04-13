// src/pages/PostProblemPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../config';

export default function PostProblemPage() {
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', scope: 'national', location_tag: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>⬡</div>
        <p style={{ fontSize: 15, marginBottom: 16, color: 'var(--text-h)', fontWeight: 500 }}>
          You need to be signed in to post a problem.
        </p>
        <button onClick={() => navigate('/login')}>Sign in</button>
      </div>
    );
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to post problem.'); return; }
      navigate(`/problems/${data.problem.id}`);
    } catch {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '40px 24px', textAlign: 'left' }}>

      <button
        onClick={() => navigate('/problems')}
        style={{
          marginBottom: 28, fontSize: 13,
          background: 'transparent', color: 'var(--text)',
          border: '1px solid var(--border)', boxShadow: 'none', padding: '7px 14px',
        }}
      >
        ← Back
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
        <div style={{
          width: 44, height: 44,
          background: 'var(--accent-bg)', border: '1px solid var(--accent-border)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, color: 'var(--accent)',
        }}>⬡</div>
        <h1 style={{
          fontSize: 22, fontWeight: 700, margin: 0,
          fontFamily: 'var(--heading)', letterSpacing: '-0.4px', color: 'var(--text-h)',
        }}>
          Post a problem
        </h1>
      </div>
      <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 28, lineHeight: 1.6, paddingLeft: 58 }}>
        Describe a real challenge affecting your community, country, or region.
        Focus on societal problems — not personal ones.
      </p>

      {error && (
        <div style={{
          background: 'rgba(185,28,28,0.07)', border: '1px solid rgba(185,28,28,0.25)',
          borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: 20,
          fontSize: 13, color: '#b91c1c',
        }}>
          {error}
        </div>
      )}

      <div style={{
        background: 'var(--surface-raised)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '28px 28px',
        boxShadow: 'var(--shadow)',
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label>Problem title</label>
            <input
              name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. Lack of clean drinking water in rural areas" required
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              placeholder="Describe the problem in detail. Who does it affect? What are the consequences? What has been tried before?"
              required rows={5}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label>Scope</label>
              <select name="scope" value={form.scope} onChange={handleChange}>
                <option value="national">National</option>
                <option value="local">Local</option>
              </select>
            </div>
            <div>
              <label>Location</label>
              <input
                name="location_tag" value={form.location_tag} onChange={handleChange}
                placeholder="e.g. Ghana or Accra" required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15 }}>
            {loading ? 'Posting…' : 'Post problem'}
          </button>
        </form>
      </div>
    </div>
  );
}
