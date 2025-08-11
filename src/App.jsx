import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import TerminalPage from './pages/TerminalPage';
import QuizzesPage from './pages/QuizzesPage';
import ScanPage from './pages/ScanPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route path=":access_token" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Route>
        <Route path="terminal" element={<ProtectedRoute><TerminalPage /></ProtectedRoute>} />
        <Route path="quizzes" element={<ProtectedRoute><QuizzesPage /></ProtectedRoute>} />
        <Route path="scan" element={<ProtectedRoute><ScanPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
