import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import Leaderboard from '../components/Leaderboard';
import badges from '../data/badges.json';
import challenges from '../data/challenges.json';

const Dashboard = () => {
  const { access_token } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, xp')
        .order('xp', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching leaderboard:', error);
      } else {
        setLeaderboardData(data);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (access_token) {
      // Remove the access token from URL by navigating to clean dashboard URL
      navigate('/dashboard', { replace: true });
    }
  }, [access_token, navigate]);

  if (!profile) {
    return <p>Loading dashboard...</p>;
  }

  const earnedBadges = badges.filter(badge => profile.xp >= badge.xp);

  return (
    <div>
      <h1 className="text-3xl text-primary-green mb-6">[ User Dashboard ]</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border border-primary-green/50 rounded-lg p-4 bg-black/30">
          <h2 className="text-xl text-primary-amber mb-2">My Stats</h2>
          <p><span className="font-bold">User:</span> {profile.username}</p>
          <p><span className="font-bold">XP:</span> {profile.xp}</p>
        </div>
        <div className="border border-primary-green/50 rounded-lg p-4 bg-black/30 md:col-span-2">
          <h2 className="text-xl text-primary-amber mb-2">Achievements</h2>
          {earnedBadges.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {earnedBadges.map(badge => (
                <div key={badge.name} className="text-center" title={`${badge.name}: ${badge.description}`}>
                  <span className="text-4xl">{badge.icon}</span>
                  <p className="text-xs">{badge.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">// No badges earned yet. Keep learning! //</p>
          )}
        </div>
      </div>

      <div className="border border-primary-green/50 rounded-lg p-4 bg-black/30 mb-8">
        <h2 className="text-2xl text-primary-amber mb-4">[ Available Challenges ]</h2>
        <div className="space-y-4">
          {challenges.map(challenge => (
            <div key={challenge.id} className="border-b border-primary-green/10 pb-2 last:border-b-0">
              <h3 className="text-lg text-primary-green">{challenge.title}</h3>
              <p className="text-sm text-light-gray mb-1">{challenge.description}</p>
              <p className="text-xs text-primary-amber">To start, type: <span className="font-bold bg-black/50 px-1 py-0.5 rounded">challenge {challenge.id}</span></p>
            </div>
          ))}
        </div>
      </div>

      {loading ? <p>Loading leaderboard...</p> : <Leaderboard profiles={leaderboardData} />}
    </div>
  );
};

export default Dashboard;
