import React, { useState } from 'react';
import { Header } from './components/Header';
import { SetupQuiz } from './components/SetupQuiz';
import { ActiveQuiz } from './components/ActiveQuiz';
import { QuizResult } from './components/QuizResult';
import { generateQuiz } from './services/geminiService';
import { AppView, Difficulty, Quiz, QuizState } from './types';

function App() {
  const [view, setView] = useState<AppView>('home');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    isFinished: false,
    score: 0
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartQuiz = async (topic: string, difficulty: Difficulty, numQuestions: number) => {
    setIsGenerating(true);
    setError(null);
    try {
      const newQuiz = await generateQuiz(topic, difficulty, numQuestions);
      setQuiz(newQuiz);
      
      // Reset State
      setQuizState({
        currentQuestionIndex: 0,
        answers: {},
        isFinished: false,
        score: 0
      });
      
      setView('quiz');
    } catch (err) {
      console.error(err);
      setError("Failed to generate quiz. Please try a different topic or check your connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswer = (questionId: number, optionIndex: number) => {
    setQuizState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: optionIndex
      }
    }));
  };

  const handleNext = () => {
    if (!quiz) return;
    if (quizState.currentQuestionIndex < quiz.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  };

  const handleFinish = () => {
    if (!quiz) return;
    
    // Calculate Score
    let score = 0;
    quiz.questions.forEach(q => {
      if (quizState.answers[q.id] === q.correctAnswerIndex) {
        score++;
      }
    });

    setQuizState(prev => ({
      ...prev,
      isFinished: true,
      score
    }));
    setView('result');
  };

  const handleRetry = () => {
    setQuizState({
      currentQuestionIndex: 0,
      answers: {},
      isFinished: false,
      score: 0
    });
    setView('quiz');
  };

  const handleReset = () => {
    setQuiz(null);
    setView('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header onReset={handleReset} />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-start">
        {error && (
          <div className="w-full max-w-2xl mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        )}
        
        {view === 'home' && (
          <SetupQuiz onStart={handleStartQuiz} isGenerating={isGenerating} />
        )}
        
        {view === 'quiz' && quiz && (
          <ActiveQuiz 
            quiz={quiz} 
            quizState={quizState}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onFinish={handleFinish}
          />
        )}

        {view === 'result' && quiz && (
          <QuizResult 
            quiz={quiz} 
            quizState={quizState}
            onRetry={handleRetry}
            onNew={handleReset}
          />
        )}
      </main>
      
      <footer className="w-full py-8 text-center border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Crafted By</span>
            <div className="h-4 w-px bg-slate-200 mx-1"></div>
            <span className="text-sm font-bold text-indigo-600 tracking-tight">Trio Developers</span>
          </div>
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} MockMaster AI. Powered by Gemini 3.1.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;