export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
  Expert = "Expert"
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  topic: string;
  difficulty: Difficulty;
  questions: Question[];
  createdAt: number;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<number, number>; // questionId -> selectedOptionIndex
  isFinished: boolean;
  score: number;
}

export type AppView = 'home' | 'loading' | 'quiz' | 'result';
