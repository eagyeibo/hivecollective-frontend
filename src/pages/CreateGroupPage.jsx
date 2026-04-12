import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import API from '../config';

export default function CreateGroupPage() {
  const { id } = useParams(); // problem id
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: 500, margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
        <p style={{ fontSize: 15, marginBottom: 12 }}>You need to be signed in to create a group.</p>
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
      const res = await fetch(`${API}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ problem_id: parseInt(id), ...form }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create group.');
        return;
      }

      navigate(`/groups/${data.group.id}`);

    } catch (err) {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 20px' }}>
      <button onClick={() => navigate(`/problems/${id}`)} style={{ marginBottom: 20, fontSize: 13 }}>
        ← Back to problem
      </button>

      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 6 }}>Create a group</h1>
      <p style={{ fontSize: 13, color: '#666', marginBottom: 24 }}>
        Groups bring people together around a specific problem.
        As the creator you become the moderator — you can assign others,
        mark solutions as implemented, and remove inappropriate content.
      </p>

      {error && (
        <div style={{ background: '#fef2f2', border: '0.5px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#b91c1c' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Group name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Clean Water Action Group — Ghana"
          required
          style={{ width: '100%', marginBottom: 14, boxSizing: 'border-box' }}
        />

        <label style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Description (optional)</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="What is this group trying to achieve? Who should join?"
          rows={4}
          style={{ width: '100%', marginBottom: 20, boxSizing: 'border-box', resize: 'vertical' }}
        />

        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Creating…' : 'Create group'}
        </button>
      </form>
    </div>
  );
}