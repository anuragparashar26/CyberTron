import React from 'react';
import { Trophy, Star, Award } from 'lucide-react';

const StatusPanel = ({ gameState }) => {
    return (
        <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Status</h2>
            <div className="space-y-3">
                <div className="flex items-center">
                    <Trophy className="w-4 h-4 mr-2" />
                    <span>Level: {gameState.level}</span>
                </div>
                <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    <span>Score: {gameState.score}</span>
                </div>
                <div className="flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    <span>XP: {gameState.experience}</span>
                </div>
            </div>
        </div>
    );
};

export default StatusPanel;
