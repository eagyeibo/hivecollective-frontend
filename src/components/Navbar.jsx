// src/components/Navbar.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  function handleLogout() {
    logout();
    navigate('/');
  }

  function isActive(path) {
    return location.pathname.startsWith(path);
  }

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '0.5px solid #e5e5e5',
      padding: '0 24px',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>

      {/* Left — logo */}
      <div
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <div style={{
          width: 28, height: 28, background: '#1d4ed8', borderRadius: 7,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
        }}>
          ⬡
        </div>
        <span style={{ fontSize: 15, fontWeight: 500, color: '#111' }}>
          HiveCollective
        </span>
      </div>

      {/* Centre — navigation links */}
      <div style={{ display: 'flex', gap: 4 }}>
        <button
          onClick={() => navigate('/problems')}
          style={{
            background: isActive('/problems') ? '#eff6ff' : 'none',
            border: 'none', borderRadius: 8, padding: '6px 14px',
            fontSize: 13,
            fontWeight: isActive('/problems') ? 500 : 400,
            color: isActive('/problems') ? '#1d4ed8' : '#444',
            cursor: 'pointer',
          }}
        >
          {t('nav.problems')}
        </button>
      </div>

      {/* Right — auth controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {isLoggedIn ? (
          <>
            <NotificationBell />
            <span style={{ fontSize: 13, color: '#666' }}>{user.username}</span>
            <button
              onClick={() => navigate('/problems/new')}
              style={{
                background: '#1d4ed8', color: '#fff', border: 'none',
                borderRadius: 8, padding: '7px 14px', fontSize: 13,
                fontWeight: 500, cursor: 'pointer',
              }}
            >
              {t('nav.postProblem')}
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: 'none', border: '0.5px solid #ddd',
                borderRadius: 8, padding: '7px 14px', fontSize: 13,
                color: '#555', cursor: 'pointer',
              }}
            >
              {t('nav.logOut')}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'none', border: '0.5px solid #ddd',
                borderRadius: 8, padding: '7px 14px', fontSize: 13,
                color: '#555', cursor: 'pointer',
              }}
            >
              {t('nav.signIn')}
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{
                background: '#1d4ed8', color: '#fff', border: 'none',
                borderRadius: 8, padding: '7px 14px', fontSize: 13,
                fontWeight: 500, cursor: 'pointer',
              }}
            >
              {t('nav.join')}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
