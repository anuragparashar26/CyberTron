import React, { useState } from 'react';
import Quiz from '../components/Quiz';
import quizData from '../data/quizzes.json';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const QuizzesPage = () => {
  const { user, profile, updateProfile } = useAuth();
  const [currentQuizId] = useState('general_security_1'); // Hardcoded for now
  const currentQuiz = quizData[currentQuizId];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(0);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = async () => {
    setIsAnswered(false);
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < currentQuiz.questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setQuizCompleted(true);
      const hasCompletedBefore = profile.completed_quizzes?.includes(currentQuizId);
      
      if (!hasCompletedBefore) {
        const xpGained = score * 50;
        setXpAwarded(xpGained);
        const newXp = profile.xp + xpGained;
        const newCompletedQuizzes = [...(profile.completed_quizzes || []), currentQuizId];
        
        const { error } = await supabase
          .from('profiles')
          .update({ xp: newXp, completed_quizzes: newCompletedQuizzes })
          .eq('id', user.id);
        
        if (!error) {
          updateProfile({ xp: newXp, completed_quizzes: newCompletedQuizzes });
        }
      } else {
        setXpAwarded(0); 
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setIsAnswered(false);
    setXpAwarded(0);
  };

  if (quizCompleted) {
    return (
      <div className="text-center">
        <h1 className="text-3xl text-primary-green mb-4">[ Quiz Completed ]</h1>
        <p className="text-xl mb-4">Your score: {score} / {currentQuiz.questions.length}</p>
        <p className="text-lg text-primary-amber mb-6">
          {xpAwarded > 0 ? `You earned ${xpAwarded} XP!` : 'You have already completed this quiz. No XP awarded.'}
        </p>
        <button onClick={restartQuiz} className="bg-primary-green text-dark-bg font-bold py-2 px-6 rounded hover:bg-primary-amber transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl text-primary-green mb-4">[ {currentQuiz.title} ]</h1>
      <p className="mb-6">Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</p>
      <Quiz
        key={currentQuestionIndex}
        quizData={currentQuiz.questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
      />
      {isAnswered && (
        <button onClick={handleNextQuestion} className="mt-6 w-full bg-primary-amber text-dark-bg font-bold py-2 px-4 rounded hover:bg-primary-green transition-colors">
          {currentQuestionIndex < currentQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      )}
    </div>
  );
};

export default QuizzesPage;
