import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import badges from '../data/badges.json';

const ProfilePage = () => {
  const { user, profile, updateProfile } = useAuth();
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const updates = {
      id: user.id,
      username,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      updateProfile({ username, avatar_url: avatarUrl });
      setMessage('Profile updated successfully!');
    }
    setLoading(false);
  };

  const earnedBadges = profile ? badges.filter(badge => profile.xp >= badge.xp) : [];

  return (
    <div>
      <h1 className="text-3xl text-primary-green mb-4">[ User Profile ]</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl text-primary-amber mb-4">Current Info</h2>
          {user && profile ? (
            <div className="space-y-2">
              <p><span className="text-primary-amber">Username:</span> {profile.username}</p>
              <p><span className="text-primary-amber">Email:</span> {user.email}</p>
              <p><span className="text-primary-amber">XP:</span> {profile.xp}</p>
              
              <div className="pt-4">
                <h3 className="text-lg text-primary-amber mb-2">Badges</h3>
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
                  <p className="text-gray-500">// No badges earned yet. //</p>
                )}
              </div>
              <div className="pt-4">
                <h3 className="text-lg text-primary-amber mb-2">Recent Scans</h3>
                {profile.scan_history && profile.scan_history.length > 0 ? (
                  <div className="text-xs space-y-2">
                    {profile.scan_history.map((scan, index) => (
                      <div key={index} className="bg-black/20 p-2 rounded">
                        <p><span className="font-bold">{scan.type}:</span> {scan.item}</p>
                        <p>Malicious: <span className="text-red-500">{scan.result.malicious}</span>, Suspicious: <span className="text-primary-amber">{scan.result.suspicious}</span></p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">// No scan history. //</p>
                )}
              </div>
            </div>
          ) : (
            <p>Loading user profile...</p>
          )}
        </div>
        <div className="border border-primary-green/50 rounded-lg p-6 bg-black/30">
          <h2 className="text-xl text-primary-amber mb-4">Update Profile</h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label className="block text-light-gray mb-2" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 bg-gray-900 border border-primary-green/30 rounded focus:outline-none focus:border-primary-green"
              />
            </div>
            <div className="mb-6">
              <label className="block text-light-gray mb-2" htmlFor="avatar_url">Avatar URL</label>
              <input
                id="avatar_url"
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full p-2 bg-gray-900 border border-primary-green/30 rounded focus:outline-none focus:border-primary-green"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary-green text-dark-bg font-bold py-2 px-4 rounded hover:bg-primary-amber transition-colors disabled:bg-gray-500">
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
          {message && <p className="mt-4 text-center text-primary-green">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
