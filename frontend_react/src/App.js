import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from './vendor/react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ProjectsList from './pages/ProjectsList';
import ProjectDetail from './pages/ProjectDetail';
import NewProject from './pages/NewProject';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { clearToken, getMe } from './services/api';

// PUBLIC_INTERFACE
function App() {
  /** Root component sets up theme, routing, and auth state */
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const isAuthed = useMemo(() => !!localStorage.getItem('token'), [user]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Attempt to fetch current user if token exists
    if (localStorage.getItem('token')) {
      getMe().then(setUser).catch(() => setUser(null));
    }
  }, []);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const handleLogout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      <BrowserRouter>
        <Navbar user={user} onLogout={handleLogout} />
        <div style={{ paddingTop: 8 }}>
          <Routes>
            <Route path="/" element={<ProjectsList />} />
            <Route path="/projects" element={<ProjectsList />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route element={<ProtectedRoute isAuthed={isAuthed} />}>
              <Route path="/projects/new" element={<NewProject />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="/login" element={<Login onLoggedIn={setUser} />} />
            <Route path="/register" element={<Register onLoggedIn={setUser} />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
