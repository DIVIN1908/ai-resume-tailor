import React from 'react';
import { Briefcase, Building, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

const SAMPLE_JOBS = [
  {
    title: 'Full Stack Software Engineer',
    company: 'TechCorp Innovations',
    desc: `We are looking for a Full Stack Software Engineer experienced in React.js, Node.js, Express, and MongoDB. 

Key Responsibilities:
- Architect and develop scalable web applications with React, Next.js, and Node.js REST APIs.
- Optimize database queries in MongoDB and implement Redis caching for high performance.
- Collaborate with cross-functional teams in an Agile environment using Git, Docker, and CI/CD pipelines.
- Implement ATS optimization, automated unit testing, and web security best practices.

Requirements:
- 3+ years of experience with JavaScript/TypeScript, React.js, Node.js, and MongoDB.
- Demonstrated experience building high-throughput microservices and AWS/Vercel deployments.
- Strong problem-solving skills, API integration expertise, and performance tuning.`
  },
  {
    title: 'AI / Machine Learning Engineer',
    company: 'Nexus AI Labs',
    desc: `Nexus AI Labs is seeking a Machine Learning Engineer to build AI-powered solutions.

Key Responsibilities:
- Fine-tune and deploy LLM models (OpenAI, Hugging Face, Gemini API) for NLP application pipelines.
- Build Python & Node.js backend microservices to serve low-latency inference endpoints.
- Establish data preprocessing, vector search embeddings, and prompt engineering protocols.
- Perform ATS score analysis, algorithm optimization, and quantitative evaluations.`
  }
];

export default function JobInput({
  jobTitle, setJobTitle,
  companyName, setCompanyName,
  jobDescription, setJobDescription
}) {
  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;

  const loadSample = (sample) => {
    setJobTitle(sample.title);
    setCompanyName(sample.company);
    setJobDescription(sample.desc);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold tracking-wide uppercase text-indigo-400 flex items-center gap-2">
          <Briefcase className="w-4 h-4" /> 2. Target Job Details
        </h2>
        {jobDescription.length > 50 && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Job Loaded
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-500" /> Target Job Title
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            className="w-full px-3 py-2 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-slate-500" /> Company Name (Optional)
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Google / Microsoft"
            className="w-full px-3 py-2 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 transition-colors"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-500" /> Paste Job Description Text
          </label>
          <span className="text-[11px] text-slate-500 font-mono">{wordCount} words</span>
        </div>
        <textarea
          rows={6}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste requirements, responsibilities, tech stack, and qualifications directly from the job posting..."
          className="w-full px-3.5 py-2.5 text-xs font-sans leading-relaxed bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 transition-colors resize-none"
        />
      </div>

      {/* Preset Sample Job Loader */}
      <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Try Sample Job:
        </span>
        {SAMPLE_JOBS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => loadSample(sample)}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-[11px] text-slate-300 border border-slate-700/60 transition-colors"
          >
            {sample.title}
          </button>
        ))}
      </div>
    </div>
  );
}
