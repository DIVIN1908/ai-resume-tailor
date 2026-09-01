const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extract raw text from uploaded file buffer based on mimetype or filename extension.
 */
async function extractTextFromFile(fileBuffer, originalName, mimeType) {
  const ext = originalName.split('.').pop().toLowerCase();
  
  if (ext === 'pdf' || mimeType === 'application/pdf') {
    const data = await pdfParse(fileBuffer);
    return data.text || '';
  } else if (ext === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value || '';
  } else if (ext === 'txt') {
    return fileBuffer.toString('utf-8');
  } else {
    throw new Error(`Unsupported file type: .${ext}. Please upload PDF or DOCX file.`);
  }
}

/**
 * Parse raw text into structured resume sections and bullet points.
 */
function parseResumeStructure(rawText) {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  
  // Section headers identification
  const sectionKeywords = {
    summary: /^(summary|objective|profile|about me|professional summary)/i,
    experience: /^(experience|work experience|employment history|work history|professional experience|experience & achievements)/i,
    education: /^(education|academic background|qualifications)/i,
    skills: /^(skills|technical skills|key skills|core competencies|expertise|technologies)/i,
    projects: /^(projects|personal projects|key projects|academic projects)/i,
    certifications: /^(certifications|licenses|certifications & licenses|courses)/i
  };

  let currentSection = 'summary';
  const sections = {
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    raw: rawText
  };

  let bufferLines = [];

  const flushBuffer = (sec) => {
    if (bufferLines.length === 0) return;
    const blockText = bufferLines.join('\n');
    if (sec === 'summary') {
      sections.summary += (sections.summary ? '\n' : '') + blockText;
    } else {
      sections[sec].push(blockText);
    }
    bufferLines = [];
  };

  for (const line of lines) {
    let matchedSection = null;
    for (const [key, regex] of Object.entries(sectionKeywords)) {
      if (regex.test(line.replace(/[^a-zA-Z\s]/g, ''))) {
        matchedSection = key;
        break;
      }
    }

    if (matchedSection) {
      flushBuffer(currentSection);
      currentSection = matchedSection;
    } else {
      bufferLines.push(line);
    }
  }
  flushBuffer(currentSection);

  // Parse Experience Bullet Points specifically
  const experienceBullets = extractBulletPoints(sections.experience.join('\n'));
  const allBullets = extractBulletPoints(rawText);

  return {
    rawText,
    sections,
    experienceBullets,
    allBullets
  };
}

/**
 * Helper to identify individual bullet points or bullet-like lines.
 */
function extractBulletPoints(text) {
  if (!text) return [];
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const bullets = [];

  for (const line of lines) {
    // Check if line starts with a bullet indicator or looks like a feature bullet
    const cleanLine = line.replace(/^[\bullet\-\*•▪▸–—\d+\.]\s*/, '').trim();
    if (cleanLine.length > 15 && !cleanLine.endsWith(':')) {
      bullets.push(cleanLine);
    }
  }

  return bullets;
}

module.exports = {
  extractTextFromFile,
  parseResumeStructure,
  extractBulletPoints
};
