// ─────────────────────────────────────────────────────────────
// src/pages/GroupPage.jsx
// Shows group details, members, and moderator controls
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import API from '../config';

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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      setError('Could not assign moderator.');
    }
  }

  if (loading) return <p style={{ padding: 40, color: '#666', fontSize: 13 }}>Loading…</p>;
  if (error) return <p style={{ padding: 40, color: '#b91c1c', fontSize: 13 }}>{error}</p>;
  if (!group) return null;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 20px' }}>
      <button onClick={() => navigate(`/problems/${group.problem_id}`)} style={{ marginBottom: 20, fontSize: 13 }}>
        ← Back to problem
      </button>

      <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 12, padding: '20px 22px', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, margin: '0 0 6px' }}>{group.name}</h1>
        {group.description && (
          <p style={{ fontSize: 14, color: '#555', margin: '0 0 12px', lineHeight: 1.6 }}>{group.description}</p>
        )}
        <p style={{ fontSize: 12, color: '#888', margin: '0 0 16px' }}>
          Focused on: <span
            style={{ color: '#1d4ed8', cursor: 'pointer' }}
            onClick={() => navigate(`/problems/${group.problem_id}`)}
          >{group.problem_title}</span>
          {' · '}{members.length} member{members.length !== 1 ? 's' : ''}
          {' · '}Created by {group.created_by}
        </p>

        {isLoggedIn && !isMember && (
          <button onClick={joinGroup} disabled={joining}>
            {joining ? 'Joining…' : 'Join this group'}
          </button>
        )}
        {isLoggedIn && isMember && !isModerator && (
          <button onClick={leaveGroup} style={{ background: 'none', border: '0.5px solid #ddd', color: '#666' }}>
            Leave group
          </button>
        )}
        {isModerator && (
          <span style={{ fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 20, background: '#eff6ff', color: '#1d4ed8' }}>
            Moderator
          </span>
        )}
      </div>

      <h2 style={{ fontSize: 15, fontWeight: 500, margin: '0 0 12px' }}>Members ({members.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {members.map(member => (
          <div key={member.id} style={{
            background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 10,
            padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: '#eff6ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 500, color: '#1d4ed8'
              }}>
                {member.username.slice(0, 2).toUpperCase()}
              </div>
              <span style={{ fontSize: 13, color: '#333' }}>{member.username}</span>
              {member.role === 'moderator' && (
                <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 20, background: '#eff6ff', color: '#1d4ed8', fontWeight: 500 }}>
                  mod
                </span>
              )}
            </div>
            {isModerator && member.role !== 'moderator' && member.id !== user.id && (
              <button
                onClick={() => assignModerator(member.id)}
                style={{ fontSize: 12, padding: '4px 10px', background: 'none', border: '0.5px solid #ddd', borderRadius: 7, color: '#555', cursor: 'pointer' }}
              >
                Make moderator
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}