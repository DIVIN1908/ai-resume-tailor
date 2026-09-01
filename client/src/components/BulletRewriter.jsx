import React, { useState } from 'react';
import { Sparkles, Check, X, Copy, Info, RefreshCw, ArrowRight } from 'lucide-react';

export default function BulletRewriter({ bulletRewrites, onUpdateBulletStatus }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!bulletRewrites || bulletRewrites.length === 0) return null;

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> AI Bullet Point Rewriter
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare original experience statements with AI-tailored bullets designed for maximum ATS impact.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {bulletRewrites.map((item, idx) => {
          const isAccepted = item.accepted === true;
          const isRejected = item.accepted === false;

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                isAccepted
                  ? 'bg-emerald-950/20 border-emerald-500/40 ring-1 ring-emerald-500/20'
                  : isRejected
                  ? 'bg-slate-950/40 border-slate-800 opacity-60'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* Original Bullet */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800/80 rounded-lg">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Original Statement</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.original}</p>
                </div>

                {/* AI Tailored Bullet */}
                <div className="p-3.5 bg-indigo-950/20 border border-indigo-500/30 rounded-lg relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-400" /> AI Optimized Statement
                    </span>
                    
                    {/* Action Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(item.suggested, idx)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                        title="Copy text"
                      >
                        {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-100 font-semibold leading-relaxed font-sans mb-2">{item.suggested}</p>

                  {/* Added Keywords Badges */}
                  {item.addedKeywords && item.addedKeywords.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[10px] font-semibold text-slate-500">Added Keywords:</span>
                      {item.addedKeywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-medium">
                          +{kw}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* AI Rationale / Explanation */}
                  {item.explanation && (
                    <p className="text-[11px] text-slate-400 italic mt-2 pt-2 border-t border-indigo-500/10 flex items-start gap-1">
                      <Info className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{item.explanation}</span>
                    </p>
                  )}
                </div>

              </div>

              {/* Accept / Reject Footer */}
              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-slate-800/60">
                <button
                  onClick={() => onUpdateBulletStatus(idx, false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                    isRejected
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <X className="w-3.5 h-3.5" /> {isRejected ? 'Rejected' : 'Keep Original'}
                </button>
                <button
                  onClick={() => onUpdateBulletStatus(idx, true)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                    isAccepted
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" /> {isAccepted ? 'Accepted' : 'Accept AI Rewrite'}
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
