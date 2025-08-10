import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard', { replace: true });
      }
    });
    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    if (isLogin || username.trim().length < 3) {
      setUsernameError('');
      return;
    }

    setIsCheckingUsername(true);
    const handler = setTimeout(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.trim())
        .single();

      if (data) {
        setUsernameError('This username is already taken.');
      } else {
        setUsernameError('');
      }
      setIsCheckingUsername(false);
    }, 500); 

    return () => {
      clearTimeout(handler);
    };
  }, [username, isLogin]);

  useEffect(() => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (isLogin || !isValidEmail) {
      setEmailError('');
      return;
    }

    setIsCheckingEmail(true);
    const handler = setTimeout(async () => {
      const { data, error } = await supabase.rpc('email_exists', {
        email_to_check: email.trim()
      });

      if (error) {
        console.error('Error checking email:', error);
      } else if (data) {
        setEmailError('This email is already registered.');
      } else {
        setEmailError('');
      }
      setIsCheckingEmail(false);
    }, 500); 

    return () => {
      clearTimeout(handler);
    };
  }, [email, isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!isLogin) {
      if (usernameError) {
        setError(usernameError);
        return;
      }
      if (emailError) {
        setError(emailError);
        return;
      }

      const trimmedUsername = username.trim();
      if (trimmedUsername.length < 3) {
        setError('Username must be at least 3 characters long.');
        return;
      }
    }

    try {
      if (isLogin) {
        const { error } = await signIn({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { data, error } = await signUp({ 
          email, 
          password, 
          options: { 
            data: { username: username.trim() },
            emailRedirectTo: `${window.location.origin}/auth`
          } 
        });

        if (error) {
          if (error.message.includes('profiles_username_key')) {
            throw new Error('This username is already taken.');
          }
          throw error;
        }

        if (data && !data.user) {
          setError('This email is already registered. Please log in.');
          return;
        }

        setMessage('Check your email for the confirmation link!');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-primary-green/50 rounded-lg bg-black/30">
      <h1 className="text-3xl text-primary-green mb-6 text-center">[ {isLogin ? 'Login' : 'Sign Up'} ]</h1>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-primary-amber mb-2" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 bg-gray-900 border border-primary-green/30 rounded focus:outline-none focus:border-primary-green"
              required
            />
            {isCheckingUsername && <p className="text-xs text-primary-amber mt-1">Checking...</p>}
            {usernameError && <p className="text-xs text-red-500 mt-1">{usernameError}</p>}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-primary-amber mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 bg-gray-900 border border-primary-green/30 rounded focus:outline-none focus:border-primary-green"
            required
          />
          {!isLogin && isCheckingEmail && <p className="text-xs text-primary-amber mt-1">Checking...</p>}
          {!isLogin && emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
        </div>
        <div className="mb-6">
          <label className="block text-primary-amber mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 bg-gray-900 border border-primary-green/30 rounded focus:outline-none focus:border-primary-green"
            required
          />
        </div>
        <button type="submit" disabled={!isLogin && (!!usernameError || !!emailError)} className="w-full bg-primary-green text-dark-bg font-bold py-2 px-4 rounded hover:bg-primary-amber transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      {message && <p className="text-primary-green mt-4 text-center">{message}</p>}
      <p className="mt-6 text-center">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button onClick={() => setIsLogin(!isLogin)} className="text-primary-amber hover:underline ml-2">
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
