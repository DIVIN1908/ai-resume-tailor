const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  originalFileName: String,
  candidateName: String,
  jobTitle: String,
  jobDescription: String,
  rawResumeText: String,
  parsedSections: Object,
  atsScore: Object,
  jobAnalysis: Object,
  tailoredData: Object,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', ResumeSchema);
