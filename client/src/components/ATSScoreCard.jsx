import React, { useState } from 'react';
import { Target, CheckCircle2, XCircle, AlertTriangle, Info, Sparkles, Zap, Layers, BarChart2 } from 'lucide-react';

export default function ATSScoreCard({ atsScore, jobAnalysis }) {
  if (!atsScore) return null;

  const { overallScore, scoreTier, badgeColor, breakdown, keywordDetails, summaryStats } = atsScore;
  const [filter, setFilter] = useState('all'); // 'all', 'matched', 'missing'

  // Metric color helper
  const getScoreColor = (score, max) => {
    const pct = (score / max) * 100;
    if (pct >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (pct >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  const filteredKeywords = (keywordDetails || []).filter(item => {
    if (filter === 'matched') return item.matched;
    if (filter === 'missing') return !item.matched;
    return true;
  });

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        
        {/* ATS Circular Score Gauge */}
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center w-28 h-28 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="transition-all duration-1000 ease-out"
                strokeDasharray={`${overallScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke={badgeColor}
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold tracking-tight text-white">{overallScore}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">ATS Match</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                style={{ backgroundColor: `${badgeColor}20`, color: badgeColor, borderColor: `${badgeColor}40` }}
                className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide border"
              >
                {scoreTier}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">Predicted ATS Compatibility</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Analyzed {summaryStats?.totalTargetKeywords || 0} target job keywords & formatting criteria.
            </p>
          </div>
        </div>

        {/* High-level Summary Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center">
            <span className="text-xs text-slate-400 block">Matched Keywords</span>
            <span className="text-lg font-bold text-emerald-400">
              {summaryStats?.matchedKeywordCount || 0} / {summaryStats?.totalTargetKeywords || 0}
            </span>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center">
            <span className="text-xs text-slate-400 block">Bullets w/ Metrics</span>
            <span className="text-lg font-bold text-cyan-400">
              {summaryStats?.bulletsWithMetrics || 0} / {summaryStats?.totalBulletsAnalyzed || 0}
            </span>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center col-span-2 sm:col-span-1">
            <span className="text-xs text-slate-400 block">Total Word Count</span>
            <span className="text-lg font-bold text-indigo-400">{summaryStats?.totalWordCount || 0}</span>
          </div>
        </div>

      </div>

      {/* 4 Score Component Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-b border-slate-800/80">
        
        {/* 1. Keyword Overlap */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Keyword Match
            </span>
            <span className={getScoreColor(breakdown.keywordMatch.score, 40) + ' px-2 py-0.5 rounded text-[11px] font-bold border'}>
              {breakdown.keywordMatch.score}/40
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${breakdown.keywordMatch.percentage}%` }} />
          </div>
        </div>

        {/* 2. Section Completeness */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> Structure & Sections
            </span>
            <span className={getScoreColor(breakdown.sectionCompleteness.score, 20) + ' px-2 py-0.5 rounded text-[11px] font-bold border'}>
              {breakdown.sectionCompleteness.score}/20
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-400 h-full transition-all duration-500" style={{ width: `${breakdown.sectionCompleteness.percentage}%` }} />
          </div>
        </div>

        {/* 3. Measurable Impact */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-300 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-cyan-400" /> Quantifiable Metrics
            </span>
            <span className={getScoreColor(breakdown.measurableImpact.score, 20) + ' px-2 py-0.5 rounded text-[11px] font-bold border'}>
              {breakdown.measurableImpact.score}/20
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full transition-all duration-500" style={{ width: `${breakdown.measurableImpact.percentage}%` }} />
          </div>
        </div>

        {/* 4. Formatting Readability */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Readability & Format
            </span>
            <span className={getScoreColor(breakdown.formattingReadability.score, 20) + ' px-2 py-0.5 rounded text-[11px] font-bold border'}>
              {breakdown.formattingReadability.score}/20
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${breakdown.formattingReadability.percentage}%` }} />
          </div>
        </div>

      </div>

      {/* Keyword Matrix Badges */}
      <div className="pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Target Job Keyword Breakdown
          </h4>
          
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              All ({keywordDetails?.length || 0})
            </button>
            <button
              onClick={() => setFilter('matched')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${filter === 'matched' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Matched ({summaryStats?.matchedKeywordCount || 0})
            </button>
            <button
              onClick={() => setFilter('missing')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${filter === 'missing' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Missing ({summaryStats ? summaryStats.totalTargetKeywords - summaryStats.matchedKeywordCount : 0})
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 p-4 bg-slate-950/80 border border-slate-800 rounded-xl max-h-48 overflow-y-auto">
          {filteredKeywords.length > 0 ? (
            filteredKeywords.map((item, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-transform hover:scale-[1.02] ${
                  item.matched
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                }`}
              >
                {item.matched ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                {item.keyword}
              </span>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic py-2">No keywords match the selected filter.</p>
          )}
        </div>
      </div>
    </div>
  );
}
