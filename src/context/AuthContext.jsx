import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const handleAuthChange = async (session) => {
      console.log('Auth state changed:', session ? 'logged in' : 'logged out');
      
      if (!mounted) return;

      try {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) throw error;
          if (mounted) setProfile(profileData);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Error in auth change:', error);
        if (mounted) setProfile(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) handleAuthChange(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(),
    user,
    profile,
    loading, // Expose loading state to consumers like ProtectedRoute
    updateProfile: (newProfileData) => setProfile(prev => ({ ...prev, ...newProfileData })),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

