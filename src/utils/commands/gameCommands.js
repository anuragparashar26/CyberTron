const quizQuestions = [
    {
        id: 1,
        question: "What does SQL injection exploit?",
        options: ["Database vulnerabilities", "Network protocols", "File systems", "Memory buffers"],
        correct: 0,
        points: 10
    },
    {
        id: 2,
        question: "Which port is commonly used for HTTPS?",
        options: ["80", "443", "22", "21"],
        correct: 1,
        points: 10
    }
];

export const createGameCommands = (gameState, updateGameState) => {
    const quizCommand = (args) => {
        const subCmd = args[0];

        switch (subCmd) {
            case 'start':
                const firstQuestion = quizQuestions[0];
                updateGameState.updateQuiz(firstQuestion);
                return [
                    "🎯 Starting Cybersecurity Quiz!",
                    "═══════════════════════════════",
                    `Question 1: ${firstQuestion.question}`,
                    ...firstQuestion.options.map((opt, idx) => `${idx + 1}. ${opt}`),
                    "",
                    "Use 'quiz answer <number>' to answer (1-4)"
                ];

            case 'answer':
                if (!gameState.currentQuiz) {
                    return ["No active quiz. Use 'quiz start' first."];
                }

                const answerNum = parseInt(args[1]) - 1;
                const isCorrect = answerNum === gameState.currentQuiz.correct;
                const points = isCorrect ? gameState.currentQuiz.points : 0;

                if (isCorrect) {
                    updateGameState.addScore(points);
                }

                return [
                    isCorrect ? "✅ Correct!" : "❌ Incorrect!",
                    `Points earned: ${points}`,
                    `Correct answer: ${gameState.currentQuiz.options[gameState.currentQuiz.correct]}`,
                    "",
                    "Use 'quiz next' for the next question."
                ];

            case 'next':
                const nextQ = quizQuestions.find(q => q.id === (gameState.currentQuiz?.id || 0) + 1);
                if (!nextQ) {
                    return ["Quiz completed! Use 'quiz start' to restart."];
                }

                updateGameState.updateQuiz(nextQ);
                return [
                    `Question ${nextQ.id}: ${nextQ.question}`,
                    ...nextQ.options.map((opt, idx) => `${idx + 1}. ${opt}`),
                    "",
                    "Use 'quiz answer <number>' to answer (1-4)"
                ];

            default:
                return ["Usage: quiz start | quiz answer <1-4> | quiz next"];
        }
    };

    return {
        quiz: quizCommand
    };
};