import React from 'react';
import { X, History, Calendar, Award, Briefcase, FileText, ChevronRight } from 'lucide-react';

export default function HistoryModal({ isOpen, onClose, historyList, onLoadSession }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-slate-100">Past Optimization History</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {historyList && historyList.length > 0 ? (
            historyList.map((item) => (
              <div
                key={item.id}
                onClick={() => { onLoadSession(item); onClose(); }}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all duration-200 group flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-100 group-hover:text-indigo-400 transition-colors">
                      {item.jobTitle || 'Target Role'}
                    </span>
                    <span
                      style={{ backgroundColor: `${item.atsScore?.badgeColor}20`, color: item.atsScore?.badgeColor }}
                      className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase"
                    >
                      {item.atsScore?.overallScore || 0}% ATS Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-3">
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 text-slate-500" /> {item.candidateName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-500" /> {new Date(item.createdAt).toLocaleDateString()}</span>
                  </p>
                </div>

                <div className="flex items-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No saved optimization sessions yet.</p>
              <p className="text-xs text-slate-600 mt-1">Upload a resume and paste a job description to get started.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
