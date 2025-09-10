import type { Language } from "@/components/ui/language-selector";

export const translations = {
  en: {
    // Header
    jobDescriptionGenerator: "Job Description Generator",
    jobDescriptionDescription: "Transform your hiring vision into compelling job descriptions that attract top talent. Our AI analyzes industry standards and best practices to create detailed, engaging job postings.",
    cvUploadScoring: "CV Analysis & Scoring",
    cvUploadDescription: "Intelligently evaluate candidate profiles against your job requirements. Our AI provides detailed scoring, skill matching, and candidate insights to help you make informed decisions.",
    customInterviewQuestions: "Smart Interview Questions",
    customInterviewDescription: "Generate personalized interview questions tailored to {candidateName}'s background and your role requirements. Get technical, behavioral, and situational questions that reveal true potential.",
    offerRejectionLetter: "Candidate Communication",
    offerRejectionDescription: "Create professional, personalized letters for {candidateName}. Whether extending an offer or providing feedback, maintain your brand's professional image with AI-crafted communications.",
    hiringPipelineTracker: "Hiring Pipeline Tracker",
    hiringPipelineDescription: "Track your candidates through each stage of the hiring process. Monitor progress, manage interviews, and maintain a clear overview of your active recruitment pipeline.",
    
    // Form labels
    jobTitle: "Job Title",
    companyName: "Company Name",
    department: "Department",
    experienceLevel: "Experience Level",
    technologies: "Technologies",
    skills: "Required Skills",
    yearsOfExperience: "Years of Experience",
    qualifications: "Qualifications",
    decision: "Decision",
    salary: "Salary",
    startDate: "Start Date",
    candidateName: "Candidate Name",
    
    // Placeholders
    jobTitlePlaceholder: "e.g., Senior Frontend Developer",
    companyNamePlaceholder: "e.g., TalentFlow",
    departmentPlaceholder: "e.g., Engineering",
    technologiesPlaceholder: "e.g., React, Node.js, TypeScript, AWS",
    skillsPlaceholder: "e.g., Problem-solving, Team leadership, Agile methodology",
    qualificationsPlaceholder: "e.g., Bachelor's degree in Computer Science, 5+ years experience",
    salaryPlaceholder: "e.g., $120,000",
    focusSkillsPlaceholder: "Optional: Focus skills or evaluation goals (e.g., React hooks, team collaboration)",
    manualJobDescriptionLabel: "Job Description",
    manualJobDescriptionPlaceholder: "Paste or type your job description here...",
    yearsOfExperiencePlaceholder: "e.g., 5",
    
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
    uploadCVs: "Upload CVs (PDF/TXT/DOCX)",
    selectedFiles: "Selected files:",
    
    // Results
    generatedJobDescription: "Generated Job Description",
    scoringResults: "Scoring Results",
    generatedInterviewQuestions: "Generated Interview Questions",
    generatedLetter: "Generated Letter",
    pipelineTracker: "Pipeline Tracker",
    
    // Pipeline Stages
    applied: "Applied",
    screened: "Screened", 
    interviewed: "Interviewed",
    offered: "Offered",
    hired: "Hired",
    rejected: "Rejected",
    moveToNextStage: "Move to Next Stage",
    rejectCandidate: "Reject Candidate",
    addNotes: "Add Notes",
    candidateNotes: "Candidate Notes",
    stageProgress: "Stage Progress",
    totalCandidates: "Total Candidates",
    activeCandidates: "Active Candidates",
    
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
    allRightsReserved: "© {year} Hamza Sallam. All rights reserved.",
  },
  
  ar: {
    // Header
    jobDescriptionGenerator: "مولد وصف الوظيفة",
    jobDescriptionDescription: "حول رؤيتك التوظيفية إلى أوصاف وظائف مقنعة تجذب أفضل المواهب. يحلل ذكاؤنا الاصطناعي المعايير الصناعية وأفضل الممارسات لإنشاء إعلانات وظائف مفصلة وجذابة.",
    cvUploadScoring: "تحليل وتقييم السير الذاتية",
    cvUploadDescription: "تقييم ملفات المرشحين بذكاء مقابل متطلبات وظيفتك. يوفر ذكاؤنا الاصطناعي تقييماً مفصلاً ومطابقة المهارات ورؤى المرشحين لمساعدتك في اتخاذ قرارات مدروسة.",
    customInterviewQuestions: "أسئلة المقابلة الذكية",
    customInterviewDescription: "إنشاء أسئلة مقابلة شخصية مصممة خصيصاً لخلفية {candidateName} ومتطلبات دورك. احصل على أسئلة تقنية وسلوكية وموقفية تكشف الإمكانات الحقيقية.",
    offerRejectionLetter: "تواصل المرشحين",
    offerRejectionDescription: "إنشاء خطابات مهنية وشخصية لـ {candidateName}. سواء كان تقديم عرض أو تقديم ملاحظات، حافظ على الصورة المهنية لعلامتك التجارية مع اتصالات مصممة بالذكاء الاصطناعي.",
    hiringPipelineTracker: "متتبع خط أنابيب التوظيف",
    hiringPipelineDescription: "تتبع مرشحيك عبر كل مرحلة من مراحل عملية التوظيف. راقب التقدم، وأدر المقابلات، وحافظ على نظرة عامة واضحة على خط التوظيف النشط.",
    
    // Form labels
    jobTitle: "مسمى الوظيفة",
    companyName: "اسم الشركة",
    department: "القسم",
    experienceLevel: "مستوى الخبرة",
    technologies: "التقنيات",
    skills: "المهارات المطلوبة",
    qualifications: "المؤهلات",
    decision: "القرار",
    salary: "الراتب",
    startDate: "تاريخ البدء",
    candidateName: "اسم المرشح",
    
    // Placeholders
    jobTitlePlaceholder: "مثال: مطور واجهة أمامية كبير",
    companyNamePlaceholder: "مثال: TalentFlow",
    departmentPlaceholder: "مثال: الهندسة",
    technologiesPlaceholder: "مثال: React، Node.js، TypeScript، AWS",
    skillsPlaceholder: "مثال: حل المشاكل، قيادة الفريق، منهجية Agile",
    qualificationsPlaceholder: "مثال: درجة البكالوريوس في علوم الحاسوب، خبرة 5+ سنوات",
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
    uploadCVs: "رفع السير الذاتية (PDF/TXT/DOCX)",
    selectedFiles: "الملفات المختارة:",
    
    // Results
    generatedJobDescription: "وصف الوظيفة المُنشأ",
    scoringResults: "نتائج التقييم",
    generatedInterviewQuestions: "أسئلة المقابلة المُنشأة",
    generatedLetter: "الخطاب المُنشأ",
    pipelineTracker: "متتبع الخط",
    
    // Pipeline Stages
    applied: "تقدم",
    screened: "تم الفحص",
    interviewed: "تمت المقابلة",
    offered: "تم العرض",
    hired: "تم التوظيف",
    rejected: "مرفوض",
    moveToNextStage: "الانتقال للمرحلة التالية",
    rejectCandidate: "رفض المرشح",
    addNotes: "إضافة ملاحظات",
    candidateNotes: "ملاحظات المرشح",
    stageProgress: "تقدم المرحلة",
    totalCandidates: "إجمالي المرشحين",
    activeCandidates: "المرشحون النشطون",
    
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
    allRightsReserved: "© {year} Hamza Sallam. جميع الحقوق محفوظة.",
  },
  
  tr: {
    // Header
    jobDescriptionGenerator: "İş Tanımı Oluşturucu",
    jobDescriptionDescription: "İşe alım vizyonunuzu en iyi yetenekleri çeken etkileyici iş tanımlarına dönüştürün. Yapay zekamız endüstri standartlarını ve en iyi uygulamaları analiz ederek detaylı, ilgi çekici iş ilanları oluşturur.",
    cvUploadScoring: "CV Analizi ve Puanlama",
    cvUploadDescription: "Aday profillerini iş gereksinimlerinize göre akıllıca değerlendirin. Yapay zekamız bilinçli kararlar vermenize yardımcı olmak için detaylı puanlama, yetenek eşleştirme ve aday içgörüleri sağlar.",
    customInterviewQuestions: "Akıllı Mülakat Soruları",
    customInterviewDescription: "{candidateName}'in geçmişi ve rol gereksinimlerinize göre kişiselleştirilmiş mülakat soruları oluşturun. Gerçek potansiyeli ortaya çıkaran teknik, davranışsal ve durumsal sorular alın.",
    offerRejectionLetter: "Aday İletişimi",
    offerRejectionDescription: "{candidateName} için profesyonel, kişiselleştirilmiş mektuplar oluşturun. Teklif sunsun veya geri bildirim sağlasın, yapay zeka ile tasarlanmış iletişimlerle markanızın profesyonel imajını koruyun.",
    hiringPipelineTracker: "İşe Alım Hattı Takipçisi",
    hiringPipelineDescription: "Adaylarınızı işe alım sürecinin her aşamasında takip edin. İlerlemeyi izleyin, mülakatları yönetin ve aktif işe alım hattınızın net bir genel görünümünü koruyun.",
    
    // Form labels
    jobTitle: "İş Unvanı",
    companyName: "Şirket Adı",
    department: "Departman",
    experienceLevel: "Deneyim Seviyesi",
    technologies: "Teknolojiler",
    skills: "Gerekli Beceriler",
    qualifications: "Nitelikler",
    decision: "Karar",
    salary: "Maaş",
    startDate: "Başlangıç Tarihi",
    candidateName: "Aday Adı",
    
    // Placeholders
    jobTitlePlaceholder: "örn: Kıdemli Frontend Geliştirici",
    companyNamePlaceholder: "örn: TalentFlow",
    departmentPlaceholder: "örn: Mühendislik",
    technologiesPlaceholder: "örn: React, Node.js, TypeScript, AWS",
    skillsPlaceholder: "örn: Problem çözme, Takım liderliği, Agile metodolojisi",
    qualificationsPlaceholder: "örn: Bilgisayar Mühendisliği lisans derecesi, 5+ yıl deneyim",
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
    uploadCVs: "CV'leri Yükle (PDF/TXT/DOCX)",
    selectedFiles: "Seçilen dosyalar:",
    
    // Results
    generatedJobDescription: "Oluşturulan İş Tanımı",
    scoringResults: "Puanlama Sonuçları",
    generatedInterviewQuestions: "Oluşturulan Mülakat Soruları",
    generatedLetter: "Oluşturulan Mektup",
    pipelineTracker: "Hattı Takipçisi",
    
    // Pipeline Stages
    applied: "Başvurdu",
    screened: "Taranmış",
    interviewed: "Mülakat Yapıldı",
    offered: "Teklif Edildi",
    hired: "İşe Alındı",
    rejected: "Reddedildi",
    moveToNextStage: "Sonraki Aşamaya Geç",
    rejectCandidate: "Adayı Reddet",
    addNotes: "Not Ekle",
    candidateNotes: "Aday Notları",
    stageProgress: "Aşama İlerlemesi",
    totalCandidates: "Toplam Aday",
    activeCandidates: "Aktif Adaylar",
    
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
    allRightsReserved: "© {year} Hamza Sallam. Tüm hakları saklıdır.",
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