// src/pages/CreateGroupPage.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../config';

export default function CreateGroupPage() {
  const { id } = useParams();
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>⬡</div>
        <p style={{ fontSize: 15, marginBottom: 16, color: 'var(--text-h)', fontWeight: 500 }}>
          You need to be signed in to create a group.
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
      const res = await fetch(`${API}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ problem_id: parseInt(id), ...form }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to create group.'); return; }
      navigate(`/groups/${data.group.id}`);
    } catch {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 580, margin: '0 auto', padding: '40px 24px', textAlign: 'left' }}>

      <button
        onClick={() => navigate(`/problems/${id}`)}
        style={{
          marginBottom: 28, fontSize: 13,
          background: 'transparent', color: 'var(--text)',
          border: '1px solid var(--border)', boxShadow: 'none', padding: '7px 14px',
        }}
      >
        ← Back to problem
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
        <div style={{
          width: 44, height: 44,
          background: 'var(--honey-bg)', border: '1px solid var(--honey-border)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, color: 'var(--honey)',
        }}>⬡</div>
        <h1 style={{
          fontSize: 22, fontWeight: 700, margin: 0,
          fontFamily: 'var(--heading)', letterSpacing: '-0.4px', color: 'var(--text-h)',
        }}>
          Create a group
        </h1>
      </div>
      <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 28, lineHeight: 1.6, paddingLeft: 58 }}>
        Groups bring people together around a specific problem.
        As the creator you become the moderator — you can assign others
        and guide the community toward real solutions.
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
        borderTop: '3px solid var(--honey)',
        borderRadius: 'var(--radius-lg)', padding: '28px',
        boxShadow: 'var(--shadow)',
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label>Group name</label>
            <input
              name="name" value={form.name} onChange={handleChange}
              placeholder="e.g. Clean Water Action Group — Ghana" required
            />
          </div>
          <div>
            <label>Description <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span></label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              placeholder="What is this group trying to achieve? Who should join?"
              rows={4}
            />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15 }}>
            {loading ? 'Creating…' : 'Create group'}
          </button>
        </form>
      </div>
    </div>
  );
}
