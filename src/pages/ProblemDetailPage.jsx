// ─────────────────────────────────────────────────────────────
// src/pages/ProblemDetailPage.jsx
// Shows one problem and all its solutions
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SolutionCard from '../components/SolutionCard';
import ShareBar from '../components/ShareBar';

import API from '../config';

// Tiny hex decoration for section headings
function HexDot({ color = 'var(--accent)' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style={{ flexShrink: 0 }}>
      <polygon
        points="7,1 13,4 13,10 7,13 1,10 1,4"
        fill={color} fillOpacity="0.18"
        stroke={color} strokeWidth="1.5"
      />
    </svg>
  );
}

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

  if (loading) return <p style={{ padding: 40, color: 'var(--text)', fontSize: 13 }}>Loading…</p>;
  if (error)   return <p style={{ padding: 40, color: '#b91c1c', fontSize: 13 }}>{error}</p>;
  if (!problem) return null;

  const isNational = problem.scope === 'national';
  const scopeBadge = isNational
    ? { background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }
    : { background: 'var(--emerald-bg)', color: 'var(--emerald)', border: '1px solid var(--emerald-border)' };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px', textAlign: 'left' }}>

      {/* Back */}
      <button
        onClick={() => navigate('/problems')}
        style={{
          marginBottom: 24, fontSize: 13,
          background: 'transparent', color: 'var(--text)',
          border: '1px solid var(--border)', boxShadow: 'none', padding: '7px 14px',
        }}
      >
        ← Back to problems
      </button>

      {/* Problem card */}
      <div style={{
        background: 'var(--surface-raised)',
        border: '1px solid var(--border)',
        borderTop: `3px solid ${isNational ? 'var(--accent)' : 'var(--emerald)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '24px 26px',
        marginBottom: 20,
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, ...scopeBadge }}>
            {problem.scope}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 20,
            background: 'var(--honey-bg)', color: 'var(--honey)', border: '1px solid var(--honey-border)',
          }}>
            ⬡ {problem.location_tag}
          </span>
        </div>

        <h1 style={{
          fontSize: 22, fontWeight: 700, margin: '0 0 14px', lineHeight: 1.35,
          fontFamily: 'var(--heading)', letterSpacing: '-0.4px', color: 'var(--text-h)',
        }}>
          {problem.title}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.75, margin: '0 0 16px' }}>
          {problem.description}
        </p>
        <p style={{ fontSize: 12, color: 'var(--text)', margin: 0 }}>
          Posted by <strong style={{ color: 'var(--text-h)' }}>{problem.posted_by}</strong>
          {' · '}
          {new Date(problem.created_at).toLocaleDateString()}
        </p>
      </div>

      <ShareBar problemId={id} problemTitle={problem.title} />

      {/* Groups section */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{
            fontSize: 15, fontWeight: 700, margin: 0,
            fontFamily: 'var(--heading)', color: 'var(--text-h)',
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <HexDot color="var(--honey)" />
            Groups ({groups.length})
          </h2>
          {isLoggedIn && (
            <button
              onClick={() => navigate(`/problems/${id}/groups/new`)}
              style={{ fontSize: 13, padding: '7px 14px' }}
            >
              + Create group
            </button>
          )}
        </div>

        {groups.length === 0 && (
          <p style={{ fontSize: 13, color: 'var(--text)', fontStyle: 'italic' }}>
            No groups yet — be the first to organise around this problem.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {groups.map(group => (
            <div
              key={group.id}
              onClick={() => navigate(`/groups/${group.id}`)}
              style={{
                background: 'var(--surface-raised)',
                border: '1px solid var(--border)',
                borderLeft: '3px solid var(--honey)',
                borderRadius: 'var(--radius-md)',
                padding: '13px 18px', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'box-shadow var(--transition), transform var(--transition)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 3px', color: 'var(--text-h)' }}>
                  {group.name}
                </p>
                {group.description && (
                  <p style={{ fontSize: 12, color: 'var(--text)', margin: 0 }}>{group.description}</p>
                )}
              </div>
              <div style={{
                fontSize: 12, color: 'var(--honey)', flexShrink: 0, marginLeft: 14,
                background: 'var(--honey-bg)', padding: '2px 9px', borderRadius: 5,
                fontWeight: 700, border: '1px solid var(--honey-border)',
              }}>
                {group.member_count} member{group.member_count !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Solutions section */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{
            fontSize: 15, fontWeight: 700, margin: 0,
            fontFamily: 'var(--heading)', color: 'var(--text-h)',
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <HexDot color="var(--emerald)" />
            Solutions ({solutions.length})
          </h2>
          {isLoggedIn && (
            <button
              onClick={() => navigate(`/problems/${id}/solutions/new`)}
              style={{ fontSize: 13, padding: '7px 14px' }}
            >
              + Propose a solution
            </button>
          )}
        </div>

        {solutions.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '48px 0', color: 'var(--text)',
            border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)',
          }}>
            <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.28 }}>⬡</div>
            <p style={{ fontSize: 14, marginBottom: 10, fontWeight: 500, color: 'var(--text-h)' }}>
              No solutions yet.
            </p>
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
    </div>
  );
}
