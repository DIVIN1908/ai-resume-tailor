import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Target, Loader2, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import Navbar from './components/Navbar';
import UploadZone from './components/UploadZone';
import JobInput from './components/JobInput';
import ATSScoreCard from './components/ATSScoreCard';
import BulletRewriter from './components/BulletRewriter';
import ResumePreview from './components/ResumePreview';
import HistoryModal from './components/HistoryModal';

// Set production API URL if provided in environment variables
if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}


export default function App() {
  const [candidateName, setCandidateName] = useState('');
  const [resumeData, setResumeData] = useState(null); // { fileName, rawText, parsedStructure }
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [tailorResult, setTailorResult] = useState(null); // API response object
  const [activeTab, setActiveTab] = useState('ats'); // 'ats', 'rewriter', 'preview'

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);

  // Fetch health and history on load
  useEffect(() => {
    fetchHealthStatus();
    fetchHistory();
  }, []);

  const fetchHealthStatus = async () => {
    try {
      const res = await axios.get('/api/health');
      setSystemStatus(res.data);
    } catch (e) {
      console.warn('Backend server offline or starting up...');
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/history');
      if (res.data.success) {
        setHistoryList(res.data.history);
      }
    } catch (e) {
      console.warn('Could not load history');
    }
  };

  const handleTailorResume = async () => {
    if (!resumeData || !resumeData.rawText) {
      setErrorMsg('Please upload a valid resume file (PDF or Word) first.');
      return;
    }
    if (!jobDescription || jobDescription.trim().length < 30) {
      setErrorMsg('Please paste a comprehensive target job description.');
      return;
    }

    setErrorMsg('');
    setIsProcessing(true);

    try {
      const res = await axios.post('/api/tailor-resume', {
        candidateName: candidateName || 'Candidate',
        resumeText: resumeData.rawText,
        resumeStructure: resumeData.parsedStructure,
        jobTitle,
        jobDescription
      });

      if (res.data.success) {
        setTailorResult(res.data.data);
        setActiveTab('ats');
        fetchHistory();
      }
    } catch (err) {
      console.error('Tailor request failed:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to tailor resume. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateBulletStatus = (bulletIdx, accepted) => {
    if (!tailorResult) return;
    const updatedRewrites = [...tailorResult.tailoredData.bulletRewrites];
    updatedRewrites[bulletIdx].accepted = accepted;

    setTailorResult({
      ...tailorResult,
      tailoredData: {
        ...tailorResult.tailoredData,
        bulletRewrites: updatedRewrites
      }
    });
  };

  const handleLoadSession = (session) => {
    setCandidateName(session.candidateName || '');
    setJobTitle(session.jobTitle || '');
    setJobDescription(session.jobDescription || '');
    setTailorResult(session);
    if (session.rawResumeText) {
      setResumeData({
        fileName: `${session.candidateName || 'Saved'}_Resume.pdf`,
        rawText: session.rawResumeText,
        parsedStructure: session.parsedStructure
      });
    }
    setActiveTab('ats');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar onOpenHistory={() => setHistoryOpen(true)} systemStatus={systemStatus} />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {/* Hero Section Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/20 p-8 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen ATS Optimization Engine
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Tailor Your Resume for ATS & <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Land 3x More Interviews</span>
            </h1>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Upload your PDF/Word resume, paste any job description, and let our AI analyze ATS keyword gaps, rewrite bullet points with quantifiable impact metrics, and export an optimized resume instantly.
            </p>
          </div>
        </div>

        {/* Input Grid (Upload & Job Description) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UploadZone
            resumeData={resumeData}
            setResumeData={setResumeData}
            candidateName={candidateName}
            setCandidateName={setCandidateName}
          />
          <JobInput
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            companyName={companyName}
            setCompanyName={setCompanyName}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
          />
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Tailor Action Trigger Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleTailorResume}
            disabled={isProcessing || !resumeData || !jobDescription}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-base shadow-xl shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-white" />
                <span>Analyzing & Tailoring Resume with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 text-cyan-200" />
                <span>Tailor Resume & Predict ATS Score</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </>
            )}
          </button>
        </div>

        {/* Tailored Results Workspace */}
        {tailorResult && (
          <div className="space-y-6 pt-4">
            
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-center border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setActiveTab('ats')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'ats'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Target className="w-4 h-4" /> ATS Match & Keywords
                </button>
                <button
                  onClick={() => setActiveTab('rewriter')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'rewriter'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4" /> AI Bullet Rewriter ({tailorResult.tailoredData?.bulletRewrites?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'preview'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-4 h-4" /> Resume Preview & Export
                </button>
              </div>
            </div>

            {/* Tab Views */}
            {activeTab === 'ats' && (
              <ATSScoreCard
                atsScore={tailorResult.atsScore}
                jobAnalysis={tailorResult.jobAnalysis}
              />
            )}

            {activeTab === 'rewriter' && (
              <BulletRewriter
                bulletRewrites={tailorResult.tailoredData?.bulletRewrites}
                onUpdateBulletStatus={handleUpdateBulletStatus}
              />
            )}

            {activeTab === 'preview' && (
              <ResumePreview
                candidateName={tailorResult.candidateName}
                jobTitle={tailorResult.jobTitle}
                tailoredData={tailorResult.tailoredData}
              />
            )}

          </div>
        )}

      </main>

      {/* History Slide-over Modal */}
      <HistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        historyList={historyList}
        onLoadSession={handleLoadSession}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 AI-Powered Resume Tailor • Built with React, Express, MongoDB & AI Engine.</p>
      </footer>

    </div>
  );
}
