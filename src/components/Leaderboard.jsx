import React from 'react';

const Leaderboard = ({ profiles }) => {
  return (
    <div className="border border-primary-green/50 rounded-lg p-4 bg-black/30">
      <h2 className="text-2xl text-primary-amber mb-4">[ Leaderboard ]</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-primary-green/20">
            <th className="p-2">Rank</th>
            <th className="p-2">User</th>
            <th className="p-2">XP</th>
          </tr>
        </thead>
        <tbody>
          {profiles && profiles.map((profile, index) => (
            <tr key={profile.username} className="border-b border-primary-green/10">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{profile.username}</td>
              <td className="p-2">{profile.xp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
