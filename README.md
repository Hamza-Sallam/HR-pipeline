# TalentFlow - AI-Powered HR Pipeline

A comprehensive HR management platform powered by artificial intelligence to streamline the entire recruitment process from job description creation to candidate evaluation and communication. Built with modern web technologies and featuring multi-language support with RTL layout capabilities.

## 🚀 Features

### 🌍 **Multi-Language Support**
- Language selector in the top right corner
- Support for English, Arabic, and Turkish
- RTL (Right-to-Left) layout support for Arabic content
- Navbar and footer remain consistent across all languages
- Complete UI translation for all supported languages

### 📝 **Job Description Generator**
- Create compelling, professional job descriptions with AI
- Dual input modes: AI-generated or manual input
- Tailored for different experience levels (Entry, Mid, Senior)
- Years of experience field with validation
- Industry-specific customization based on department
- Structured format with company overview, responsibilities, qualifications, and benefits

### 📊 **CV Scoring & Evaluation**
- AI-powered CV analysis against job requirements
- Support for PDF, TXT, and DOCX file formats
- Comprehensive scoring system (0-100) with detailed criteria
- Brief, actionable justifications for each candidate
- Multi-criteria evaluation including skills, experience, education, and cultural fit
- Bulk upload and processing capabilities

### 🎯 **Custom Interview Questions**
- Generate tailored interview questions for selected candidates
- Three categories: Technical, Behavioral, and Situational
- Focus on specific skills or evaluation goals
- Questions based on candidate's CV and job requirements
- Expandable accordion interface for easy navigation

### 📧 **Offer & Rejection Letters**
- Automated generation of professional letters
- Personalized content based on candidate information
- Support for both offer and rejection scenarios
- Include salary and start date details for offers
- Professional formatting with company branding

### 🔄 **Hiring Pipeline Tracker**
- Visual pipeline management system
- Track candidates through multiple stages (Applied → Screened → Interviewed → Offered → Hired)
- Candidate notes and progress tracking
- Stage-based filtering and navigation
- Real-time pipeline statistics

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.3.3 with React 18
- **UI Components**: Radix UI with Tailwind CSS
- **AI Integration**: Genkit AI framework
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom components
- **Development**: TypeScript for type safety
- **Internationalization**: Custom translation system with RTL support

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Google AI API key (for Genkit AI functionality)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hr-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

### 4. Run the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:9002`

## 📖 Usage Guide

### Workflow Overview

1. **Generate Job Description**
   - Enter job title, department, and experience level
   - AI generates a comprehensive job description
   - Copy or use the generated description for job postings

2. **Upload and Score CVs**
   - Upload multiple CV files (PDF/TXT/DOCX format)
   - AI evaluates each CV against the job description
   - Review scores and justifications for each candidate

3. **Generate Interview Questions**
   - Select a candidate from the scored list
   - Optionally specify focus areas or skills
   - Generate tailored interview questions

4. **Create Communication Letters**
   - Choose between offer or rejection
   - Add salary and start date details for offers
   - Generate professional letters for candidates

5. **Manage Hiring Pipeline**
   - Track candidates through recruitment stages
   - Add notes and manage candidate progress
   - View pipeline statistics and analytics

### Key Features

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Processing**: AI-powered features with loading states
- **Export Functionality**: Download generated letters as text files
- **Copy to Clipboard**: Easy copying of generated content
- **Form Validation**: Comprehensive input validation with error handling
- **Multi-format Support**: Accept PDF, TXT, and DOCX files for CV uploads
- **RTL Layout**: Proper right-to-left layout support for Arabic language
- **Consistent Navigation**: Navbar and footer remain unchanged across languages

## 🏗️ Project Structure

```
src/
├── ai/
│   ├── flows/                    # AI workflow definitions
│   │   ├── cv-scoring.ts
│   │   ├── interview-question-generator.ts
│   │   ├── job-description-generator.ts
│   │   └── offer-rejection-letter-generator.ts
│   └── genkit.ts                 # AI configuration
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main application page
│   └── globals.css              # Global styles
├── components/                   # Reusable UI components
│   ├── icons/                   # Logo and icon components
│   └── ui/                      # Radix UI components
│       └── language-selector.tsx # Language selector component
├── contexts/                     # React contexts
│   ├── language-context.tsx     # Language management
│   └── rtl-context.tsx          # RTL layout support
├── hooks/                       # Custom React hooks
└── lib/                         # Utility functions
    └── translations.ts          # Translation definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with smooth animations
- **Interactive Elements**: Hover effects, loading states, and visual feedback
- **Accessibility**: Keyboard navigation and screen reader support
- **Mobile-First**: Responsive design that works on all device sizes
- **Dark/Light Theme**: Automatic theme adaptation based on system preferences

## 🔒 Security & Privacy

- **Data Protection**: Secure handling of sensitive CV and candidate information
- **API Security**: Encrypted communication with AI services
- **Input Validation**: Comprehensive validation to prevent malicious inputs
- **File Safety**: Secure file upload and processing mechanisms

## 🚀 Performance

- **Fast Loading**: Optimized bundle size and lazy loading
- **Efficient AI Processing**: Streamlined AI workflows for quick responses
- **Caching**: Smart caching strategies for improved performance
- **Error Handling**: Graceful error handling with user-friendly messages

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

**TalentFlow** - Revolutionizing HR with AI-powered recruitment solutions.
