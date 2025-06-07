import { useState } from 'react';

const useTerminal = () => {
    const [history, setHistory] = useState([]);
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const addToHistory = (entry) => {
        setHistory(prev => [...prev, entry]);
    };

    const clearHistory = () => {
        setHistory([]);
    };

    const navigateHistory = (direction) => {
        if (commandHistory.length === 0) return null;

        const newIndex = direction === 'up'
            ? Math.min(commandHistory.length - 1, historyIndex + 1)
            : Math.max(-1, historyIndex - 1);

        setHistoryIndex(newIndex);
        return newIndex === -1 ? '' : commandHistory[commandHistory.length - 1 - newIndex];
    };

    return {
        history,
        addToHistory,
        clearHistory,
        navigateHistory,
        commandHistory,
        setCommandHistory
    };
};

export default useTerminal;
