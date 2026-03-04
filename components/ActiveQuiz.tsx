import React, { useEffect, useState, useRef } from 'react';
import { Quiz, QuizState } from '../types';
import { Button } from './Button';
import { CheckCircle2, ChevronRight, Check, Timer as TimerIcon } from 'lucide-react';

interface ActiveQuizProps {
  quiz: Quiz;
  quizState: QuizState;
  onAnswer: (questionId: number, optionIndex: number) => void;
  onNext: () => void;
  onFinish: () => void;
}

export const ActiveQuiz: React.FC<ActiveQuizProps> = ({ 
  quiz, 
  quizState, 
  onAnswer, 
  onNext, 
  onFinish 
}) => {
  const currentQuestion = quiz.questions[quizState.currentQuestionIndex];
  const isLastQuestion = quizState.currentQuestionIndex === quiz.questions.length - 1;
  const hasAnsweredCurrent = quizState.answers[currentQuestion.id] !== undefined;
  
  // Calculate initial time based on number of questions (1 minute per question)
  const [timeLeft, setTimeLeft] = useState(quiz.questions.length * 60);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  useEffect(() => {
    if (timeLeft <= 0) {
      finishRef.current();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft < 60; // Less than 1 minute
  const progress = ((quizState.currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-right-8 duration-300">
      
      {/* Header with Timer and Progress */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-20 z-10">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="text-sm font-medium text-slate-500 whitespace-nowrap">
            Question <span className="text-slate-900 font-bold">{quizState.currentQuestionIndex + 1}</span> / {quiz.questions.length}
          </div>
          <div className="h-2 flex-grow sm:w-32 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold transition-colors ${isLowTime ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
          <TimerIcon size={18} />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 leading-relaxed">
            {currentQuestion.text}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = quizState.answers[currentQuestion.id] === idx;
              
              return (
                <button
                  key={idx}
                  onClick={() => onAnswer(currentQuestion.id, idx)}
                  className={`
                    w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 group
                    ${isSelected 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm' 
                      : 'border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                    }
                  `}
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-colors
                    ${isSelected 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : 'bg-slate-50 border-slate-200 text-slate-500 group-hover:border-slate-300'
                    }
                  `}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-lg">{option}</span>
                  
                  {isSelected && (
                    <CheckCircle2 className="ml-auto text-indigo-600 animate-in zoom-in spin-in-90 duration-300" size={24} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <div className="text-slate-400 text-sm font-medium hidden sm:block">
             {hasAnsweredCurrent ? "Answer recorded" : "Select an option"}
          </div>
          
          <div className="flex gap-4 w-full sm:w-auto justify-end">
            {isLastQuestion ? (
              <Button 
                onClick={onFinish} 
                disabled={!hasAnsweredCurrent}
                className="gap-2 pl-8 w-full sm:w-auto"
              >
                Finish Test <Check size={20} />
              </Button>
            ) : (
              <Button 
                onClick={onNext} 
                disabled={!hasAnsweredCurrent}
                variant="secondary"
                className="gap-2 pl-8 w-full sm:w-auto"
              >
                Next <ChevronRight size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};