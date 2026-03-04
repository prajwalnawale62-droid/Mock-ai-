import React from 'react';
import { Quiz, QuizState } from '../types';
import { Button } from './Button';
import { Trophy, RefreshCw, XCircle, CheckCircle, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface QuizResultProps {
  quiz: Quiz;
  quizState: QuizState;
  onRetry: () => void;
  onNew: () => void;
}

export const QuizResult: React.FC<QuizResultProps> = ({ quiz, quizState, onRetry, onNew }) => {
  const percentage = Math.round((quizState.score / quiz.questions.length) * 100);
  const [expandedId, setExpandedId] = React.useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  let message = "Keep practicing!";
  let colorClass = "text-slate-600";
  
  if (percentage === 100) {
    message = "Perfect Score! 🌟";
    colorClass = "text-emerald-600";
  } else if (percentage >= 80) {
    message = "Excellent Job! 🎉";
    colorClass = "text-indigo-600";
  } else if (percentage >= 60) {
    message = "Good Effort! 👍";
    colorClass = "text-blue-600";
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500 pb-20">
      
      {/* Score Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-12 text-center mb-10 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <div className="inline-flex items-center justify-center p-4 bg-yellow-50 text-yellow-500 rounded-full mb-6">
          <Trophy size={48} />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Quiz Completed!</h2>
        <p className={`text-xl font-medium ${colorClass} mb-8`}>{message}</p>
        
        <div className="flex items-center justify-center gap-8 md:gap-16 mb-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-1">{percentage}%</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Score</div>
          </div>
          <div className="w-px h-16 bg-slate-200"></div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-1">
              {quizState.score}<span className="text-2xl text-slate-400">/{quiz.questions.length}</span>
            </div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Correct</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={onRetry} variant="outline" className="w-full sm:w-auto gap-2">
            <RefreshCw size={18} /> Retry Quiz
          </Button>
          <Button onClick={onNew} className="w-full sm:w-auto gap-2">
            <BookOpen size={18} /> New Topic
          </Button>
        </div>
      </div>

      {/* Answer Breakdown */}
      <h3 className="text-xl font-bold text-slate-800 mb-6 px-2">Detailed Breakdown</h3>
      <div className="space-y-4">
        {quiz.questions.map((q, idx) => {
          const userAnswerIdx = quizState.answers[q.id];
          const isCorrect = userAnswerIdx === q.correctAnswerIndex;
          const isExpanded = expandedId === q.id;

          return (
            <div 
              key={q.id} 
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden
                ${isCorrect ? 'border-slate-200 shadow-sm' : 'border-red-100 shadow-red-50 ring-1 ring-red-50'}
              `}
            >
              <button 
                onClick={() => toggleExpand(q.id)}
                className="w-full text-left p-6 flex items-start gap-4 focus:outline-none"
              >
                <div className="mt-1 flex-shrink-0">
                  {isCorrect ? (
                    <CheckCircle className="text-emerald-500" size={24} />
                  ) : (
                    <XCircle className="text-red-500" size={24} />
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="text-lg font-medium text-slate-900 pr-8">{q.text}</h4>
                    {isExpanded ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                  </div>
                  {!isExpanded && (
                    <p className="text-sm text-slate-500 mt-1">
                      {isCorrect ? "You got it right!" : "Click to see the correct answer"}
                    </p>
                  )}
                </div>
              </button>
              
              {isExpanded && (
                <div className="px-6 pb-6 pl-16 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-3 mb-6">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswerIdx === optIdx;
                      const isCorrectOption = q.correctAnswerIndex === optIdx;
                      
                      let optClass = "border-slate-100 bg-slate-50 text-slate-600";
                      let icon = null;

                      if (isCorrectOption) {
                        optClass = "border-emerald-200 bg-emerald-50 text-emerald-800 font-medium";
                        icon = <CheckCircle size={16} className="text-emerald-600" />;
                      } else if (isSelected && !isCorrectOption) {
                        optClass = "border-red-200 bg-red-50 text-red-800";
                        icon = <XCircle size={16} className="text-red-600" />;
                      }

                      return (
                        <div key={optIdx} className={`p-3 rounded-lg border flex items-center justify-between text-sm ${optClass}`}>
                          <span>{opt}</span>
                          {icon}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="bg-indigo-50 rounded-xl p-4 text-sm text-indigo-900 border border-indigo-100">
                    <span className="font-bold block mb-1 uppercase text-xs tracking-wider text-indigo-600">Explanation</span>
                    {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
