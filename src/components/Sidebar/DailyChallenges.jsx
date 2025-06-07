import React from 'react';

const DailyChallenges = ({ challenges }) => {
    return (
        <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Daily Challenges</h2>
            <div className="space-y-2">
                {challenges.map((challenge, index) => (
                    <div key={index} className="flex justify-between">
                        <span>{challenge.name}</span>
                        <span>{challenge.reward} pts</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DailyChallenges;
