import { useState, useEffect } from 'react';

const useGameState = () => {
    const [gameState, setGameState] = useState({
        score: 0,
        level: 1,
        badges: [],
        completedMissions: [],
        currentQuiz: null,
        quizScore: 0,
        ctfFlags: [],
        experience: 0
    });

    const [scanHistory, setScanHistory] = useState([]);
    useEffect(() => {
        const saved = localStorage.getItem('cybertron-progress');
        if (saved) {
            try {
                setGameState(JSON.parse(saved));
            } catch (e) {
                console.warn('Failed to load saved progress');
            }
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('cybertron-progress', JSON.stringify(gameState));
    }, [gameState]);

    const addScore = (points) => {
        setGameState(prev => {
            const newScore = prev.score + points;
            const newLevel = Math.floor(newScore / 100) + 1;
            return {
                ...prev,
                score: newScore,
                level: newLevel,
                experience: prev.experience + points
            };
        });
    };

    const addBadge = (badge) => {
        setGameState(prev => ({
            ...prev,
            badges: [...prev.badges, badge]
        }));
    };

    const updateQuiz = (quiz) => {
        setGameState(prev => ({
            ...prev,
            currentQuiz: quiz
        }));
    };

    const updateLastLine = (content) => {
        setGameState(prev => ({
            ...prev,
            lastOutput: content
        }));
    };

    const addScanHistory = (entry) => {
        setScanHistory(prev => [...prev, entry]);
    };

    const awardBadge = (badge) => {
        if (!gameState.badges.includes(badge)) {
            setGameState(prev => ({
                ...prev,
                badges: [...prev.badges, badge]
            }));
        }
    };

    return {
        gameState,
        setGameState,
        addScore,
        addBadge,
        updateQuiz,
        updateLastLine,
        scanHistory,
        addScanHistory,
        awardBadge
    };
};

export default useGameState;