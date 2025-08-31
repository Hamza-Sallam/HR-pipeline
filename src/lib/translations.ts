import type { Language } from "@/components/ui/language-selector";

export const translations = {
  en: {
    // Header
    jobDescriptionGenerator: "Job Description Generator",
    jobDescriptionDescription: "Create a compelling job description with AI.",
    cvUploadScoring: "CV Upload & Scoring",
    cvUploadDescription: "Upload CVs to score them against the job description.",
    customInterviewQuestions: "Custom Interview Questions",
    customInterviewDescription: "Generate tailored questions for {candidateName}.",
    offerRejectionLetter: "Offer or Rejection Letter",
    offerRejectionDescription: "Generate a formal letter for {candidateName}.",
    
    // Form labels
    jobTitle: "Job Title",
    companyName: "Company Name",
    department: "Department",
    experienceLevel: "Experience Level",
    decision: "Decision",
    salary: "Salary",
    startDate: "Start Date",
    candidateName: "Candidate Name",
    
    // Placeholders
    jobTitlePlaceholder: "e.g., Senior Frontend Developer",
    companyNamePlaceholder: "e.g., SmartGaters",
    departmentPlaceholder: "e.g., Engineering",
    salaryPlaceholder: "e.g., $120,000",
    focusSkillsPlaceholder: "Optional: Focus skills or evaluation goals (e.g., React hooks, team collaboration)",
    manualJobDescriptionLabel: "Job Description",
    manualJobDescriptionPlaceholder: "Paste or type your job description here...",
    
    // Options
    entry: "Entry",
    mid: "Mid",
    senior: "Senior",
    offer: "Offer",
    reject: "Reject",
    selectLevel: "Select level",
    selectDecision: "Select decision",
    
    // Buttons
    generateJobDescription: "Generate Job Description",
    scoreCVs: "Score CVs",
    generateQuestions: "Generate Questions",
    generateLetter: "Generate Letter",
    select: "Select",
    generateWithAI: "Generate with AI",
    inputManually: "Input Manually",
    
    // Table headers
    candidateNameHeader: "Candidate Name",
    scoreHeader: "Score",
    justificationHeader: "Justification",
    actionHeader: "Action",
    
    // Accordion sections
    technicalQuestions: "Technical Questions",
    behavioralQuestions: "Behavioral Questions",
    situationalQuestions: "Situational Questions",
    
    // File upload
    uploadCVs: "Upload CVs (PDF/TXT)",
    selectedFiles: "Selected files:",
    
    // Results
    generatedJobDescription: "Generated Job Description",
    scoringResults: "Scoring Results",
    generatedInterviewQuestions: "Generated Interview Questions",
    generatedLetter: "Generated Letter",
    
    // Messages
    success: "Success",
    error: "Error",
    missingInformation: "Missing Information",
    copiedToClipboard: "Copied to clipboard!",
    jobDescriptionGenerated: "Job description generated.",
    cvsScored: "{count} CV(s) scored.",
    interviewQuestionsGenerated: "Interview questions generated.",
    letterGenerated: "{decision} letter generated.",
    failedToGenerateJobDescription: "Failed to generate job description.",
    failedToScoreCVs: "Failed to score CVs.",
    failedToGenerateQuestions: "Failed to generate questions.",
    failedToGenerateLetter: "Failed to generate letter.",
    pleaseGenerateJobDescriptionAndUploadCVs: "Please generate a job description and upload CVs first.",
    
    // Footer
    allRightsReserved: "© {year} SmartGaters. All rights reserved.",
  },
  
  ar: {
    // Header
    jobDescriptionGenerator: "مولد وصف الوظيفة",
    jobDescriptionDescription: "إنشاء وصف وظيفة مقنع باستخدام الذكاء الاصطناعي.",
    cvUploadScoring: "رفع وتقييم السير الذاتية",
    cvUploadDescription: "ارفع السير الذاتية لتقييمها مقابل وصف الوظيفة.",
    customInterviewQuestions: "أسئلة المقابلة المخصصة",
    customInterviewDescription: "إنشاء أسئلة مخصصة لـ {candidateName}.",
    offerRejectionLetter: "خطاب العرض أو الرفض",
    offerRejectionDescription: "إنشاء خطاب رسمي لـ {candidateName}.",
    
    // Form labels
    jobTitle: "مسمى الوظيفة",
    companyName: "اسم الشركة",
    department: "القسم",
    experienceLevel: "مستوى الخبرة",
    decision: "القرار",
    salary: "الراتب",
    startDate: "تاريخ البدء",
    candidateName: "اسم المرشح",
    
    // Placeholders
    jobTitlePlaceholder: "مثال: مطور واجهة أمامية كبير",
    companyNamePlaceholder: "مثال: SmartGaters",
    departmentPlaceholder: "مثال: الهندسة",
    salaryPlaceholder: "مثال: 120,000$",
    focusSkillsPlaceholder: "اختياري: مهارات التركيز أو أهداف التقييم (مثال: React hooks، التعاون الجماعي)",
    manualJobDescriptionLabel: "وصف الوظيفة",
    manualJobDescriptionPlaceholder: "الصق أو اكتب وصف الوظيفة هنا...",
    
    // Options
    entry: "مبتدئ",
    mid: "متوسط",
    senior: "كبير",
    offer: "عرض",
    reject: "رفض",
    selectLevel: "اختر المستوى",
    selectDecision: "اختر القرار",
    
    // Buttons
    generateJobDescription: "إنشاء وصف الوظيفة",
    scoreCVs: "تقييم السير الذاتية",
    generateQuestions: "إنشاء الأسئلة",
    generateLetter: "إنشاء الخطاب",
    select: "اختيار",
    generateWithAI: "إنشاء بالذكاء الاصطناعي",
    inputManually: "إدخال يدوي",
    
    // Table headers
    candidateNameHeader: "اسم المرشح",
    scoreHeader: "النتيجة",
    justificationHeader: "التبرير",
    actionHeader: "الإجراء",
    
    // Accordion sections
    technicalQuestions: "الأسئلة التقنية",
    behavioralQuestions: "الأسئلة السلوكية",
    situationalQuestions: "الأسئلة الموقفية",
    
    // File upload
    uploadCVs: "رفع السير الذاتية (PDF/TXT)",
    selectedFiles: "الملفات المختارة:",
    
    // Results
    generatedJobDescription: "وصف الوظيفة المُنشأ",
    scoringResults: "نتائج التقييم",
    generatedInterviewQuestions: "أسئلة المقابلة المُنشأة",
    generatedLetter: "الخطاب المُنشأ",
    
    // Messages
    success: "نجح",
    error: "خطأ",
    missingInformation: "معلومات مفقودة",
    copiedToClipboard: "تم النسخ إلى الحافظة!",
    jobDescriptionGenerated: "تم إنشاء وصف الوظيفة.",
    cvsScored: "تم تقييم {count} سيرة ذاتية.",
    interviewQuestionsGenerated: "تم إنشاء أسئلة المقابلة.",
    letterGenerated: "تم إنشاء خطاب {decision}.",
    failedToGenerateJobDescription: "فشل في إنشاء وصف الوظيفة.",
    failedToScoreCVs: "فشل في تقييم السير الذاتية.",
    failedToGenerateQuestions: "فشل في إنشاء الأسئلة.",
    failedToGenerateLetter: "فشل في إنشاء الخطاب.",
    pleaseGenerateJobDescriptionAndUploadCVs: "يرجى إنشاء وصف الوظيفة ورفع السير الذاتية أولاً.",
    
    // Footer
    allRightsReserved: "© {year} SmartGaters. جميع الحقوق محفوظة.",
  },
  
  tr: {
    // Header
    jobDescriptionGenerator: "İş Tanımı Oluşturucu",
    jobDescriptionDescription: "AI ile etkileyici bir iş tanımı oluşturun.",
    cvUploadScoring: "CV Yükleme ve Puanlama",
    cvUploadDescription: "CV'leri iş tanımına göre puanlamak için yükleyin.",
    customInterviewQuestions: "Özel Mülakat Soruları",
    customInterviewDescription: "{candidateName} için özel sorular oluşturun.",
    offerRejectionLetter: "Teklif veya Red Mektubu",
    offerRejectionDescription: "{candidateName} için resmi bir mektup oluşturun.",
    
    // Form labels
    jobTitle: "İş Unvanı",
    companyName: "Şirket Adı",
    department: "Departman",
    experienceLevel: "Deneyim Seviyesi",
    decision: "Karar",
    salary: "Maaş",
    startDate: "Başlangıç Tarihi",
    candidateName: "Aday Adı",
    
    // Placeholders
    jobTitlePlaceholder: "örn: Kıdemli Frontend Geliştirici",
    companyNamePlaceholder: "örn: SmartGaters",
    departmentPlaceholder: "örn: Mühendislik",
    salaryPlaceholder: "örn: 120,000$",
    focusSkillsPlaceholder: "İsteğe bağlı: Odaklanılacak beceriler veya değerlendirme hedefleri (örn: React hooks, takım işbirliği)",
    manualJobDescriptionLabel: "İş Tanımı",
    manualJobDescriptionPlaceholder: "İş tanımınızı buraya yapıştırın veya yazın...",
    
    // Options
    entry: "Giriş",
    mid: "Orta",
    senior: "Kıdemli",
    offer: "Teklif",
    reject: "Red",
    selectLevel: "Seviye seçin",
    selectDecision: "Karar seçin",
    
    // Buttons
    generateJobDescription: "İş Tanımı Oluştur",
    scoreCVs: "CV'leri Puanla",
    generateQuestions: "Soruları Oluştur",
    generateLetter: "Mektup Oluştur",
    select: "Seç",
    generateWithAI: "AI ile Oluştur",
    inputManually: "Manuel Gir",
    
    // Table headers
    candidateNameHeader: "Aday Adı",
    scoreHeader: "Puan",
    justificationHeader: "Gerekçe",
    actionHeader: "Eylem",
    
    // Accordion sections
    technicalQuestions: "Teknik Sorular",
    behavioralQuestions: "Davranışsal Sorular",
    situationalQuestions: "Durumsal Sorular",
    
    // File upload
    uploadCVs: "CV'leri Yükle (PDF/TXT)",
    selectedFiles: "Seçilen dosyalar:",
    
    // Results
    generatedJobDescription: "Oluşturulan İş Tanımı",
    scoringResults: "Puanlama Sonuçları",
    generatedInterviewQuestions: "Oluşturulan Mülakat Soruları",
    generatedLetter: "Oluşturulan Mektup",
    
    // Messages
    success: "Başarılı",
    error: "Hata",
    missingInformation: "Eksik Bilgi",
    copiedToClipboard: "Panoya kopyalandı!",
    jobDescriptionGenerated: "İş tanımı oluşturuldu.",
    cvsScored: "{count} CV puanlandı.",
    interviewQuestionsGenerated: "Mülakat soruları oluşturuldu.",
    letterGenerated: "{decision} mektubu oluşturuldu.",
    failedToGenerateJobDescription: "İş tanımı oluşturulamadı.",
    failedToScoreCVs: "CV'ler puanlanamadı.",
    failedToGenerateQuestions: "Sorular oluşturulamadı.",
    failedToGenerateLetter: "Mektup oluşturulamadı.",
    pleaseGenerateJobDescriptionAndUploadCVs: "Lütfen önce bir iş tanımı oluşturun ve CV'leri yükleyin.",
    
    // Footer
    allRightsReserved: "© {year} SmartGaters. Tüm hakları saklıdır.",
  },
} as const;

export function getTranslation(language: Language, key: keyof typeof translations.en, params?: Record<string, string | number>): string {
  const translation = translations[language][key] || translations.en[key];
  
  if (params) {
    return Object.entries(params).reduce((str, [param, value]) => {
      return str.replace(new RegExp(`{${param}}`, 'g'), String(value));
    }, translation);
  }
  
  return translation;
} 