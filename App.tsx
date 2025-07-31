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

    useEffect(() => {
        // Safely check for the API key without crashing the app if `process` is undefined.
        const apiKey = (globalThis as any).process?.env?.API_KEY;
        if (!apiKey) {
            setError("Configuration Error: API_KEY is not set. Please ensure the API key is configured correctly in your environment.");
            setGameState(GameState.ERROR);
        }
    }, []);

    const loadAndSetImage = useCallback(async (question: QuizQuestion) => {
        try {
            const imageUrl = await geminiService.generateQuizImage(question.questionText);
            setCurrentQuestionWithImage({
                ...question,
                imageUrl,
            });
            setGameState(GameState.PLAYING);
        } catch (err) {
            console.error(err);
            setError("Sorry, I couldn't create an image for the question.");
            setGameState(GameState.ERROR);
        }
    }, []);

    const handleStart = useCallback(async () => {
        setGameState(GameState.LOADING_QUESTIONS);
        setError(null);
        setCurrentQuestionWithImage(null);
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setScore(0);
        try {
            const data = await geminiService.generateQuizQuestions();
            setQuestions(data.questions);
            setGameState(GameState.LOADING_IMAGE);
            await loadAndSetImage(data.questions[0]);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            setGameState(GameState.ERROR);
        }
    }, [loadAndSetImage]);

    const resetGame = useCallback(() => {
        // Instead of just going to start, we re-check for the API key.
        // If the key is still missing, it will go back to the error state.
        // If the user somehow fixed the environment, it will allow a restart.
        const apiKey = (globalThis as any).process?.env?.API_KEY;
        if (!apiKey) {
            setError("Configuration Error: API_KEY is not set. Please ensure the API key is configured correctly in your environment.");
            setGameState(GameState.ERROR);
        } else {
             setGameState(GameState.START);
             setQuestions([]);
             setCurrentQuestionIndex(0);
             setScore(0);
             setError(null);
             setCurrentQuestionWithImage(null);
        }
    }, []);

    const handleAnswer = (isCorrect: boolean) => {
        if (isCorrect) {
            setScore(prev => prev + 1);
        }
        setGameState(GameState.SHOWING_ANSWER);
    };

    const handleNext = useCallback(async () => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex);
            setGameState(GameState.LOADING_IMAGE);
            await loadAndSetImage(questions[nextIndex]);
        } else {
            setGameState(GameState.FINISHED);
        }
    }, [currentQuestionIndex, questions, loadAndSetImage]);

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
                        totalQuestions={questions.length}
                        onAnswer={handleAnswer}
                        onNext={handleNext}
                        isAnswered={gameState === GameState.SHOWING_ANSWER}
                    />
                );
            case GameState.FINISHED:
                return <ResultsScreen score={score} totalQuestions={questions.length} onPlayAgain={handleStart} />;
            case GameState.ERROR:
                return (
                    <div className="text-center bg-white p-8 rounded-3xl shadow-lg w-full max-w-md mx-auto">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong.</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button onClick={resetGame} className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors">
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
            <main className="w-full max-w-lg">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;