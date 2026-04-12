// ─────────────────────────────────────────────────────────────
// src/components/SolutionCard.jsx
// Displays a single solution with upvote/downvote buttons
// Import this into ProblemDetailPage to replace the plain solution list
// ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_VOTE = 'http://localhost:3000/api';

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
    if (isOwnSolution) return; // silently block
    if (voting) return;

    setVoting(true);
    try {
      const res = await fetch(`${API_VOTE}/problems/${problemId}/solutions/${solution.id}/vote`, {
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
      background: isTop ? '#f0fdf4' : '#fff',
      border: `0.5px solid ${isTop ? '#86efac' : '#e5e5e5'}`,
      borderRadius: 12,
      padding: '14px 18px',
      marginBottom: 10,
      display: 'flex',
      gap: 14,
    }}>

      {/* Vote column */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 36 }}>
        <button
          onClick={() => vote(1)}
          disabled={voting || isOwnSolution}
          title={isOwnSolution ? "You can't vote on your own solution" : 'Upvote'}
          style={{
            background: 'none',
            border: `1.5px solid ${userVote === 1 ? '#15803d' : '#ddd'}`,
            borderRadius: 6,
            width: 32,
            height: 32,
            cursor: isOwnSolution ? 'default' : 'pointer',
            color: userVote === 1 ? '#15803d' : '#aaa',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isOwnSolution ? 0.4 : 1,
          }}
        >▲</button>

        <span style={{
          fontSize: 14,
          fontWeight: 500,
          color: score > 0 ? '#15803d' : score < 0 ? '#b91c1c' : '#666',
          minWidth: 24,
          textAlign: 'center',
        }}>
          {score}
        </span>

        <button
          onClick={() => vote(-1)}
          disabled={voting || isOwnSolution}
          title={isOwnSolution ? "You can't vote on your own solution" : 'Downvote'}
          style={{
            background: 'none',
            border: `1.5px solid ${userVote === -1 ? '#b91c1c' : '#ddd'}`,
            borderRadius: 6,
            width: 32,
            height: 32,
            cursor: isOwnSolution ? 'default' : 'pointer',
            color: userVote === -1 ? '#b91c1c' : '#aaa',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isOwnSolution ? 0.4 : 1,
          }}
        >▼</button>
      </div>

      {/* Content column */}
      <div style={{ flex: 1 }}>
        {isTop && (
          <p style={{ fontSize: 11, fontWeight: 500, color: '#15803d', margin: '0 0 6px' }}>
            Top solution
          </p>
        )}
        <p style={{ fontSize: 14, color: '#333', lineHeight: 1.7, margin: '0 0 10px' }}>
          {solution.content}
        </p>
        <div style={{ fontSize: 12, color: '#888', display: 'flex', gap: 14 }}>
          <span>by {solution.posted_by}</span>
          <span>{new Date(solution.created_at).toLocaleDateString()}</span>
          {isOwnSolution && <span style={{ color: '#aaa' }}>your solution</span>}
        </div>
      </div>
    </div>
  );
}
