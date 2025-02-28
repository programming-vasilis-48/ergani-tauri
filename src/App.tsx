import React, { useState, useEffect } from 'react';
import { AppStateProvider, useAppState } from './hooks/useAppState';
import './App.css';

// Components
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProcessingForm from './components/ProcessingForm';
import DataDisplay from './components/DataDisplay';
import ErrorDisplay from './components/ErrorDisplay';
import LoadingIndicator from './components/LoadingIndicator';

function AppContent(): JSX.Element {
  const { data: { darkMode, user }, setState } = useAppState();
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // Load dark mode preference and user state
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedUser = localStorage.getItem('currentUser');
    
    setState({
      darkMode: savedDarkMode,
      user: savedUser ? JSON.parse(savedUser) : null
    });

    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []); // Empty dependency array means this runs once on mount

  // Save user state when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setState({ darkMode: newDarkMode });
    localStorage.setItem('darkMode', String(newDarkMode));
    document.body.classList.toggle('dark-mode', newDarkMode);
  };

  const handleLogout = () => {
    setState({ user: null });
    localStorage.removeItem('currentUser');
  };

  return (
    <div className="container">
      <header>
        <h1>Ergani Schedule Manager</h1>
        <div className="d-flex gap-2">
          {user && (
            <button
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
          <button
            id="toggleNightMode"
            className="btn btn-outline-secondary"
            onClick={toggleDarkMode}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </header>

      <ErrorDisplay />
      <LoadingIndicator />

      {!user ? (
        showRegister ? (
          <RegisterForm onBackToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginForm onShowRegister={() => setShowRegister(true)} />
        )
      ) : (
        <>
          <ProcessingForm />
          <DataDisplay />
        </>
      )}
    </div>
  );
}

function App(): JSX.Element {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
}

export default App; 