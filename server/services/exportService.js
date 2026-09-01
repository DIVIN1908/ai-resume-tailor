const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');

/**
 * Generate a formatted DOCX document from tailored resume sections.
 */
async function generateDocxResume(tailoredData, candidateName = 'Tailored Resume') {
  const summaryText = tailoredData.summary || tailoredData.tailoredSummary || '';
  const bulletRewrites = tailoredData.bulletRewrites || [];
  const skills = tailoredData.matchedKeywords || tailoredData.skills || [];

  const children = [];

  // Candidate Name / Title Header
  children.push(
    new Paragraph({
      text: candidateName.toUpperCase(),
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    })
  );

  // Professional Summary Section
  if (summaryText) {
    children.push(
      new Paragraph({
        text: 'PROFESSIONAL SUMMARY',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({
        text: summaryText,
        spacing: { after: 200 }
      })
    );
  }

  // Work Experience Section with Tailored Bullets
  if (bulletRewrites.length > 0) {
    children.push(
      new Paragraph({
        text: 'WORK EXPERIENCE & KEY ACHIEVEMENTS',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      })
    );

    bulletRewrites.forEach(b => {
      const textToUse = b.accepted ? b.suggested : (b.suggested || b.original);
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: '•  ' }),
            new TextRun({ text: textToUse })
          ],
          spacing: { after: 80 }
        })
      );
    });
  }

  // Technical & Key Skills Section
  if (skills.length > 0) {
    children.push(
      new Paragraph({
        text: 'CORE COMPETENCIES & TECHNICAL SKILLS',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({
        text: skills.join('  •  '),
        spacing: { after: 200 }
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children
      }
    ]
  });

  return await Packer.toBuffer(doc);
}

module.exports = {
  generateDocxResume
};
