# SmartGaters - AI-Powered HR Assistant

A comprehensive HR management platform powered by artificial intelligence to streamline the entire recruitment process from job description creation to candidate evaluation and communication.

## 🚀 Features

### 0. **Multi-Language Support**
- Language selector in the top right corner
- Support for English, Arabic, and Turkish
- URL query parameter support (`?lang=en`, `?lang=ar`, `?lang=tr`)
- RTL (Right-to-Left) layout support for Arabic
- Complete UI translation for all supported languages

### 1. **Job Description Generator**
- Create compelling, professional job descriptions with AI
- Tailored for different experience levels (Entry, Mid, Senior)
- Structured format with company overview, responsibilities, qualifications, and benefits
- Industry-specific customization based on department

### 2. **CV Scoring & Evaluation**
- AI-powered CV analysis against job requirements
- Comprehensive scoring system (0-100) with detailed criteria
- Brief, actionable justifications for each candidate
- Multi-criteria evaluation including skills, experience, education, and cultural fit

### 3. **Custom Interview Questions**
- Generate tailored interview questions for selected candidates
- Three categories: Technical, Behavioral, and Situational
- Focus on specific skills or evaluation goals
- Questions based on candidate's CV and job requirements

### 4. **Offer & Rejection Letters**
- Automated generation of professional letters
- Personalized content based on candidate information
- Support for both offer and rejection scenarios
- Include salary and start date details for offers

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
   - Upload multiple CV files (PDF/TXT format)
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

### Key Features

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Processing**: AI-powered features with loading states
- **Export Functionality**: Download generated letters as text files
- **Copy to Clipboard**: Easy copying of generated content
- **Form Validation**: Comprehensive input validation with error handling

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

---

**SmartGaters** - Revolutionizing HR with AI-powered recruitment solutions.
