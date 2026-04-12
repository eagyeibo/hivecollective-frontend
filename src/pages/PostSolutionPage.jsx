// ─────────────────────────────────────────────────────────────
// src/pages/PostSolutionPage.jsx
// Form to propose a solution to a specific problem
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import API from '../config';

export default function PostSolutionPage() {
  const { id } = useParams(); // problem id
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProblem() {
      const res = await fetch(`${API}/problems/${id}`);
      const data = await res.json();
      if (res.ok) setProblem(data.problem);
    }
    fetchProblem();
  }, [id]);

  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: 500, margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
        <p style={{ fontSize: 15, marginBottom: 12 }}>You need to be signed in to propose a solution.</p>
        <button onClick={() => navigate('/login')}>Sign in</button>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/problems/${id}/solutions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to post solution.');
        return;
      }

      navigate(`/problems/${id}`);

    } catch (err) {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px' }}>
      <button onClick={() => navigate(`/problems/${id}`)} style={{ marginBottom: 20, fontSize: 13 }}>
        ← Back to problem
      </button>

      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 6 }}>Propose a solution</h1>

      {problem && (
        <div style={{ background: '#f5f5f5', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#444' }}>
          <strong style={{ fontWeight: 500 }}>Problem: </strong>{problem.title}
        </div>
      )}

      <p style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>
        Describe your solution clearly. What should be done, by whom, and how?
        Focus on practical, actionable steps.
      </p>

      {error && (
        <div style={{ background: '#fef2f2', border: '0.5px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#b91c1c' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Your solution</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Describe your solution in detail…"
          required
          rows={7}
          style={{ width: '100%', marginBottom: 6, boxSizing: 'border-box', resize: 'vertical' }}
        />
        <p style={{ fontSize: 11, color: '#999', margin: '0 0 16px', textAlign: 'right' }}>
          {content.length} / 5000
        </p>

        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Posting…' : 'Post solution'}
        </button>
      </form>
    </div>
  );
}