# 🎯 AI-Powered Resume Tailor & ATS Optimizer

An intelligent, full-stack web application that analyzes job descriptions, optimizes candidates' resumes for Applicant Tracking Systems (ATS), rewrites experience bullet points with quantifiable impact metrics, predicts ATS match scores, and exports tailored resumes as ATS-friendly Word `.docx` files.

---

## 🚀 Key Features

- 📄 **Resume File Upload**: Drag-and-drop support for PDF (`.pdf`) and Word (`.docx`) resumes with structure parsing.
- 🎯 **Job Description Keyword Analysis**: Automatically extracts mandatory technical skills, soft skills, and missing ATS keywords.
- 🤖 **AI Bullet Point Rewriter**: Rewrites work experience bullets using strong action verbs, quantifiable metrics, and target job keywords.
- 📊 **ATS Match Score Predictor**: Calculates a 0–100% compatibility score based on keyword overlap, section completeness, measurable metrics, and readability.
- 📥 **Formatted Export**: 1-click download of optimized resumes as formatted Word `.docx` documents.
- 📜 **Session History**: Persists past optimization sessions using MongoDB with in-memory fallback support.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons, Axios
- **Backend**: Node.js, Express.js, Multer, `pdf-parse`, `mammoth`, `docx`
- **AI Integration**: Google Gemini API / OpenAI API (with smart fallback heuristics)
- **Database**: MongoDB & Mongoose

---

## 💻 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-resume-tailor.git
   cd ai-resume-tailor
   ```

2. **Setup Backend**:
   ```bash
   cd server
   npm install
   # Create a .env file with your API keys (optional):
   # GEMINI_API_KEY=your_key_here
   # MONGODB_URI=mongodb://localhost:27017/resumetailor
   npm start
   ```

3. **Setup Frontend**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4. Open `http://localhost:3000` in your web browser.

---

## 📜 License

MIT License
