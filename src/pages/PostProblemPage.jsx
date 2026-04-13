// ─────────────────────────────────────────────────────────────
// src/pages/PostProblemPage.jsx
// Form to post a new problem — logged-in users only
// ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import API from '../config';

export default function PostProblemPage() {
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    scope: 'national',
    location_tag: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: 500, margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
        <p style={{ fontSize: 15, marginBottom: 12 }}>You need to be signed in to post a problem.</p>
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to post problem.');
        return;
      }

      // Go to the new problem's page
      navigate(`/problems/${data.problem.id}`);

    } catch (err) {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px' }}>
      <button onClick={() => navigate('/problems')} style={{ marginBottom: 20, fontSize: 13 }}>
        ← Back
      </button>

      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 6 }}>Post a problem</h1>
      <p style={{ fontSize: 13, color: '#666', marginBottom: 24 }}>
        Describe a real challenge affecting your community, country, or region.
        Focus on societal problems — not personal ones.
      </p>

      {error && (
        <div style={{ background: '#fef2f2', border: '0.5px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#b91c1c' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Problem title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Lack of clean drinking water in rural areas"
          required
          style={{ width: '100%', marginBottom: 14, boxSizing: 'border-box' }}
        />

        <label style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the problem in detail. Who does it affect? What are the consequences? What has been tried before?"
          required
          rows={5}
          style={{ width: '100%', marginBottom: 14, boxSizing: 'border-box', resize: 'vertical' }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Scope</label>
            <select
              name="scope"
              value={form.scope}
              onChange={handleChange}
              style={{ width: '100%' }}
            >
              <option value="national">National</option>
              <option value="local">Local</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Location</label>
            <input
              name="location_tag"
              value={form.location_tag}
              onChange={handleChange}
              placeholder="e.g. Ghana or Accra"
              required
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Posting…' : 'Post problem'}
        </button>
      </form>
    </div>
  );
}