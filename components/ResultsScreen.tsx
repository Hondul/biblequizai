
import React from 'react';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
}

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M16.5 3A3.75 3.75 0 0012.75 0H11.25A3.75 3.75 0 007.5 3.75H4.5A3 3 0 001.5 6.75v10.5A3 3 0 004.5 20.25h15a3 3 0 003-3V6.75a3 3 0 00-3-3H16.5zm-3-1.5a2.25 2.25 0 012.25 2.25H11.25a2.25 2.25 0 012.25-2.25zM4.5 18V6.75a1.5 1.5 0 011.5-1.5h1.528a3.734 3.734 0 00.41 1.5H5.25a.75.75 0 000 1.5h13.5a.75.75 0 000-1.5h-2.688a3.734 3.734 0 00.41-1.5H18a1.5 1.5 0 011.5 1.5V18a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 014.5 18z" clipRule="evenodd" />
    </svg>
);


const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, totalQuestions, onPlayAgain }) => {
    const getMessage = () => {
        if (totalQuestions === 0) return "Good Try!";
        const percentage = (score / totalQuestions) * 100;
        if (percentage === 100) return "Wow! Perfect Score!";
        if (percentage >= 75) return "Amazing Job!";
        if (percentage >= 50) return "Great Effort!";
        return "Good Try!";
    }

  return (
    <div className="text-center bg-white p-8 rounded-3xl shadow-lg w-full max-w-md mx-auto flex flex-col items-center">
      <TrophyIcon className="w-24 h-24 text-yellow-400 mb-4" />
      <h1 className="text-4xl font-bold text-blue-600 mb-2" style={{fontFamily: 'Comic Sans MS, cursive'}}>
        {getMessage()}
      </h1>
      <p className="text-gray-700 text-2xl mb-4">
        You answered
      </p>
      <div className="bg-blue-100 rounded-full w-40 h-40 flex items-center justify-center mb-6 border-4 border-blue-200">
        <span className="text-6xl font-bold text-blue-700">{score}</span>
        <span className="text-2xl font-semibold text-blue-500 self-end mb-8 ml-1">/{totalQuestions}</span>
      </div>
      <p className="text-gray-600 mb-8 text-lg">
        You are a Bible superstar!
      </p>
      <button
        onClick={onPlayAgain}
        className="w-full bg-green-500 text-white font-bold py-4 px-8 rounded-xl text-2xl hover:bg-green-600 transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-md"
      >
        Play Again!
      </button>
    </div>
  );
};

export default ResultsScreen;
