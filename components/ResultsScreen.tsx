
import React from 'react';
import { QUIZ_LENGTH } from '../constants';

interface ResultsScreenProps {
  score: number;
  onPlayAgain: () => void;
}

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.875 3.75a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.375a.75.75 0 01-.75-.75zM15.375 8.25a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0z" clipRule="evenodd" />
        <path d="M2.25 6.75A.75.75 0 013 6h18a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75V6.75z" />
    </svg>
);

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, onPlayAgain }) => {
    const getMessage = () => {
        const percentage = (score / QUIZ_LENGTH) * 100;
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
        <span className="text-2xl font-semibold text-blue-500 self-end mb-8 ml-1">/{QUIZ_LENGTH}</span>
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
