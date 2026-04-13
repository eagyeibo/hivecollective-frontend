// ─────────────────────────────────────────────────────────────
// src/components/SolutionCard.jsx
// Displays a single solution with upvote/downvote buttons
// ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../config';

export default function SolutionCard({ solution, problemId, isTop }) {
  const { token, isLoggedIn, user } = useAuth();
  const [score, setScore] = useState(solution.score);
  const [userVote, setUserVote] = useState(solution.userVote || 0);
  const [voting, setVoting] = useState(false);

  const isOwnSolution = user && user.id === solution.user_id;

  async function vote(value) {
    if (!isLoggedIn) {
      alert('Please sign in to vote.');
      return;
    }
    if (isOwnSolution) return;
    if (voting) return;

    setVoting(true);
    try {
      const res = await fetch(`${API}/problems/${problemId}/solutions/${solution.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ value }),
      });

      const data = await res.json();
      if (res.ok) {
        setScore(data.score);
        setUserVote(data.userVote);
      }
    } catch (err) {
      console.error('Vote failed:', err);
    } finally {
      setVoting(false);
    }
  }

  return (
    <div style={{
      background: isTop ? 'var(--accent-bg)' : 'var(--surface-raised)',
      border: `1px solid ${isTop ? 'var(--accent-border)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-lg)',
      padding: '16px 20px',
      marginBottom: 10,
      display: 'flex',
      gap: 16,
      transition: 'box-shadow var(--transition)',
    }}>

      {/* Vote column */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        minWidth: 36,
      }}>
        <button
          onClick={() => vote(1)}
          disabled={voting || isOwnSolution}
          title={isOwnSolution ? "You can't vote on your own solution" : 'Upvote'}
          style={{
            background: userVote === 1 ? 'var(--accent-bg)' : 'transparent',
            border: `1.5px solid ${userVote === 1 ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 8,
            width: 32,
            height: 32,
            cursor: isOwnSolution ? 'default' : 'pointer',
            color: userVote === 1 ? 'var(--accent)' : 'var(--text)',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isOwnSolution ? 0.35 : 1,
            padding: 0,
            boxShadow: 'none',
            transform: 'none',
            transition: 'border-color var(--transition), color var(--transition), background var(--transition)',
          }}
        >▲</button>

        <span style={{
          fontSize: 14,
          fontWeight: 700,
          fontFamily: 'var(--heading)',
          color: score > 0 ? 'var(--accent)' : score < 0 ? '#b91c1c' : 'var(--text)',
          minWidth: 24,
          textAlign: 'center',
          letterSpacing: '-0.3px',
        }}>
          {score}
        </span>

        <button
          onClick={() => vote(-1)}
          disabled={voting || isOwnSolution}
          title={isOwnSolution ? "You can't vote on your own solution" : 'Downvote'}
          style={{
            background: userVote === -1 ? 'rgba(185, 28, 28, 0.07)' : 'transparent',
            border: `1.5px solid ${userVote === -1 ? '#b91c1c' : 'var(--border)'}`,
            borderRadius: 8,
            width: 32,
            height: 32,
            cursor: isOwnSolution ? 'default' : 'pointer',
            color: userVote === -1 ? '#b91c1c' : 'var(--text)',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isOwnSolution ? 0.35 : 1,
            padding: 0,
            boxShadow: 'none',
            transform: 'none',
            transition: 'border-color var(--transition), color var(--transition), background var(--transition)',
          }}
        >▼</button>
      </div>

      {/* Content column */}
      <div style={{ flex: 1, textAlign: 'left' }}>
        {isTop && (
          <p style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--accent)',
            margin: '0 0 7px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            ★ Top solution
          </p>
        )}
        <p style={{ fontSize: 14, color: 'var(--text-h)', lineHeight: 1.7, margin: '0 0 12px' }}>
          {solution.content}
        </p>
        <div style={{
          fontSize: 12,
          color: 'var(--text)',
          display: 'flex',
          gap: 14,
          alignItems: 'center',
        }}>
          <span style={{ fontWeight: 500 }}>by {solution.posted_by}</span>
          <span>{new Date(solution.created_at).toLocaleDateString()}</span>
          {isOwnSolution && (
            <span style={{
              background: 'var(--accent-bg)',
              color: 'var(--accent)',
              fontSize: 11,
              padding: '1px 7px',
              borderRadius: 5,
              fontWeight: 500,
            }}>
              yours
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
