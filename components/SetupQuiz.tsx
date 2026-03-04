import React, { useState } from 'react';
import { Difficulty } from '../types';
import { Button } from './Button';
import { Brain, Sparkles, Zap, Target, Layers, Hash } from 'lucide-react';

interface SetupQuizProps {
  onStart: (topic: string, difficulty: Difficulty, numQuestions: number) => void;
  isGenerating: boolean;
}

export const SetupQuiz: React.FC<SetupQuizProps> = ({ onStart, isGenerating }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  const [numQuestions, setNumQuestions] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onStart(topic, difficulty, numQuestions);
    }
  };

  const difficulties = [
    { value: Difficulty.Easy, label: 'Easy', icon: Zap, color: 'text-green-500 bg-green-50 border-green-200' },
    { value: Difficulty.Medium, label: 'Medium', icon: Target, color: 'text-blue-500 bg-blue-50 border-blue-200' },
    { value: Difficulty.Hard, label: 'Hard', icon: Brain, color: 'text-purple-500 bg-purple-50 border-purple-200' },
    { value: Difficulty.Expert, label: 'Expert', icon: Sparkles, color: 'text-amber-500 bg-amber-50 border-amber-200' },
  ];

  const questionCounts = [5, 10, 15, 20];

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          Mock Test <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Generator</span>
        </h1>
        <p className="text-lg text-slate-600">
          Create a timed mock test on any topic. Choose your difficulty, set the length, and test your skills.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          <div className="space-y-4">
            <label htmlFor="topic" className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Test Topic
            </label>
            <div className="relative group">
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Javascript Promises, World War II, Organic Chemistry..."
                className="w-full px-5 py-4 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-slate-400"
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Sparkles size={24} />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Difficulty Level
              </label>
              <div className="grid grid-cols-2 gap-3">
                {difficulties.map((diff) => (
                  <button
                    key={diff.value}
                    type="button"
                    onClick={() => setDifficulty(diff.value)}
                    className={`
                      relative p-3 rounded-xl border-2 text-left transition-all duration-200 flex flex-col items-center gap-2
                      ${difficulty === diff.value 
                        ? `${diff.color} border-current ring-2 ring-offset-2 ring-offset-white ring-indigo-100` 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                      }
                    `}
                  >
                    <diff.icon size={20} />
                    <span className="font-medium text-xs">{diff.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Number of Questions
              </label>
              <div className="grid grid-cols-4 gap-2">
                {questionCounts.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setNumQuestions(count)}
                    className={`
                      h-full p-2 rounded-xl border-2 font-bold transition-all duration-200 flex flex-col items-center justify-center gap-1
                      ${numQuestions === count
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105' 
                        : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50'
                      }
                    `}
                  >
                    <Hash size={16} className={numQuestions === count ? 'text-indigo-200' : 'text-slate-400'} />
                    <span>{count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full py-5 text-lg" 
            isLoading={isGenerating}
            disabled={!topic.trim()}
          >
            Start Mock Test
          </Button>
        </form>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-6 text-center text-sm text-slate-500">
        <div className="flex flex-col items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full">
            <Layers size={16} />
          </div>
          <span>Custom Length</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full">
            <Brain size={16} />
          </div>
          <span>AI Generated</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full">
            <Target size={16} />
          </div>
          <span>Timed Practice</span>
        </div>
      </div>
    </div>
  );
};