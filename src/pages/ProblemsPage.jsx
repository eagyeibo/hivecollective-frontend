// ─────────────────────────────────────────────────────────────
// src/pages/ProblemsPage.jsx
// Browse all problems — with filter by scope and location
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import API from '../config';

export default function ProblemsPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scopeFilter, setScopeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetchProblems();
  }, [scopeFilter, locationFilter]);

  async function fetchProblems() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (scopeFilter) params.append('scope', scopeFilter);
      if (locationFilter) params.append('location', locationFilter);

      const res = await fetch(`${API}/problems?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);
      setProblems(data.problems);
    } catch (err) {
      setError('Could not load problems.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, margin: '0 0 4px' }}>Problems</h1>
          <p style={{ fontSize: 13, color: '#666', margin: 0 }}>
            {problems.length} problem{problems.length !== 1 ? 's' : ''} posted
          </p>
        </div>
        {isLoggedIn && (
          <button onClick={() => navigate('/problems/new')}>
            + Post a problem
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <select
          value={scopeFilter}
          onChange={e => setScopeFilter(e.target.value)}
          style={{ minWidth: 140 }}
        >
          <option value="">All scopes</option>
          <option value="local">Local</option>
          <option value="national">National</option>
        </select>

        <input
          placeholder="Filter by location…"
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
          style={{ flex: 1, minWidth: 160 }}
        />

        {(scopeFilter || locationFilter) && (
          <button onClick={() => { setScopeFilter(''); setLocationFilter(''); }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Problem list */}
      {loading && <p style={{ color: '#666', fontSize: 13 }}>Loading…</p>}
      {error && <p style={{ color: '#b91c1c', fontSize: 13 }}>{error}</p>}

      {!loading && problems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#666' }}>
          <p style={{ fontSize: 15, marginBottom: 8 }}>No problems posted yet.</p>
          {isLoggedIn
            ? <button onClick={() => navigate('/problems/new')}>Be the first to post one</button>
            : <p style={{ fontSize: 13 }}><a href="/register">Sign up</a> to post the first problem.</p>
          }
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {problems.map(problem => (
          <div
            key={problem.id}
            onClick={() => navigate(`/problems/${problem.id}`)}
            style={{
              background: '#fff',
              border: '0.5px solid #e5e5e5',
              borderRadius: 12,
              padding: '16px 18px',
              cursor: 'pointer',
              transition: 'border-color .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#aaa'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e5e5'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <h2 style={{ fontSize: 15, fontWeight: 500, margin: '0 0 6px', lineHeight: 1.4 }}>
                {problem.title}
              </h2>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <span style={{
                  fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20,
                  background: problem.scope === 'national' ? '#eff6ff' : '#f0fdf4',
                  color: problem.scope === 'national' ? '#1d4ed8' : '#15803d',
                }}>
                  {problem.scope}
                </span>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#555', margin: '0 0 10px', lineHeight: 1.5 }}>
              {problem.description.length > 120
                ? problem.description.slice(0, 120) + '…'
                : problem.description}
            </p>
            <div style={{ fontSize: 12, color: '#888', display: 'flex', gap: 16 }}>
              <span>{problem.location_tag}</span>
              <span>by {problem.posted_by}</span>
              <span>{problem.solution_count} solution{problem.solution_count !== 1 ? 's' : ''}</span>
              <span>{new Date(problem.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}