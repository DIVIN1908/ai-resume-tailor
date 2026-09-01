import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Eye, User } from 'lucide-react';
import axios from 'axios';

export default function UploadZone({ resumeData, setResumeData, candidateName, setCandidateName }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx' && ext !== 'txt') {
      setUploadError('Invalid format. Please upload a .pdf or .docx file.');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await axios.post('/api/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setResumeData({
          fileName: res.data.fileName,
          rawText: res.data.rawText,
          parsedStructure: res.data.parsedStructure
        });
        
        // Auto extract candidate name if available
        if (!candidateName && res.data.fileName) {
          const name = res.data.fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
          setCandidateName(name);
        }
      }
    } catch (err) {
      console.error('File upload failed:', err);
      setUploadError(err.response?.data?.error || 'Failed to upload and parse resume file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold tracking-wide uppercase text-indigo-400 flex items-center gap-2">
          <FileText className="w-4 h-4" /> 1. Upload Your Resume
        </h2>
        {resumeData && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready
          </span>
        )}
      </div>

      {/* Candidate Name Input */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-500" /> Candidate Full Name
        </label>
        <input
          type="text"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          placeholder="e.g. Divin Vinod"
          className="w-full px-3 py-2 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 transition-colors"
        />
      </div>

      {/* Drag & Drop Box */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]'
            : resumeData
            ? 'border-slate-700/80 bg-slate-950/40 hover:border-slate-600'
            : 'border-slate-800 hover:border-indigo-500/60 bg-slate-950/60'
        }`}
      >
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4 text-indigo-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-sm font-semibold">Parsing document structure...</p>
            <p className="text-xs text-slate-500 mt-1">Extracting experience, skills & bullets</p>
          </div>
        ) : resumeData ? (
          <div className="flex flex-col items-center py-2">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-2">
              <FileText className="w-6 h-6 text-indigo-400" />
            </div>
            <p className="text-sm font-bold text-slate-200">{resumeData.fileName}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Extracted {resumeData.rawText.split(/\s+/).length} words • {resumeData.parsedStructure?.experienceBullets?.length || 0} bullets detected
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowPreview(!showPreview); }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 underline underline-offset-2"
              >
                <Eye className="w-3.5 h-3.5" /> {showPreview ? 'Hide Text Preview' : 'Inspect Extracted Text'}
              </button>
              <span className="text-xs text-slate-600">•</span>
              <span className="text-xs text-slate-400 hover:text-slate-200">Click to change file</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-indigo-400" />
            </div>
            <p className="text-sm font-semibold text-slate-200">
              Drag & drop your resume file here, or <span className="text-indigo-400 font-bold underline">browse</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">Supports PDF (.pdf) and Word (.docx) files</p>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Extracted Text Modal / Drawer */}
      {showPreview && resumeData && (
        <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-xl max-h-48 overflow-y-auto font-mono text-xs text-slate-400">
          <p className="text-[10px] uppercase text-indigo-400 font-sans font-bold mb-1">Parsed Raw Resume Output:</p>
          <pre className="whitespace-pre-wrap">{resumeData.rawText}</pre>
        </div>
      )}
    </div>
  );
}
