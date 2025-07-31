
import React, { useState, useEffect, useCallback } from 'react';
import { GameState } from './types';
import type { QuizQuestion, QuestionWithImage } from './types';
import { QUIZ_LENGTH } from './constants';
import * as geminiService from './services/geminiService';
import StartScreen from './components/StartScreen';
import ResultsScreen from './components/ResultsScreen';
import QuizCard from './components/QuizCard';
import Spinner from './components/Spinner';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.START);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionWithImage, setCurrentQuestionWithImage] = useState<QuestionWithImage | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const fetchAndSetImageForCurrentQuestion = useCallback(async () => {
        if (questions.length > 0 && currentQuestionIndex < questions.length) {
            setGameState(GameState.LOADING_IMAGE);
            try {
                const imageUrl = await geminiService.generateQuizImage(questions[currentQuestionIndex].questionText);
                setCurrentQuestionWithImage({
                    ...questions[currentQuestionIndex],
                    imageUrl,
                });
                setGameState(GameState.PLAYING);
            } catch (err) {
                console.error(err);
                setError("Sorry, I couldn't create an image for the question.");
                setGameState(GameState.ERROR);
            }
        }
    }, [questions, currentQuestionIndex]);

    useEffect(() => {
        if (gameState === GameState.LOADING_QUESTIONS && questions.length > 0) {
            fetchAndSetImageForCurrentQuestion();
        }
    }, [gameState, questions, fetchAndSetImageForCurrentQuestion]);

    const handleStart = useCallback(async () => {
        setGameState(GameState.LOADING_QUESTIONS);
        setError(null);
        try {
            const data = await geminiService.generateQuizQuestions();
            setQuestions(data.questions);
            // The useEffect above will trigger the image loading
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            setGameState(GameState.ERROR);
        }
    }, []);

    const resetGame = useCallback(() => {
        setGameState(GameState.START);
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setScore(0);
        setError(null);
        setCurrentQuestionWithImage(null);
    }, []);

    const handleAnswer = (isCorrect: boolean) => {
        if (isCorrect) {
            setScore(prev => prev + 1);
        }
        setGameState(GameState.SHOWING_ANSWER);
    };

    const handleNext = () => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < QUIZ_LENGTH) {
            setCurrentQuestionIndex(nextIndex);
            setGameState(GameState.LOADING_QUESTIONS); // Re-use this state to trigger useEffect
        } else {
            setGameState(GameState.FINISHED);
        }
    };

    const renderContent = () => {
        switch (gameState) {
            case GameState.START:
                return <StartScreen onStart={handleStart} />;
            case GameState.LOADING_QUESTIONS:
                return <Spinner text="Creating your quiz..." />;
            case GameState.LOADING_IMAGE:
                 return <Spinner text="Painting a picture for you..." />;
            case GameState.PLAYING:
            case GameState.SHOWING_ANSWER:
                if (!currentQuestionWithImage) {
                    return <Spinner text="Getting question ready..." />;
                }
                return (
                    <QuizCard
                        question={currentQuestionWithImage}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={QUIZ_LENGTH}
                        onAnswer={handleAnswer}
                        onNext={handleNext}
                        isAnswered={gameState === GameState.SHOWING_ANSWER}
                    />
                );
            case GameState.FINISHED:
                return <ResultsScreen score={score} onPlayAgain={resetGame} />;
            case GameState.ERROR:
                return (
                    <div className="text-center bg-white p-8 rounded-3xl shadow-lg">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong.</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button onClick={resetGame} className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg">
                            Try Again
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-blue-200 via-cyan-100 to-yellow-100">
            <main className="w-full">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;
