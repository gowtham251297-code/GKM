export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  selectedOption: string | null;
  isAnswered: boolean;
  isFinished: boolean;
}