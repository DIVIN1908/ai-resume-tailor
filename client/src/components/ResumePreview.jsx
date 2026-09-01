import React, { useState } from 'react';
import { Download, FileText, Edit3, Check, Copy, Sparkles, Printer } from 'lucide-react';
import axios from 'axios';

export default function ResumePreview({ candidateName, jobTitle, tailoredData }) {
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  
  if (!tailoredData) return null;

  const summary = tailoredData.tailoredSummary || '';
  const bulletRewrites = tailoredData.bulletRewrites || [];
  const matchedKeywords = tailoredData.matchedKeywords || [];

  const handleExportDocx = async () => {
    setIsExporting(true);
    try {
      const response = await axios.post('/api/export/docx', {
        candidateName: candidateName || 'Candidate',
        tailoredData
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${(candidateName || 'Candidate').replace(/\s+/g, '_')}_ATS_Optimized.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to export DOCX:', err);
      alert('Failed to download Word document.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyFullText = () => {
    let fullText = `${(candidateName || 'Candidate').toUpperCase()}\n${jobTitle || ''}\n\n`;
    fullText += `PROFESSIONAL SUMMARY\n${summary}\n\n`;
    fullText += `WORK EXPERIENCE & ACHIEVEMENTS\n`;
    bulletRewrites.forEach(b => {
      fullText += `• ${b.suggested}\n`;
    });
    fullText += `\nSKILLS & COMPETENCIES\n${matchedKeywords.join(' • ')}\n`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" /> Optimized Resume Preview
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            ATS-compliant single-column clean format ready to send to recruiters.
          </p>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopyFullText}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>

          <button
            onClick={handleExportDocx}
            disabled={isExporting}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Generating DOCX...' : 'Export Word (.docx)'}
          </button>
        </div>
      </div>

      {/* Styled Printable ATS Document Sheet */}
      <div className="bg-white text-slate-900 p-8 rounded-xl shadow-2xl font-sans max-w-3xl mx-auto border border-slate-200 selection:bg-indigo-100">
        
        {/* Name Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-5 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight uppercase text-slate-900">
            {candidateName || 'CANDIDATE NAME'}
          </h1>
          {jobTitle && (
            <p className="text-sm font-semibold text-slate-700 uppercase tracking-widest mt-1">
              {jobTitle}
            </p>
          )}
        </div>

        {/* Summary */}
        {summary && (
          <div className="mb-5">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-xs text-slate-800 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {bulletRewrites.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              WORK EXPERIENCE & KEY ACHIEVEMENTS
            </h2>
            <ul className="space-y-2">
              {bulletRewrites.map((bullet, idx) => (
                <li key={idx} className="text-xs text-slate-800 leading-relaxed flex items-start gap-2">
                  <span className="text-slate-900 font-bold select-none">•</span>
                  <span>{bullet.accepted ? bullet.suggested : (bullet.suggested || bullet.original)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {matchedKeywords.length > 0 && (
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              TECHNICAL COMPETENCIES & KEYWORDS
            </h2>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {matchedKeywords.join('  •  ')}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
