
export interface QuizQuestion {
  questionText: string;
  options: string[];
  correctAnswer: string;
  funFact: string;
}

export interface QuizData {
  questions: QuizQuestion[];
}

export interface QuestionWithImage extends QuizQuestion {
  imageUrl: string;
}

export enum GameState {
  START,
  LOADING_QUESTIONS,
  LOADING_IMAGE,
  PLAYING,
  SHOWING_ANSWER,
  FINISHED,
  ERROR,
}
