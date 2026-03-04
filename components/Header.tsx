import React from 'react';
import { BookOpen, Github } from 'lucide-react';

export const Header: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 group focus:outline-none"
        >
          <div className="bg-indigo-600 p-2 rounded-lg text-white group-hover:bg-indigo-700 transition-colors">
            <BookOpen size={20} />
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">
            MockMaster <span className="text-indigo-600">AI</span>
          </span>
        </button>
        
        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
             <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">By</span>
             <span className="text-xs font-bold text-indigo-600">Trio Developers</span>
           </div>
           <a href="#" className="text-slate-500 hover:text-slate-800 transition-colors">
             <Github size={20} />
           </a>
        </div>
      </div>
    </header>
  );
};
