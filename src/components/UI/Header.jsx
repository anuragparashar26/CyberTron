import React from 'react';
import { Terminal, Shield, User } from 'lucide-react';

const Header = ({ gameState }) => {
    return (
        <header className="bg-gray-800 border-b border-gray-700 h-20">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Terminal className="w-8 h-8" />
                    <h1 className="text-xl font-bold">CyberTron Terminal</h1>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5" />
                        <span>Level {gameState.level}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>user@cybertron</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
