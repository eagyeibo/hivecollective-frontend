// ─────────────────────────────────────────────────────────────
// src/pages/ProblemDetailPage.jsx
// Shows one problem and all its solutions (solutions added in phase 5)
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SolutionCard from '../components/SolutionCard';
import ShareBar from '../components/ShareBar';

import API from '../config';

export default function ProblemDetailPage() {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [groups, setGroups] = useState([]);

  useEffect(() => {
  async function fetchProblem() {
    try {
      const res = await fetch(`${API}/problems/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProblem(data.problem);
      setSolutions(data.solutions);

      // Also fetch groups for this problem
      const groupRes = await fetch(`${API}/groups?problem_id=${id}`);
      const groupData = await groupRes.json();
      if (groupRes.ok) setGroups(groupData.groups);

    } catch (err) {
      setError('Could not load this problem.');
    } finally {
      setLoading(false);
    }
  }
  fetchProblem();
}, [id]);

    if (loading) return <p style={{ padding: 40, color: '#666', fontSize: 13 }}>Loading…</p>;
  if (error) return <p style={{ padding: 40, color: '#b91c1c', fontSize: 13 }}>{error}</p>;
  if (!problem) return null;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 20px' }}>

      {/* Back link */}
      <button
        onClick={() => navigate('/problems')}
        style={{ marginBottom: 20, fontSize: 13 }}
      >
        ← Back to problems
      </button>

      {/* Problem */}
      <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 12, padding: '20px 22px', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <span style={{
            fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20,
            background: problem.scope === 'national' ? '#eff6ff' : '#f0fdf4',
            color: problem.scope === 'national' ? '#1d4ed8' : '#15803d',
          }}>
            {problem.scope}
          </span>
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#f5f5f5', color: '#555' }}>
            {problem.location_tag}
          </span>
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 500, margin: '0 0 12px', lineHeight: 1.4 }}>
          {problem.title}
        </h1>
        <p style={{ fontSize: 14, color: '#444', lineHeight: 1.7, margin: '0 0 14px' }}>
          {problem.description}
        </p>
        <p style={{ fontSize: 12, color: '#888', margin: 0 }}>
          Posted by {problem.posted_by} · {new Date(problem.created_at).toLocaleDateString()}
        </p>
      </div>

<ShareBar problemId={id} problemTitle={problem.title} />

{/* Groups section */}
<div style={{ marginBottom: 24 }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
    <h2 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>
      Groups ({groups.length})
    </h2>
    {isLoggedIn && (
      <button onClick={() => navigate(`/problems/${id}/groups/new`)}>
        + Create group
      </button>
    )}
  </div>

  {groups.length === 0 && (
    <p style={{ fontSize: 13, color: '#888' }}>
      No groups yet — be the first to organise around this problem.
    </p>
  )}

  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    {groups.map(group => (
      <div
        key={group.id}
        onClick={() => navigate(`/groups/${group.id}`)}
        style={{
          background: '#fff',
          border: '0.5px solid #e5e5e5',
          borderRadius: 10,
          padding: '12px 16px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#aaa'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e5e5'}
      >
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, margin: '0 0 3px' }}>{group.name}</p>
          {group.description && (
            <p style={{ fontSize: 12, color: '#666', margin: 0 }}>{group.description}</p>
          )}
        </div>
        <div style={{ fontSize: 12, color: '#888', flexShrink: 0, marginLeft: 12 }}>
          {group.member_count} member{group.member_count !== 1 ? 's' : ''}
        </div>
      </div>
    ))}
  </div>
</div>

      {/* Solutions placeholder — filled in phase 5 */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>
          Solutions ({solutions.length})
        </h2>
        {isLoggedIn && (
          <button onClick={() => navigate(`/problems/${id}/solutions/new`)}>
            + Propose a solution
          </button>
        )}
      </div>

      {solutions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
          <p style={{ fontSize: 14, marginBottom: 8 }}>No solutions yet.</p>
          {isLoggedIn
            ? <button onClick={() => navigate(`/problems/${id}/solutions/new`)}>Be the first to propose one</button>
            : <p style={{ fontSize: 13 }}><a href="/register">Sign up</a> to propose a solution.</p>
          }
        </div>
      )}

      {solutions.map((s, i) => (
  <SolutionCard
    key={s.id}
    solution={s}
    problemId={id}
    isTop={i === 0 && solutions.length > 1}
  />
))}
    </div>
  );
}