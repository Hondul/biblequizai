
import React, { useState, useEffect } from 'react';
import type { QuestionWithImage } from '../types';

interface QuizCardProps {
  question: QuestionWithImage;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => Promise<void>;
  isAnswered: boolean;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const QuizCard: React.FC<QuizCardProps> = ({ question, questionNumber, totalQuestions, onAnswer, onNext, isAnswered }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    useEffect(() => {
        setSelectedAnswer(null);
    }, [question]);

    const handleOptionClick = (option: string) => {
        if (selectedAnswer) return;
        setSelectedAnswer(option);
        const isCorrect = option === question.correctAnswer;
        onAnswer(isCorrect);
    };

    const getButtonClass = (option: string) => {
        if (!isAnswered) {
            return 'bg-white hover:bg-blue-50';
        }
        if (option === question.correctAnswer) {
            return 'bg-green-200 border-green-500 animate-pulse';
        }
        if (option === selectedAnswer && option !== question.correctAnswer) {
            return 'bg-red-200 border-red-500';
        }
        return 'bg-gray-100 text-gray-500';
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-lg mx-auto flex flex-col">
            <div className="text-center mb-4">
                <p className="text-xl font-semibold text-blue-500">Question {questionNumber} / {totalQuestions}</p>
            </div>
            
            <div className="w-full aspect-square bg-gray-100 rounded-2xl mb-6 overflow-hidden flex items-center justify-center border-4 border-gray-200">
                <img src={question.imageUrl} alt="Quiz question illustration" className="w-full h-full object-cover" />
            </div>

            <p className="text-2xl font-bold text-gray-800 text-center mb-6 min-h-[6rem] flex items-center justify-center">
                {question.questionText}
            </p>

            <div className="grid grid-cols-1 gap-4 mb-6">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        disabled={isAnswered}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${getButtonClass(option)}`}
                    >
                        <span className="text-lg font-semibold text-gray-700">{option}</span>
                        {isAnswered && option === question.correctAnswer && <span className="text-green-600"><CheckIcon /></span>}
                        {isAnswered && option === selectedAnswer && option !== question.correctAnswer && <span className="text-red-600"><XIcon /></span>}
                    </button>
                ))}
            </div>

            {isAnswered && (
                <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6 text-yellow-800">
                    <p className="font-bold">Did you know?</p>
                    <p>{question.funFact}</p>
                </div>
            )}

            {isAnswered && (
                <button
                    onClick={onNext}
                    className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-xl text-xl hover:bg-blue-600 transition-colors duration-300 shadow-md"
                >
                    Next
                </button>
            )}
        </div>
    );
};

export default QuizCard;
