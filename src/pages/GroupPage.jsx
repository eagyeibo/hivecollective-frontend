// src/pages/GroupPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../config';

// Hexagonal avatar using clip-path
function HexAvatar({ username, isMod }) {
  const initials = username.slice(0, 2).toUpperCase();
  const colors = isMod
    ? { bg: 'linear-gradient(135deg, var(--accent), var(--accent-2))', text: '#fff' }
    : { bg: 'var(--accent-bg)', text: 'var(--accent)' };

  return (
    <div style={{
      width: 36, height: 36,
      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      background: colors.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: 700, color: colors.text,
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

// Small honeycomb strip for the group header
function HexStrip() {
  const R = 14;
  const W = R * 1.7321;
  const rowH = R * 1.5;
  function pts(cx, cy) {
    return Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${(cx + R * Math.cos(a)).toFixed(1)},${(cy + R * Math.sin(a)).toFixed(1)}`;
    }).join(' ');
  }
  const hexes = [];
  for (let row = 0; row < 3; row++) {
    const offset = row % 2 === 1 ? W / 2 : 0;
    for (let col = 0; col < 8; col++) {
      hexes.push({ p: pts(col * W + offset, row * rowH), filled: (row + col) % 5 === 0 });
    }
  }
  return (
    <svg aria-hidden="true"
      style={{ position: 'absolute', bottom: 0, right: 0, opacity: 0.15, pointerEvents: 'none' }}
      width="160" height="65" viewBox="0 0 160 65"
    >
      {hexes.map(({ p, filled }, i) => (
        <polygon key={i} points={p}
          fill={filled ? 'var(--honey)' : 'none'}
          fillOpacity={filled ? 0.6 : 0}
          stroke="var(--honey)" strokeWidth="1.2"
        />
      ))}
    </svg>
  );
}

export default function GroupPage() {
  const { id } = useParams();
  const { token, user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);

  const isMember = members.some(m => m.id === user?.id);
  const isModerator = members.some(m => m.id === user?.id && m.role === 'moderator');

  useEffect(() => { fetchGroup(); }, [id]);

  async function fetchGroup() {
    try {
      const res = await fetch(`${API}/groups/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGroup(data.group);
      setMembers(data.members);
    } catch {
      setError('Could not load group.');
    } finally {
      setLoading(false);
    }
  }

  async function joinGroup() {
    setJoining(true);
    try {
      const res = await fetch(`${API}/groups/${id}/join`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) fetchGroup();
      else setError(data.error);
    } finally {
      setJoining(false);
    }
  }

  async function leaveGroup() {
    try {
      const res = await fetch(`${API}/groups/${id}/leave`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) fetchGroup();
    } catch {
      setError('Could not leave group.');
    }
  }

  async function assignModerator(userId) {
    try {
      const res = await fetch(`${API}/groups/${id}/moderators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      if (res.ok) fetchGroup();
      else setError(data.error);
    } catch {
      setError('Could not assign moderator.');
    }
  }

  if (loading) return <p style={{ padding: 40, color: 'var(--text)', fontSize: 13 }}>Loading…</p>;
  if (error)   return <p style={{ padding: 40, color: '#b91c1c', fontSize: 13 }}>{error}</p>;
  if (!group)  return null;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px', textAlign: 'left' }}>

      <button
        onClick={() => navigate(`/problems/${group.problem_id}`)}
        style={{
          marginBottom: 24, fontSize: 13,
          background: 'transparent', color: 'var(--text)',
          border: '1px solid var(--border)', boxShadow: 'none', padding: '7px 14px',
        }}
      >
        ← Back to problem
      </button>

      {/* Group header card */}
      <div style={{
        background: 'var(--surface-raised)',
        border: '1px solid var(--border)',
        borderTop: '3px solid var(--honey)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 26px',
        marginBottom: 24,
        boxShadow: 'var(--shadow)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <HexStrip />

        {/* Group icon + name */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
          <div style={{
            width: 48, height: 48,
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            background: 'linear-gradient(135deg, var(--honey), var(--emerald))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, color: '#fff', flexShrink: 0,
          }}>⬡</div>
          <div>
            <h1 style={{
              fontSize: 20, fontWeight: 700, margin: '0 0 5px',
              fontFamily: 'var(--heading)', letterSpacing: '-0.3px', color: 'var(--text-h)',
            }}>
              {group.name}
            </h1>
            {group.description && (
              <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
                {group.description}
              </p>
            )}
          </div>
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18, alignItems: 'center' }}>
          <span style={{
            fontSize: 12, padding: '3px 10px', borderRadius: 20,
            background: 'var(--honey-bg)', color: 'var(--honey)',
            border: '1px solid var(--honey-border)', fontWeight: 600,
          }}>
            {members.length} member{members.length !== 1 ? 's' : ''}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text)' }}>
            Created by <strong style={{ color: 'var(--text-h)' }}>{group.created_by}</strong>
          </span>
          <span
            onClick={() => navigate(`/problems/${group.problem_id}`)}
            style={{
              fontSize: 12, color: 'var(--accent)', cursor: 'pointer', fontWeight: 500,
              textDecoration: 'underline', textDecorationColor: 'var(--accent-border)',
              textUnderlineOffset: 3,
            }}
          >
            ⬡ {group.problem_title}
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {isLoggedIn && !isMember && (
            <button onClick={joinGroup} disabled={joining}>
              {joining ? 'Joining…' : 'Join this group'}
            </button>
          )}
          {isLoggedIn && isMember && !isModerator && (
            <button
              onClick={leaveGroup}
              style={{
                background: 'transparent', color: 'var(--text)',
                border: '1px solid var(--border)', boxShadow: 'none',
              }}
            >
              Leave group
            </button>
          )}
          {isModerator && (
            <span style={{
              fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
              background: 'var(--accent-bg)', color: 'var(--accent)',
              border: '1px solid var(--accent-border)',
            }}>
              ★ Moderator
            </span>
          )}
        </div>
      </div>

      {/* Members section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <polygon points="7,1 13,4 13,10 7,13 1,10 1,4"
            fill="var(--accent)" fillOpacity="0.18"
            stroke="var(--accent)" strokeWidth="1.5" />
        </svg>
        <h2 style={{
          fontSize: 15, fontWeight: 700, margin: 0,
          fontFamily: 'var(--heading)', color: 'var(--text-h)',
        }}>
          Members ({members.length})
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {members.map(member => {
          const isMod = member.role === 'moderator';
          return (
            <div key={member.id} style={{
              background: 'var(--surface-raised)',
              border: `1px solid ${isMod ? 'var(--accent-border)' : 'var(--border)'}`,
              borderLeft: `3px solid ${isMod ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '12px 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'box-shadow var(--transition)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <HexAvatar username={member.username} isMod={isMod} />
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-h)' }}>
                    {member.username}
                  </span>
                  {isMod && (
                    <span style={{
                      marginLeft: 8, fontSize: 11, padding: '1px 8px', borderRadius: 20,
                      background: 'var(--accent-bg)', color: 'var(--accent)',
                      border: '1px solid var(--accent-border)', fontWeight: 700,
                    }}>
                      mod
                    </span>
                  )}
                </div>
              </div>

              {isModerator && !isMod && member.id !== user.id && (
                <button
                  onClick={() => assignModerator(member.id)}
                  style={{
                    fontSize: 12, padding: '5px 12px',
                    background: 'transparent', color: 'var(--text)',
                    border: '1px solid var(--border)', boxShadow: 'none',
                  }}
                >
                  Make moderator
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
