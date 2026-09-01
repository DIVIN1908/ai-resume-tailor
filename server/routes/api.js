const express = require('express');
const router = express.Router();
const multer = require('multer');
const parserService = require('../services/parserService');
const aiService = require('../services/aiService');
const atsService = require('../services/atsService');
const exportService = require('../services/exportService');

// Multer in-memory storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// In-memory fallback history store if MongoDB is offline
const inMemoryHistory = [];

/**
 * @route POST /api/upload-resume
 * Upload PDF or DOCX resume and extract text & sections.
 */
router.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded.' });
    }

    const rawText = await parserService.extractTextFromFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    const parsedStructure = parserService.parseResumeStructure(rawText);

    res.json({
      success: true,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      rawText,
      parsedStructure
    });
  } catch (err) {
    console.error('Error in /upload-resume:', err);
    res.status(500).json({ error: err.message || 'Failed to parse uploaded resume.' });
  }
});

/**
 * @route POST /api/tailor-resume
 * Complete end-to-end processing: Job analysis, AI bullet rewriter, ATS score calculation.
 */
router.post('/tailor-resume', async (req, res) => {
  try {
    const { resumeText, resumeStructure, jobDescription, jobTitle, candidateName } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Both resume text and job description are required.' });
    }

    const structure = resumeStructure || parserService.parseResumeStructure(resumeText);
    
    // 1. Analyze Job Description
    const jobAnalysis = await aiService.analyzeJobDescription(jobDescription, jobTitle);

    // 2. AI Tailor Resume & Bullet Rewriting
    const tailoredData = await aiService.tailorResumeContent(structure, jobAnalysis, jobDescription);

    // 3. Calculate ATS Match Score
    const atsScore = atsService.calculateAtsScore(structure, jobAnalysis, tailoredData);

    const record = {
      id: Date.now().toString(),
      candidateName: candidateName || 'Candidate',
      jobTitle: jobTitle || 'Target Role',
      jobDescription,
      rawResumeText: resumeText,
      parsedStructure: structure,
      jobAnalysis,
      tailoredData,
      atsScore,
      createdAt: new Date().toISOString()
    };

    // Store in history
    inMemoryHistory.unshift(record);
    if (inMemoryHistory.length > 20) inMemoryHistory.pop();

    res.json({
      success: true,
      data: record
    });
  } catch (err) {
    console.error('Error in /tailor-resume:', err);
    res.status(500).json({ error: err.message || 'Failed to tailor resume.' });
  }
});

/**
 * @route POST /api/export/docx
 * Download tailored resume as formatted Word DOCX document.
 */
router.post('/export/docx', async (req, res) => {
  try {
    const { tailoredData, candidateName } = req.body;
    
    if (!tailoredData) {
      return res.status(400).json({ error: 'Tailored resume data is required for export.' });
    }

    const buffer = await exportService.generateDocxResume(tailoredData, candidateName || 'Candidate');
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${(candidateName || 'Tailored_Resume').replace(/\s+/g, '_')}_ATS_Optimized.docx"`);
    res.send(buffer);
  } catch (err) {
    console.error('Error in /export/docx:', err);
    res.status(500).json({ error: err.message || 'Failed to generate DOCX export.' });
  }
});

/**
 * @route GET /api/history
 * Fetch past resume optimization sessions.
 */
router.get('/history', (req, res) => {
  res.json({
    success: true,
    history: inMemoryHistory
  });
});

/**
 * @route GET /api/health
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    aiProvider: process.env.GEMINI_API_KEY ? 'Gemini AI' : process.env.OPENAI_API_KEY ? 'OpenAI' : 'Smart Heuristics Engine',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
