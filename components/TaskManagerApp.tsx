'use client';

import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import TaskManager from './TaskManager';
import './styles.css';

export default function TaskManagerApp() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  // Default to false so the UI renders even if client JS fails to hydrate
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const id = localStorage.getItem('userId');
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (token && id) {
      setAuthToken(token);
      setUserId(id);
    }
    setDarkMode(savedDarkMode);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const handleLogin = (token: string, uid: string, username: string) => {
    setAuthToken(token);
    setUserId(uid);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', uid);
    localStorage.setItem('username', username);
    setIsRegistering(false);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUserId(null);
    localStorage.clear();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: '#6366f1' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          Loading...
        </div>
      </div>
    );
  }

  if (!authToken) {
    return (
      <div className="auth-page">
        {isRegistering ? (
          <>
            <Register onRegister={() => setIsRegistering(false)} />
            <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <button onClick={() => setIsRegistering(false)} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>
                Sign In
              </button>
            </div>
          </>
        ) : (
          <>
            <Login onLogin={handleLogin} />
            <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <button onClick={() => setIsRegistering(true)} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>
                Sign Up
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`app-wrapper ${darkMode ? 'dark' : 'light'}`}>
      <header className="modern-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="app-title">
              <span className="title-icon">✓</span>
              TaskFlow
            </h1>
          </div>
          <div className="header-right">
            <span className="user-greeting">Welcome, <strong>{localStorage.getItem('username')}</strong></span>
            <button 
              className="theme-toggle-btn" 
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle theme"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <TaskManager authToken={authToken} userId={userId!} />
      </main>
    </div>
  );
}
