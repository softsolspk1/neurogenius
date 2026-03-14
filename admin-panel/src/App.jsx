
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Questions from './pages/Questions';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <footer style={{ 
            marginTop: '4rem', 
            padding: '2rem 0', 
            borderTop: '1px solid var(--border)', 
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.875rem'
          }}>
            <p>© 2026 Neuro Genius Challenge. All rights reserved.</p>
            <p style={{ fontWeight: 700, marginTop: '0.25rem' }}>Developed By Softsols Pakistan</p>
          </footer>
        </main>
      </div>
    </Router>
  );
}

export default App;
