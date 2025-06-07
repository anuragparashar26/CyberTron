import React, { useState } from 'react';
import { CheckCircle, Circle, XCircle } from 'lucide-react';

const ProgressTracker = ({ gameState, onCommand }) => {
    const [showDetails, setShowDetails] = useState(null);

    const missions = [
        {
            name: 'Complete Tutorial',
            hint: 'Type "help" in the terminal to start',
            requiredScore: 5,
            checkComplete: (state) => state.score >= 5
        },
        {
            name: 'First Scan',
            hint: 'Scan a URL using the scan command',
            requiredScore: 10,
            checkComplete: (state) => state.score >= 10
        },
        {
            name: 'Network Analysis',
            hint: 'Try analyzing network traffic with nmap',
            requiredScore: 15,
            checkComplete: (state) => state.score >= 15
        },
        {
            name: 'Security Quiz',
            hint: 'Complete the security quiz to test your knowledge',
            requiredScore: 25,
            checkComplete: (state) => state.score >= 25
        },
        {
            name: 'CTF Challenge',
            hint: 'Coming soon...',
            requiredScore: 50,
            checkComplete: (state) => false
        }
    ];

    const handleMissionClick = (mission) => {
        if (showDetails === mission.name) {
            setShowDetails(null);
            return;
        }
        setShowDetails(mission.name);
    };

    return (
        <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Progress</h2>
            <div className="space-y-2">
                {missions.map((mission) => (
                    <div key={mission.name} className="space-y-1">
                        <div
                            className="flex items-center cursor-pointer hover:bg-gray-700 p-1 rounded"
                            onClick={() => handleMissionClick(mission)}
                        >
                            {gameState.completedMissions.includes(mission.name) ? (
                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                            ) : gameState.score >= mission.requiredScore ? (
                                <Circle className="w-4 h-4 mr-2 text-yellow-500" />
                            ) : (
                                <XCircle className="w-4 h-4 mr-2 text-gray-500" />
                            )}
                            <span>{mission.name}</span>
                        </div>
                        {showDetails === mission.name && (
                            <div className="ml-6 text-sm text-gray-400">
                                <p>{mission.hint}</p>
                                {mission.requiredScore > 0 && (
                                    <p className="text-xs mt-1">
                                        Required score: {mission.requiredScore} points
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressTracker;
