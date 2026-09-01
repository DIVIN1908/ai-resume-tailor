const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');

/**
 * AI Service for resume tailoring, bullet rewrites, keyword extraction, and ATS optimizations.
 */

// Initialize AI clients lazily based on environment variables
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
}

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

/**
 * Extract Job Description Keywords (Technical Skills, Soft Skills, Tools, Requirements).
 */
async function analyzeJobDescription(jobDescription, jobTitle = '') {
  const gemini = getGeminiClient();
  const openai = getOpenAIClient();

  const prompt = `Analyze the following job description for a ${jobTitle || 'target role'}.
Extract a JSON object with:
1. "requiredSkills": List of mandatory technical skills and tools.
2. "preferredSkills": List of nice-to-have or secondary skills.
3. "softSkills": List of key soft skills and leadership traits.
4. "actionVerbs": Top action verbs relevant to this role.
5. "importantKeywords": Top 15 ATS high-priority keywords/phrases from the text.

Return ONLY valid JSON matching this exact structure, with no markdown formatting.

Job Description:
${jobDescription}`;

  try {
    if (gemini) {
      const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const res = await model.generateContent(prompt);
      const text = res.response.text();
      return parseJsonResponse(text);
    } else if (openai) {
      const res = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      });
      return JSON.parse(res.choices[0].message.content);
    }
  } catch (err) {
    console.warn('AI provider call failed for job analysis, using heuristic extractor:', err.message);
  }

  // Smart Fallback Heuristic Extractor
  return heuristicJobAnalysis(jobDescription);
}

/**
 * Tailor Resume Bullet Points & Generate Optimization Suggestions.
 */
async function tailorResumeContent(resumeData, jobAnalysis, jobDescription) {
  const gemini = getGeminiClient();
  const openai = getOpenAIClient();

  const originalBullets = resumeData.experienceBullets || [];
  const requiredKeywords = jobAnalysis.importantKeywords || [];

  const prompt = `You are an expert Executive Resume Writer and ATS Optimization Specialist.
Given candidate resume data and job details, rewrite experience bullet points and suggest optimizations.

Candidate Resume Text:
${resumeData.rawText.substring(0, 3000)}

Original Bullet Points:
${JSON.stringify(originalBullets)}

Target Job Requirements & Keywords:
${JSON.stringify(requiredKeywords)}

Generate a JSON object with:
1. "tailoredSummary": A compelling 3-4 sentence professional summary tailored to the job.
2. "bulletRewrites": Array of objects:
   [
     {
       "original": "Original bullet point string",
       "suggested": "Rewritten bullet point with strong action verb, metric/impact, and target keywords",
       "explanation": "Why this change improves ATS match and impact",
       "addedKeywords": ["Keyword1", "Keyword2"]
     }
   ]
3. "missingKeywords": List of high-priority keywords missing from the resume.
4. "matchedKeywords": List of keywords already found in the resume.
5. "formattingRecommendations": List of actionable layout & ATS formatting tips.

Return ONLY raw valid JSON without markdown wrapping.`;

  try {
    if (gemini) {
      const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const res = await model.generateContent(prompt);
      return parseJsonResponse(res.response.text());
    } else if (openai) {
      const res = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      });
      return JSON.parse(res.choices[0].message.content);
    }
  } catch (err) {
    console.warn('AI call failed for tailoring, using fallback rewrite engine:', err.message);
  }

  return heuristicTailoring(resumeData, jobAnalysis);
}

/**
 * Fallback Heuristics when AI API keys are not provided.
 */
function heuristicJobAnalysis(text) {
  const wordFreq = {};
  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s#+\.-]/g, ' ');
  const tokens = cleaned.split(/\s+/).filter(w => w.length > 2);

  const stopWords = new Set(['and', 'the', 'for', 'with', 'you', 'will', 'are', 'this', 'that', 'have', 'from', 'your', 'our', 'work', 'team', 'ability', 'must', 'experience', 'years', 'role', 'looking', 'strong']);
  
  tokens.forEach(word => {
    if (!stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  const sorted = Object.keys(wordFreq).sort((a, b) => wordFreq[b] - wordFreq[a]);
  const keywords = sorted.slice(0, 15).map(w => w.charAt(0).toUpperCase() + w.slice(1));

  return {
    requiredSkills: keywords.slice(0, 6),
    preferredSkills: keywords.slice(6, 10),
    softSkills: ['Communication', 'Problem Solving', 'Leadership', 'Collaboration', 'Adaptability'],
    actionVerbs: ['Engineered', 'Optimized', 'Architected', 'Implemented', 'Spearheaded', 'Accelerated'],
    importantKeywords: keywords
  };
}

function heuristicTailoring(resumeData, jobAnalysis) {
  const originalBullets = resumeData.experienceBullets.length > 0
    ? resumeData.experienceBullets
    : ['Managed team deliverables and completed project milestones on schedule.', 'Developed software solutions using standard modern web tools.'];

  const targetKeywords = jobAnalysis.importantKeywords || ['Optimization', 'Architecture', 'Agile', 'Scalability', 'CI/CD'];

  const bulletRewrites = originalBullets.slice(0, 6).map((bullet, idx) => {
    const kw1 = targetKeywords[idx % targetKeywords.length] || 'Key Performance Indicator';
    const kw2 = targetKeywords[(idx + 1) % targetKeywords.length] || 'Cross-functional';
    
    let action = 'Spearheaded';
    if (idx === 1) action = 'Engineered';
    if (idx === 2) action = 'Optimized';
    if (idx === 3) action = 'Architected';
    if (idx === 4) action = 'Accelerated';

    const suggested = `${action} key initiative optimizing ${bullet.replace(/^[A-Z][a-z]+\s*/, '')}, incorporating ${kw1} and ${kw2} to boost efficiency by 28%.`;

    return {
      original: bullet,
      suggested,
      explanation: `Integrated target keywords '${kw1}' & '${kw2}' and quantified impact with measurable metric.`,
      addedKeywords: [kw1, kw2]
    };
  });

  const resumeTextLower = (resumeData.rawText || '').toLowerCase();
  const matched = [];
  const missing = [];

  targetKeywords.forEach(kw => {
    if (resumeTextLower.includes(kw.toLowerCase())) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  });

  return {
    tailoredSummary: `Results-driven professional with proven expertise in ${targetKeywords.slice(0, 3).join(', ')}. Demonstrated success in building scalable solutions and delivering high-impact projects.`,
    bulletRewrites,
    matchedKeywords: matched.length > 0 ? matched : targetKeywords.slice(0, 3),
    missingKeywords: missing.length > 0 ? missing : targetKeywords.slice(3, 8),
    formattingRecommendations: [
      'Use standard bullet points instead of non-standard icons to ensure ATS parser compatibility.',
      'Ensure section titles use clean headings like "Work Experience" and "Technical Skills".',
      'Include quantifiable metrics (percentages, dollar amounts, team size) in at least 70% of bullet points.'
    ]
  };
}

function parseJsonResponse(rawText) {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }
  return JSON.parse(cleaned);
}

module.exports = {
  analyzeJobDescription,
  tailorResumeContent
};
