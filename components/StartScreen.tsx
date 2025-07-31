
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StarIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006z" clipRule="evenodd" />
    </svg>
);


const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center bg-white p-8 rounded-3xl shadow-lg w-full max-w-md mx-auto relative overflow-hidden">
        <StarIcon className="absolute -top-4 -left-4 w-16 h-16 text-yellow-300 transform -rotate-12" />
        <StarIcon className="absolute -bottom-5 -right-5 w-20 h-20 text-yellow-300 transform rotate-12" />
        <StarIcon className="absolute top-10 right-5 w-8 h-8 text-yellow-200 transform rotate-6" />

        <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4" style={{fontFamily: 'Comic Sans MS, cursive'}}>
            Kid's Bible Quiz
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
            Let's see how much you know about the Bible. Are you ready?
        </p>
        <button
            onClick={onStart}
            className="w-full bg-green-500 text-white font-bold py-4 px-8 rounded-xl text-2xl hover:bg-green-600 transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-md"
        >
            Start Quiz!
        </button>
    </div>
  );
};

export default StartScreen;
