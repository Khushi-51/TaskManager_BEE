import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Login from './components/Login';
import Register from './components/Register';
import TaskManager from './components/TaskManager';
import './App.css';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [isRegistering, setIsRegistering] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (authToken && userId) {
      // Initialize WebSocket connection
      const newSocket = io('http://localhost:5000', {
        auth: { token: authToken }
      });

      newSocket.emit('join-user', userId);
      setSocket(newSocket);

      return () => newSocket.disconnect();
    }
  }, [authToken, userId]);

  const handleLogin = (token, uid, username) => {
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
    if (socket) socket.disconnect();
    setSocket(null);
  };

  if (!authToken) {
    return (
      <div className="auth-container">
        {isRegistering ? (
          <>
            <Register onRegister={() => setIsRegistering(false)} />
            <p className="auth-switch">
              Already have an account?{' '}
              <button onClick={() => setIsRegistering(false)}>Login</button>
            </p>
          </>
        ) : (
          <>
            <Login onLogin={handleLogin} />
            <p className="auth-switch">
              Don't have an account?{' '}
              <button onClick={() => setIsRegistering(true)}>Register</button>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Manager</h1>
        <div className="header-actions">
          <span className="username">Welcome, {localStorage.getItem('username')}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <TaskManager authToken={authToken} userId={userId} socket={socket} />
    </div>
  );
}

export default App;
