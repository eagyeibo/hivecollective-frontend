// src/pages/PostSolutionPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../config';

export default function PostSolutionPage() {
  const { id } = useParams();
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
      <div style={{ maxWidth: 500, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>⬡</div>
        <p style={{ fontSize: 15, marginBottom: 16, color: 'var(--text-h)', fontWeight: 500 }}>
          You need to be signed in to propose a solution.
        </p>
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to post solution.'); return; }
      navigate(`/problems/${id}`);
    } catch {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '40px 24px', textAlign: 'left' }}>

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
          background: 'var(--emerald-bg)', border: '1px solid var(--emerald-border)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, color: 'var(--emerald)',
        }}>⬡</div>
        <h1 style={{
          fontSize: 22, fontWeight: 700, margin: 0,
          fontFamily: 'var(--heading)', letterSpacing: '-0.4px', color: 'var(--text-h)',
        }}>
          Propose a solution
        </h1>
      </div>

      {/* Problem context banner */}
      {problem && (
        <div style={{
          background: 'var(--honey-bg)', border: '1px solid var(--honey-border)',
          borderLeft: '3px solid var(--honey)',
          borderRadius: 'var(--radius-md)', padding: '12px 16px',
          marginBottom: 24, marginTop: 16,
          fontSize: 13, color: 'var(--text-h)', lineHeight: 1.5,
        }}>
          <span style={{ color: 'var(--honey)', fontWeight: 600, marginRight: 6 }}>⬡ Problem:</span>
          {problem.title}
        </div>
      )}

      <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 24, lineHeight: 1.6 }}>
        Describe your solution clearly. What should be done, by whom, and how?
        Focus on practical, actionable steps.
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
        borderRadius: 'var(--radius-lg)', padding: '28px',
        boxShadow: 'var(--shadow)',
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>Your solution</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Describe your solution in detail…"
            required
            rows={7}
            style={{ minHeight: 160 }}
          />
          <p style={{
            fontSize: 11, color: content.length > 4500 ? '#b91c1c' : 'var(--text)',
            textAlign: 'right', margin: 0,
          }}>
            {content.length} / 5000
          </p>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15, marginTop: 8 }}
          >
            {loading ? 'Posting…' : 'Post solution'}
          </button>
        </form>
      </div>
    </div>
  );
}
