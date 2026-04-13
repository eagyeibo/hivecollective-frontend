// src/components/NotificationBell.jsx
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../config';

export default function NotificationBell() {
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (isLoggedIn) fetchNotifications();
  }, [isLoggedIn]);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch(`${API}/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notifications);
        setUnreadCount(data.unread_count);
      }
    } catch (err) {
      console.error('Fetch notifications error:', err);
    }
  }

  async function markRead(notifId) {
    await fetch(`${API}/notifications/${notifId}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }

  async function markAllRead() {
    await fetch(`${API}/notifications/read-all`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }

  if (!isLoggedIn) return null;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        onClick={() => { setOpen(!open); if (!open) fetchNotifications(); }}
        style={{
          background: open ? 'var(--accent-bg)' : 'transparent',
          border: `1px solid ${open ? 'var(--accent-border)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          width: 36, height: 36,
          cursor: 'pointer',
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
          padding: 0,
          boxShadow: 'none',
          color: open ? 'var(--accent)' : 'var(--text)',
          transition: 'background var(--transition), border-color var(--transition)',
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -5, right: -5,
            background: 'var(--accent)', color: '#fff',
            borderRadius: '50%',
            width: 18, height: 18,
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--bg)',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="notif-dropdown"
          style={{
            position: 'absolute', right: 0, top: 44,
            width: 320,
            background: 'var(--surface-raised)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            zIndex: 200,
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            animation: 'fadeUp 0.2s ease both',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'var(--accent-bg)',
          }}>
            <span style={{
              fontSize: 13, fontWeight: 700,
              fontFamily: 'var(--heading)', color: 'var(--text-h)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              ⬡ Notifications
              {unreadCount > 0 && (
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  background: 'var(--accent)', color: '#fff',
                  padding: '1px 6px', borderRadius: 10,
                }}>
                  {unreadCount}
                </span>
              )}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  fontSize: 12, color: 'var(--accent)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '2px 0', boxShadow: 'none',
                  fontWeight: 600, transform: 'none',
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {notifications.length === 0 && (
              <div style={{ padding: '28px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.2 }}>⬡</div>
                <p style={{ fontSize: 13, color: 'var(--text)', margin: 0 }}>
                  No notifications yet.
                </p>
              </div>
            )}
            {notifications.map(n => (
              <div
                key={n.id}
                className={`notif-item ${!n.is_read ? 'notif-item-unread' : ''}`}
                onClick={() => { if (!n.is_read) markRead(n.id); setOpen(false); }}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border)',
                  background: n.is_read ? 'transparent' : 'var(--accent-bg)',
                  cursor: 'pointer',
                  transition: 'background var(--transition)',
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--code-bg)'}
                onMouseLeave={e => e.currentTarget.style.background = n.is_read ? 'transparent' : 'var(--accent-bg)'}
              >
                {!n.is_read && (
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: 'var(--accent)', flexShrink: 0, marginTop: 5,
                  }} />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-h)', margin: '0 0 4px', lineHeight: 1.5 }}>
                    {n.message}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text)', margin: 0 }}>
                    {new Date(n.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
