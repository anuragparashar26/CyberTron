import React from 'react';
import StatusPanel from './StatusPanel';
import ProgressTracker from './ProgressTracker';
import QuickActions from './QuickActions';
import DailyChallenges from './DailyChallenges';

const Sidebar = ({ gameState, onCommand }) => {
    const challenges = [
        { name: 'Scan 3 URLs', reward: 15 },
        { name: 'Complete a Quiz', reward: 20 },
        { name: 'Analyze a File', reward: 10 }
    ];

    return (
        <div className="w-64 bg-gray-800 p-4 border-l border-gray-700 h-full overflow-y-auto">
            <StatusPanel gameState={gameState} />
            <ProgressTracker gameState={gameState} onCommand={onCommand} />
            <QuickActions onCommand={onCommand} />
            <DailyChallenges challenges={challenges} />
        </div>
    );
};

export default Sidebar;
