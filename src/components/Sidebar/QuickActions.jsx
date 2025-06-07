import React from 'react';
import { Terminal, Shield, Search, Book } from 'lucide-react';

const QuickActions = ({ onCommand }) => {
    const actions = [
        { icon: Terminal, label: 'Help', command: 'help' },
        { icon: Shield, label: 'Scan', command: 'scan --url example.com' },
        { icon: Search, label: 'Analyze', command: 'analyze malware.bin' },
        { icon: Book, label: 'Quiz', command: 'quiz start' }
    ];

    return (
        <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={() => onCommand(action.command)}
                        className="w-full flex items-center p-2 hover:bg-gray-700 rounded"
                    >
                        <action.icon className="w-4 h-4 mr-2" />
                        <span>{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
