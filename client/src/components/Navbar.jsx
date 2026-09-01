import React from 'react';
import { Target, Sparkles, History, Cpu } from 'lucide-react';

export default function Navbar({ onOpenHistory, systemStatus }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                ResumeTailor
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                AI Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">ATS Optimization & Bullet Point Rewriter</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* AI Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Engine: <strong className="text-white">{systemStatus?.aiProvider || 'AI Ready'}</strong></span>
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 text-xs font-semibold transition-all duration-200 shadow-sm"
          >
            <History className="w-4 h-4 text-indigo-400" />
            <span>History</span>
          </button>
        </div>

      </div>
    </header>
  );
}
