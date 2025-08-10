import React, { useState } from 'react';

const Quiz = ({ quizData, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const { question, options, answer, explanation } = quizData;

  const handleOptionSelect = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    const isCorrect = selectedOption === answer;
    onAnswer(isCorrect);
  };

  const getOptionClass = (option) => {
    if (!isAnswered) {
      return selectedOption === option ? 'bg-primary-amber/50' : 'bg-black/30';
    }
    if (option === answer) {
      return 'bg-green-500/50'; 
    }
    if (option === selectedOption && option !== answer) {
      return 'bg-red-500/50'; 
    }
    return 'bg-black/30';
  };

  return (
    <div className="border border-primary-green/50 rounded-lg p-6 bg-black/30">
      <h2 className="text-xl text-primary-amber mb-4">{question}</h2>
      <div className="space-y-3 mb-6">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(option)}
            className={`w-full text-left p-3 rounded transition-colors ${getOptionClass(option)} hover:bg-primary-amber/30`}
            disabled={isAnswered}
          >
            {option}
          </button>
        ))}
      </div>
      {!isAnswered ? (
        <button
          onClick={handleSubmit}
          disabled={selectedOption === null}
          className="w-full bg-primary-green text-dark-bg font-bold py-2 px-4 rounded hover:bg-primary-amber transition-colors disabled:bg-gray-600"
        >
          Submit Answer
        </button>
      ) : (
        <div className="p-4 rounded bg-gray-900/50 border border-primary-green/20">
          <h3 className="font-bold text-lg">{selectedOption === answer ? 'Correct!' : 'Incorrect.'}</h3>
          <p className="mt-2">{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default Quiz;
