import React, { useState, useRef, useEffect } from 'react';
import { questions } from './data/questions';
import { QuizState } from './types';

// Helper component to display option characters (A, B, C, D)
const getOptionChar = (index: number) => String.fromCharCode(65 + index);

const App: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    selectedOption: null,
    isAnswered: false,
    isFinished: false,
  });

  // Reference for scrolling to explanation
  const explanationRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to explanation when answered
  useEffect(() => {
    if (state.isAnswered && explanationRef.current) {
      explanationRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [state.isAnswered]);

  const currentQuestion = questions[state.currentQuestionIndex];

  const handleOptionSelect = (option: string) => {
    if (state.isAnswered) return;

    const isCorrect = option === currentQuestion.answer;
    setState((prev) => ({
      ...prev,
      selectedOption: option,
      isAnswered: true,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));
  };

  const handleNextQuestion = () => {
    const nextIndex = state.currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setState({
        currentQuestionIndex: nextIndex,
        score: state.score,
        selectedOption: null,
        isAnswered: false,
        isFinished: false,
      });
      window.scrollTo(0, 0);
    } else {
      setState((prev) => ({
        ...prev,
        isFinished: true,
      }));
    }
  };

  const handleRestart = () => {
    setState({
      currentQuestionIndex: 0,
      score: 0,
      selectedOption: null,
      isAnswered: false,
      isFinished: false,
    });
    window.scrollTo(0, 0);
  };

  if (state.isFinished) {
    const percentage = Math.round((state.score / questions.length) * 100);
    let message = "Good effort!";
    if (percentage >= 90) message = "Outstanding!";
    else if (percentage >= 70) message = "Great job!";
    else if (percentage >= 50) message = "Keep practicing!";

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center border border-gray-100">
          <div className="mb-6">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <span className="text-3xl font-bold text-white">{percentage}%</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Quiz Completed</h1>
            <p className="text-gray-500 mb-4">{message}</p>
          </div>
          
          <div className="bg-gray-100 rounded-xl p-4 mb-8 flex justify-between items-center">
            <div className="text-center flex-1 border-r border-gray-300">
              <div className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Total</div>
              <div className="text-xl font-bold text-gray-800">{questions.length}</div>
            </div>
            <div className="text-center flex-1 border-r border-gray-300">
              <div className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Correct</div>
              <div className="text-xl font-bold text-green-600">{state.score}</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Wrong</div>
              <div className="text-xl font-bold text-red-500">{questions.length - state.score}</div>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-4 rounded-xl transition-all transform active:scale-95 shadow-md"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = ((state.currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto shadow-2xl border-x border-gray-100 relative">
      {/* Top Bar */}
      <div className="bg-white p-4 sticky top-0 z-20 border-b border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Question</span>
            <span className="text-xl font-bold text-gray-800">
              {state.currentQuestionIndex + 1} <span className="text-gray-400 text-base font-normal">/ {questions.length}</span>
            </span>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Score</span>
             <span className="text-xl font-bold text-blue-600">{state.score}</span>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 flex flex-col">
        
        {/* Question Text */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-3 flex-1">
          {currentQuestion.options.map((option, index) => {
            const isSelected = state.selectedOption === option;
            const isCorrect = option === currentQuestion.answer;
            const showCorrect = state.isAnswered && isCorrect;
            const showWrong = state.isAnswered && isSelected && !isCorrect;
            
            let buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-3 relative ";
            
            if (state.isAnswered) {
               if (isCorrect) {
                   // Correct answer (whether selected or not)
                   buttonClass += "bg-green-50 border-green-500 text-green-800 shadow-sm";
               } else if (isSelected) {
                   // Wrong selection
                   buttonClass += "bg-red-50 border-red-500 text-red-800 shadow-sm";
               } else {
                   // Unselected other options
                   buttonClass += "bg-gray-50 border-transparent text-gray-400 opacity-60";
               }
            } else {
               // Default state
               buttonClass += "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100 active:border-blue-400 text-gray-700 shadow-sm";
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                disabled={state.isAnswered}
                className={buttonClass}
              >
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold border ${
                    state.isAnswered 
                    ? isCorrect ? 'bg-green-500 border-green-500 text-white' : (isSelected ? 'bg-red-500 border-red-500 text-white' : 'border-gray-300 text-gray-400')
                    : 'bg-gray-100 border-gray-300 text-gray-500 group-hover:bg-white'
                }`}>
                  {getOptionChar(index)}
                </div>
                <span className="font-medium text-base mt-0.5">{option}</span>
                
                {/* Status Icons */}
                {showCorrect && (
                    <div className="absolute right-4 top-4 text-green-600">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                )}
                {showWrong && (
                    <div className="absolute right-4 top-4 text-red-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Section */}
        {state.isAnswered && (
          <div ref={explanationRef} className="mt-6 animate-fade-in">
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <div className="flex items-center gap-2 mb-2 text-indigo-800 font-bold text-sm uppercase tracking-wide">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Explanation
              </div>
              <p className="text-indigo-900 text-sm leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          </div>
        )}

        {/* Spacer for sticky button */}
        <div className="h-24"></div>
      </div>

      {/* Floating/Sticky Next Button */}
      {state.isAnswered && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 pb-6 md:absolute z-30 flex justify-center">
             <div className="w-full max-w-md px-5 md:px-0">
                <button
                    onClick={handleNextQuestion}
                    className="w-full bg-blue-600 text-white font-bold text-lg py-3.5 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                    {state.currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;