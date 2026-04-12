import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProblemsPage from './pages/ProblemsPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import PostProblemPage from './pages/PostProblemPage';
import PostSolutionPage from './pages/PostSolutionPage';
import GroupPage from './pages/GroupPage'
import CreateGroupPage from './pages/CreateGroupPage';

import { useTranslation } from 'react-i18next';

function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: 32, fontWeight: 500, marginBottom: 12, lineHeight: 1.3 }}>
        {t('home.headline').split('\n').map((line, i) => (
          <span key={i}>{line}{i === 0 && <br />}</span>
        ))}
      </h1>
      <p style={{ fontSize: 16, color: '#555', lineHeight: 1.7, marginBottom: 32 }}>
        {t('home.subheading')}
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/problems')}
          style={{
            background: '#1d4ed8', color: '#fff', border: 'none',
            borderRadius: 8, padding: '10px 22px', fontSize: 14,
            fontWeight: 500, cursor: 'pointer',
          }}
        >
          {t('home.browseProblems')}
        </button>
        <button
          onClick={() => navigate('/register')}
          style={{
            background: 'none', border: '0.5px solid #ccc',
            borderRadius: 8, padding: '10px 22px', fontSize: 14,
            color: '#333', cursor: 'pointer',
          }}
        >
          {t('home.joinTheHive')}
        </button>
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
          <Route path="/groups/:id" element={<GroupPage />} />
          <Route path="/problems/:id/groups/new" element={<CreateGroupPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;