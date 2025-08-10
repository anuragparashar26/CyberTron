import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-black/50 border-b border-primary-green/20 p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-primary-green text-2xl font-bold hover:text-primary-amber transition-colors">
            CyberTron
          </Link>
          <div className="flex gap-4 items-center">
            <Link to="/dashboard" className="hover:text-primary-green">[Dashboard]</Link>
            <Link to="/terminal" className="hover:text-primary-green">[Terminal]</Link>
            <Link to="/scan" className="hover:text-primary-green">[Scan]</Link>
            <Link to="/quizzes" className="hover:text-primary-green">[Quizzes]</Link>
            {user ? (
              <>
                <Link to="/profile" className="hover:text-primary-green">[Profile]</Link>
                <button onClick={handleLogout} className="hover:text-primary-amber">[Logout]</button>
              </>
            ) : (
              <Link to="/auth" className="hover:text-primary-green">[Login]</Link>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>
      <footer className="text-center p-4 text-xs text-gray-500 border-t border-primary-green/20">
        CyberTron- An Interactive Learning Platform made with ❤️ by Anurag
      </footer>
    </div>
  );
};

export default Layout;
