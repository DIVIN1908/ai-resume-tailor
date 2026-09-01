/**
 * ATS Score Calculation Engine
 */

function calculateAtsScore(resumeData, jobAnalysis, tailoredData) {
  const resumeText = (resumeData.rawText || '').toLowerCase();
  const importantKeywords = jobAnalysis.importantKeywords || [];
  
  // 1. Keyword Overlap (40 Points)
  let matchedCount = 0;
  const keywordDetails = importantKeywords.map(kw => {
    const isPresent = resumeText.includes(kw.toLowerCase());
    if (isPresent) matchedCount++;
    return { keyword: kw, matched: isPresent };
  });

  const keywordScore = importantKeywords.length > 0 
    ? Math.round((matchedCount / importantKeywords.length) * 40)
    : 30;

  // 2. Section Completeness (20 Points)
  const sections = resumeData.sections || {};
  let sectionPoints = 0;
  if (sections.summary || resumeText.includes('summary')) sectionPoints += 4;
  if (sections.experience?.length > 0 || resumeText.includes('experience')) sectionPoints += 6;
  if (sections.education?.length > 0 || resumeText.includes('education')) sectionPoints += 5;
  if (sections.skills?.length > 0 || resumeText.includes('skill')) sectionPoints += 5;
  const sectionScore = Math.min(20, sectionPoints);

  // 3. Measurable Impact / Metrics (20 Points)
  const bullets = resumeData.experienceBullets || [];
  let metricsCount = 0;
  const numberRegex = /\b(\d+|\d+%\b|\$\d+)\b/;

  bullets.forEach(b => {
    if (numberRegex.test(b)) metricsCount++;
  });

  const impactRatio = bullets.length > 0 ? metricsCount / bullets.length : 0.5;
  const impactScore = Math.round(impactRatio * 20);

  // 4. Readability & Length Check (20 Points)
  let formatScore = 20;
  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
  
  if (wordCount < 150) formatScore -= 8;
  if (wordCount > 1500) formatScore -= 5;
  if (resumeText.includes('table') || resumeText.includes('graphic')) formatScore -= 4;

  const totalScore = Math.min(99, Math.max(10, keywordScore + sectionScore + impactScore + formatScore));

  let scoreTier = 'Needs Improvement';
  let badgeColor = '#ef4444';
  if (totalScore >= 85) {
    scoreTier = 'ATS Ready / Excellent';
    badgeColor = '#22c55e';
  } else if (totalScore >= 70) {
    scoreTier = 'Good Match';
    badgeColor = '#3b82f6';
  } else if (totalScore >= 50) {
    scoreTier = 'Moderate Match';
    badgeColor = '#f59e0b';
  }

  return {
    overallScore: totalScore,
    scoreTier,
    badgeColor,
    breakdown: {
      keywordMatch: { score: keywordScore, maxScore: 40, percentage: Math.round((keywordScore / 40) * 100) },
      sectionCompleteness: { score: sectionScore, maxScore: 20, percentage: Math.round((sectionScore / 20) * 100) },
      measurableImpact: { score: impactScore, maxScore: 20, percentage: Math.round((impactScore / 20) * 100) },
      formattingReadability: { score: formatScore, maxScore: 20, percentage: Math.round((formatScore / 20) * 100) }
    },
    keywordDetails,
    summaryStats: {
      totalWordCount: wordCount,
      totalBulletsAnalyzed: bullets.length,
      bulletsWithMetrics: metricsCount,
      matchedKeywordCount: matchedCount,
      totalTargetKeywords: importantKeywords.length
    }
  };
}

module.exports = {
  calculateAtsScore
};
