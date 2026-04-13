import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProblemsPage from './pages/ProblemsPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import PostProblemPage from './pages/PostProblemPage';
import PostSolutionPage from './pages/PostSolutionPage';
import GroupPage from './pages/GroupPage';
import CreateGroupPage from './pages/CreateGroupPage';

import { useTranslation } from 'react-i18next';

// ── Animated honeycomb background ────────────────────
function HoneycombGrid({ opacity = 0.07 }) {
  const R = 24;
  const W = R * 1.7321;
  const rowH = R * 1.5;

  function hexPts(cx, cy) {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      pts.push(`${(cx + R * Math.cos(a)).toFixed(1)},${(cy + R * Math.sin(a)).toFixed(1)}`);
    }
    return pts.join(' ');
  }

  const hexes = [];
  for (let row = 0; row <= 14; row++) {
    const offset = row % 2 === 1 ? W / 2 : 0;
    for (let col = 0; col <= 26; col++) {
      hexes.push(hexPts(col * W + offset, row * rowH));
    }
  }

  const filled = [
    { cx: 95,  cy: 88,  color: 'rgba(124,34,240,0.18)',  stroke: 'rgba(124,34,240,0.4)'  },
    { cx: 980, cy: 200, color: 'rgba(245,158,11,0.16)',  stroke: 'rgba(245,158,11,0.4)'  },
    { cx: 180, cy: 440, color: 'rgba(16,185,129,0.15)',  stroke: 'rgba(16,185,129,0.38)' },
    { cx: 860, cy: 480, color: 'rgba(124,34,240,0.13)',  stroke: 'rgba(124,34,240,0.32)' },
    { cx: 540, cy: 520, color: 'rgba(245,158,11,0.13)',  stroke: 'rgba(245,158,11,0.32)' },
    { cx: 330, cy: 80,  color: 'rgba(16,185,129,0.13)',  stroke: 'rgba(16,185,129,0.3)'  },
  ];

  return (
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      viewBox="0 0 1126 600"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Animated grid — breathes slowly */}
      <g style={{ animation: 'hexBreathe 8s ease-in-out infinite' }}>
        {hexes.map((p, i) => (
          <polygon key={i} points={p} fill="none" stroke="var(--accent)" strokeWidth="1" />
        ))}
      </g>

      {/* Filled accent hexes — float with staggered delays */}
      {filled.map(({ cx, cy, color, stroke }, i) => (
        <polygon
          key={`f${i}`}
          points={hexPts(cx, cy)}
          fill={color}
          stroke={stroke}
          strokeWidth="1.5"
          style={{
            animation: `hexFloat ${3.5 + i * 0.7}s ease-in-out infinite`,
            animationDelay: `${i * 0.55}s`,
          }}
        />
      ))}
    </svg>
  );
}

// ── Stat card data ────────────────────────────────────
const STATS = [
  { label: 'Open problems', value: '240+', color: 'var(--accent)',   bg: 'var(--accent-bg)',   border: 'var(--accent-border)'   },
  { label: 'Active solvers', value: '1.2k', color: 'var(--honey)',   bg: 'var(--honey-bg)',    border: 'var(--honey-border)'    },
  { label: 'Groups formed',  value: '89',   color: 'var(--emerald)', bg: 'var(--emerald-bg)',  border: 'var(--emerald-border)'  },
];

function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100svh - 56px)',
      padding: '60px 20px',
      textAlign: 'center',
    }}>

      <HoneycombGrid />

      {/* Glow blobs */}
      <div style={{ position: 'absolute', top: '15%', left: '10%', width: 420, height: 420, background: 'radial-gradient(circle, rgba(124,34,240,0.13) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 340, height: 340, background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '55%', left: '55%', width: 380, height: 260, transform: 'translate(-50%, -50%)', background: 'radial-gradient(ellipse, rgba(16,185,129,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Content — each block fades up with staggered delay */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 660, width: '100%' }}>

        <div style={{
          width: 56, height: 56,
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, color: '#fff',
          margin: '0 auto 30px',
          boxShadow: '0 6px 28px rgba(124,34,240,0.42)',
          animation: 'fadeUp 0.5s ease both',
        }}>⬡</div>

        <h1 style={{
          fontSize: 'clamp(32px, 5.5vw, 64px)',
          fontWeight: 800,
          letterSpacing: '-2.5px',
          lineHeight: 1.06,
          margin: '0 0 22px',
          background: 'linear-gradient(130deg, var(--accent) 0%, var(--accent-2) 52%, var(--emerald) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'fadeUp 0.5s ease both',
          animationDelay: '0.1s',
        }}>
          {t('home.headline').split('\n').map((line, i) => (
            <span key={i}>{line}{i === 0 && <br />}</span>
          ))}
        </h1>

        <p style={{
          fontSize: 18,
          color: 'var(--text)',
          lineHeight: 1.7,
          maxWidth: 460,
          margin: '0 auto 40px',
          animation: 'fadeUp 0.5s ease both',
          animationDelay: '0.2s',
        }}>
          {t('home.subheading')}
        </p>

        <div style={{
          display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
          animation: 'fadeUp 0.5s ease both',
          animationDelay: '0.3s',
        }}>
          <button onClick={() => navigate('/problems')} style={{ padding: '13px 30px', fontSize: 15, fontWeight: 600 }}>
            {t('home.browseProblems')}
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '13px 30px', fontSize: 15, fontWeight: 500,
              background: 'transparent', color: 'var(--text-h)',
              border: '1px solid var(--border)', boxShadow: 'none',
            }}
          >
            {t('home.joinTheHive')}
          </button>
        </div>

        {/* Colored stat cards */}
        <div
          className="stat-row"
          style={{
            display: 'flex', gap: 14, justifyContent: 'center', marginTop: 56,
            flexWrap: 'wrap',
            animation: 'fadeUp 0.5s ease both',
            animationDelay: '0.4s',
          }}
        >
          {STATS.map(stat => (
            <div
              key={stat.label}
              className="stat-card"
              style={{
                textAlign: 'center', padding: '16px 28px',
                background: stat.bg, border: `1px solid ${stat.border}`,
                borderRadius: 'var(--radius-lg)', minWidth: 110,
              }}
            >
              <div style={{
                fontSize: 28, fontWeight: 800, fontFamily: 'var(--heading)',
                color: stat.color, letterSpacing: '-1px', lineHeight: 1.1,
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text)', marginTop: 4, fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"                              element={<HomePage />} />
          <Route path="/register"                      element={<RegisterPage />} />
          <Route path="/login"                         element={<LoginPage />} />
          <Route path="/problems"                      element={<ProblemsPage />} />
          <Route path="/problems/new"                  element={<PostProblemPage />} />
          <Route path="/problems/:id"                  element={<ProblemDetailPage />} />
          <Route path="/problems/:id/solutions/new"    element={<PostSolutionPage />} />
          <Route path="/groups/:id"                    element={<GroupPage />} />
          <Route path="/problems/:id/groups/new"       element={<CreateGroupPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
