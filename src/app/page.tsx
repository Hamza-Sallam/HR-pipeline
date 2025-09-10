"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateJobDescription, type GenerateJobDescriptionInput } from "@/ai/flows/job-description-generator";
import { cvScoring, type CvScoringOutput, type CvScoringInput } from "@/ai/flows/cv-scoring";
import { generateInterviewQuestions, type GenerateInterviewQuestionsInput, type GenerateInterviewQuestionsOutput } from "@/ai/flows/interview-question-generator";
import { offerRejectionLetterGenerator, type OfferRejectionLetterInput } from "@/ai/flows/offer-rejection-letter-generator";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/icons/logo";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useLanguage } from "@/contexts/language-context";
import { getTranslation } from "@/lib/translations";
import { Bot, Clipboard, Download, Loader2, Paperclip, Sparkles, FileText, Briefcase, UserCheck, BarChart3, TrendingUp, Users, Clock, Target, Award, ArrowRight, X, Plus, Edit3 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading...</span>
      </div>
    </div>
  );
}

// Schemas for form validation
const jdSchema = z.object({
  jobTitle: z.string().min(3, "Job title must be at least 3 characters."),
  companyName: z.string().min(2, "Company name must be at least 2 characters."),
  department: z.string().min(2, "Department must be at least 2 characters."),
  experienceLevel: z.enum(['Entry', 'Mid', 'Senior']),
  technologies: z.string().optional(),
  skills: z.string().optional(),
  qualifications: z.string().optional(),
});

const letterSchema = z.object({
  decision: z.enum(['Offer', 'Reject']),
  salary: z.string().optional(),
  startDate: z.string().optional(),
});

type SelectedCandidate = CvScoringOutput[0] & { cvSummary: string };

type PipelineStage = 'applied' | 'screened' | 'interviewed' | 'offered' | 'hired' | 'rejected';

interface PipelineCandidate {
  id: string;
  name: string;
  email: string;
  stage: PipelineStage;
  score?: number;
  notes: string;
  appliedDate: string;
  lastUpdated: string;
}

function HomeContent() {
  const { toast } = useToast();
  const { language } = useLanguage();

  // State management for the workflow
  const [jobDescription, setJobDescription] = useState<string | null>(null);
  const [isLoadingJD, setIsLoadingJD] = useState(false);

  const [cvFiles, setCvFiles] = useState<File[]>([]);
  const [cvScores, setCvScores] = useState<CvScoringOutput | null>(null);
  const [isLoadingScores, setIsLoadingScores] = useState(false);

  const [selectedCandidate, setSelectedCandidate] = useState<SelectedCandidate | null>(null);

  const [interviewQuestions, setInterviewQuestions] = useState<GenerateInterviewQuestionsOutput | null>(null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  
  const [letter, setLetter] = useState<string | null>(null);
  const [isLoadingLetter, setIsLoadingLetter] = useState(false);
  const [letterDecision, setLetterDecision] = useState<'Offer' | 'Reject'>('Reject');

  const [jdInputMode, setJdInputMode] = useState<'ai' | 'manual'>('ai');
  const [manualJobDescription, setManualJobDescription] = useState('');

  // Pipeline state
  const [pipelineCandidates, setPipelineCandidates] = useState<PipelineCandidate[]>([]);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');
  const [currentPipelineStage, setCurrentPipelineStage] = useState<PipelineStage>('applied');
  const [pipelineAnimation, setPipelineAnimation] = useState(false);

  // Form hooks
  const jdForm = useForm<z.infer<typeof jdSchema>>({
    resolver: zodResolver(jdSchema),
    defaultValues: { 
      jobTitle: "", 
      companyName: "TalentFlow", 
      department: "", 
      experienceLevel: "Mid",
      technologies: "",
      skills: "",
      qualifications: ""
    },
  });

  const letterForm = useForm<z.infer<typeof letterSchema>>({
    resolver: zodResolver(letterSchema),
    defaultValues: { decision: 'Reject', salary: '', startDate: '' },
  });

  // Reset downstream state when upstream state changes
  useEffect(() => {
    setCvScores(null);
    setSelectedCandidate(null);
  }, [jobDescription]);

  useEffect(() => {
    setInterviewQuestions(null);
    setLetter(null);
    if(selectedCandidate) {
      letterForm.reset({ decision: 'Reject', salary: '', startDate: '' });
      setLetterDecision('Reject');
    }
  }, [selectedCandidate, letterForm]);

  useEffect(() => {
    if (jdInputMode === 'manual') {
      setJobDescription(manualJobDescription || null);
    }
  }, [manualJobDescription, jdInputMode]);

  const handleGenerateDescription = async (values: z.infer<typeof jdSchema>) => {
    setIsLoadingJD(true);
    setJobDescription(null);
    try {
      const result = await generateJobDescription({ ...values, language });
      setJobDescription(result.jobDescription);
      toast({ title: getTranslation(language, "success"), description: getTranslation(language, "jobDescriptionGenerated") });
    } catch (error) {
      console.error(error);
      toast({ title: getTranslation(language, "error"), description: getTranslation(language, "failedToGenerateJobDescription"), variant: "destructive" });
    } finally {
      setIsLoadingJD(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleScoreCVs = async () => {
    if (!jobDescription || cvFiles.length === 0) {
      toast({ title: getTranslation(language, "missingInformation"), description: getTranslation(language, "pleaseGenerateJobDescriptionAndUploadCVs"), variant: "destructive" });
      return;
    }
    setIsLoadingScores(true);
    setCvScores(null);
    setSelectedCandidate(null);
    try {
      const cvDataUris = await Promise.all(cvFiles.map(fileToBase64));
      const input: CvScoringInput = { jobDescription, cvs: cvDataUris, language };
      const result = await cvScoring(input);
      setCvScores(result);
      toast({ title: getTranslation(language, "success"), description: getTranslation(language, "cvsScored", { count: result.length }) });
    } catch (error) {
      console.error(error);
      toast({ title: getTranslation(language, "error"), description: getTranslation(language, "failedToScoreCVs"), variant: "destructive" });
    } finally {
      setIsLoadingScores(false);
    }
  };
  
  const handleGenerateQuestions = async (data: { focusSkills?: string }) => {
    if (!jobDescription || !selectedCandidate) return;
    setIsLoadingQuestions(true);
    setInterviewQuestions(null);
    try {
      const input: GenerateInterviewQuestionsInput = {
        jobDescription,
        cvSummary: selectedCandidate.cvSummary,
        focusSkills: data.focusSkills,
        language,
      };
      const result = await generateInterviewQuestions(input);
      setInterviewQuestions(result);
      toast({ title: getTranslation(language, "success"), description: getTranslation(language, "interviewQuestionsGenerated") });
    } catch (error) {
      console.error(error);
      toast({ title: getTranslation(language, "error"), description: getTranslation(language, "failedToGenerateQuestions"), variant: "destructive" });
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleGenerateLetter = async (values: z.infer<typeof letterSchema>) => {
    if (!selectedCandidate || !jobDescription) return;
    setIsLoadingLetter(true);
    setLetter(null);
    const jdTitle = jdForm.getValues("jobTitle");
    const companyName = jdForm.getValues("companyName");
    try {
      const input: OfferRejectionLetterInput = {
        candidateName: selectedCandidate.candidateName,
        companyName: companyName,
        jobTitle: jdTitle,
        decision: values.decision,
        language,
        ...(values.decision === 'Offer' && { salary: values.salary, startDate: values.startDate }),
      };
      const result = await offerRejectionLetterGenerator(input);
      setLetter(result.letter);
      toast({ title: getTranslation(language, "success"), description: getTranslation(language, "letterGenerated", { decision: values.decision }) });
    } catch (error) {
      console.error(error);
      toast({ title: getTranslation(language, "error"), description: getTranslation(language, "failedToGenerateLetter"), variant: "destructive" });
    } finally {
      setIsLoadingLetter(false);
    }
  };
  
  const handleCopy = (text: string | null) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: getTranslation(language, "copiedToClipboard") });
  };
  
  const handleDownload = () => {
    if (!letter || !selectedCandidate) return;
    const element = document.createElement("a");
    const file = new Blob([letter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedCandidate.candidateName.replace(' ','_')}-${letterDecision}-Letter.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

  // Pipeline management functions
  const addCandidateToPipeline = (candidate: CvScoringOutput[0]) => {
    const newCandidate: PipelineCandidate = {
      id: Date.now().toString(),
      name: candidate.candidateName,
      email: `${candidate.candidateName.toLowerCase().replace(' ', '.')}@email.com`,
      stage: 'applied',
      score: candidate.score,
      notes: '',
      appliedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setPipelineCandidates(prev => [...prev, newCandidate]);
    toast({ title: getTranslation(language, "success"), description: `${candidate.candidateName} added to pipeline` });
  };

  const moveCandidateToStage = (candidateId: string, newStage: PipelineStage) => {
    setPipelineCandidates(prev => prev.map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, stage: newStage, lastUpdated: new Date().toISOString().split('T')[0] }
        : candidate
    ));
    toast({ title: getTranslation(language, "success"), description: "Candidate moved to next stage" });
  };

  const rejectCandidate = (candidateId: string) => {
    setPipelineCandidates(prev => prev.map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, stage: 'rejected', lastUpdated: new Date().toISOString().split('T')[0] }
        : candidate
    ));
    toast({ title: getTranslation(language, "success"), description: "Candidate rejected" });
  };

  const updateCandidateNotes = (candidateId: string, notes: string) => {
    setPipelineCandidates(prev => prev.map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, notes, lastUpdated: new Date().toISOString().split('T')[0] }
        : candidate
    ));
    setEditingNotes(null);
    setNotesText('');
    toast({ title: getTranslation(language, "success"), description: "Notes updated" });
  };


  const getStageStats = () => {
    const stats = {
      applied: 0,
      screened: 0,
      interviewed: 0,
      offered: 0,
      hired: 0,
      rejected: 0
    };
    pipelineCandidates.forEach(candidate => {
      stats[candidate.stage]++;
    });
    return stats;
  };

  const getCandidatesForStage = (stage: PipelineStage) => {
    return pipelineCandidates.filter(candidate => candidate.stage === stage);
  };

  const navigateToStage = (stage: PipelineStage) => {
    setPipelineAnimation(true);
    setTimeout(() => {
      setCurrentPipelineStage(stage);
      setPipelineAnimation(false);
    }, 150);
  };

  const getStageOrder = (): PipelineStage[] => {
    return ['applied', 'screened', 'interviewed', 'offered', 'hired'];
  };

  const getPreviousStage = (currentStage: PipelineStage): PipelineStage | null => {
    const stages = getStageOrder();
    const currentIndex = stages.indexOf(currentStage);
    return currentIndex > 0 ? stages[currentIndex - 1] : null;
  };

  const getNextStage = (currentStage: PipelineStage): PipelineStage | null => {
    const stages = getStageOrder();
    const currentIndex = stages.indexOf(currentStage);
    return currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;
  };


  return (
    <div className="min-h-screen bg-background">
      <header className="p-6 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Logo className="animate-fade-in-up" />
          <div className="animate-slide-in-right">
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 flex flex-col gap-8">
        {/* 1. Job Description Generator/Manual Input */}
        <Card className="shadow-lg hover-lift animate-fade-in-up">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl primary-bg shadow-lg hover-glow">
                <Briefcase className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold primary-text mb-2">{getTranslation(language, "jobDescriptionGenerator")}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{getTranslation(language, "jobDescriptionDescription")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ai" value={jdInputMode} onValueChange={(value) => setJdInputMode(value as 'ai' | 'manual')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/30 p-1 rounded-lg">
                <TabsTrigger 
                  value="ai" 
                  className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 hover:bg-white/50"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {getTranslation(language, "generateWithAI")}
                </TabsTrigger>
                <TabsTrigger 
                  value="manual" 
                  className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 hover:bg-white/50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {getTranslation(language, "inputManually")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="ai">
                <Form {...jdForm}>
                  <form onSubmit={jdForm.handleSubmit(handleGenerateDescription)}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={jdForm.control} name="jobTitle" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{getTranslation(language, "jobTitle")}</FormLabel>
                          <FormControl><Input placeholder={getTranslation(language, "jobTitlePlaceholder")} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={jdForm.control} name="companyName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{getTranslation(language, "companyName")}</FormLabel>
                          <FormControl><Input placeholder={getTranslation(language, "companyNamePlaceholder")} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={jdForm.control} name="department" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{getTranslation(language, "department")}</FormLabel>
                          <FormControl><Input placeholder={getTranslation(language, "departmentPlaceholder")} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={jdForm.control} name="experienceLevel" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{getTranslation(language, "experienceLevel")}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder={getTranslation(language, "selectLevel")} /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="Entry">{getTranslation(language, "entry")}</SelectItem>
                              <SelectItem value="Mid">{getTranslation(language, "mid")}</SelectItem>
                              <SelectItem value="Senior">{getTranslation(language, "senior")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold primary-text">Additional Details (Optional)</h4>
                      <div className="grid md:grid-cols-1 gap-4">
                        <FormField control={jdForm.control} name="technologies" render={({ field }) => (
                          <FormItem>
                            <FormLabel>{getTranslation(language, "technologies")}</FormLabel>
                            <FormControl><Input placeholder={getTranslation(language, "technologiesPlaceholder")} {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={jdForm.control} name="skills" render={({ field }) => (
                          <FormItem>
                            <FormLabel>{getTranslation(language, "skills")}</FormLabel>
                            <FormControl><Input placeholder={getTranslation(language, "skillsPlaceholder")} {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={jdForm.control} name="qualifications" render={({ field }) => (
                          <FormItem>
                            <FormLabel>{getTranslation(language, "qualifications")}</FormLabel>
                            <FormControl><Input placeholder={getTranslation(language, "qualificationsPlaceholder")} {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>
                    <CardFooter className="flex justify-end pt-6">
                      <Button type="submit" disabled={isLoadingJD} size="lg" className="min-w-[200px]">
                        {isLoadingJD ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        {getTranslation(language, "generateJobDescription")}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
                {isLoadingJD && (
                  <div className="mt-4">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                )}
                {jobDescription && !isLoadingJD && (
                  <div className="mt-4">
                    <Label>{getTranslation(language, "generatedJobDescription")}</Label>
                    <Textarea readOnly value={jobDescription} className="h-64 bg-secondary/50" />
                  </div>
                )}
              </TabsContent>
              <TabsContent value="manual">
                <Label>{getTranslation(language, "manualJobDescriptionLabel")}</Label>
                <Textarea
                  value={manualJobDescription}
                  onChange={e => {
                    setManualJobDescription(e.target.value);
                    setJobDescription(e.target.value || null);
                  }}
                  placeholder="Paste the full job description here. More detail helps the AI score CVs more accurately."
                  className="h-64"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 2. CV Upload & Scoring */}
        <Card className={`shadow-lg hover-lift animate-fade-in-up transition-all duration-300 ${!jobDescription ? 'opacity-50 pointer-events-none' : ''}`}>
          <CardHeader className="pb-6">
             <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl secondary-bg shadow-lg hover-glow">
                <UserCheck className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold primary-text mb-2">{getTranslation(language, "cvUploadScoring")}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{getTranslation(language, "cvUploadDescription")}</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cv-upload">{getTranslation(language, "uploadCVs")}</Label>
              <Input id="cv-upload" type="file" multiple onChange={(e) => setCvFiles(Array.from(e.target.files || []))} className="mt-1 file:text-primary file:font-semibold"/>
            </div>
            {cvFiles.length > 0 && (
                <div className="text-sm text-muted-foreground space-y-1">
                    <p className="font-medium">{getTranslation(language, "selectedFiles")}</p>
                    <ul className="list-disc pl-5">
                        {cvFiles.map((file, i) => <li key={i}>{file.name}</li>)}
                    </ul>
                </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end pt-6">
            <Button onClick={handleScoreCVs} disabled={isLoadingScores || cvFiles.length === 0} size="lg" className="min-w-[160px]">
              {isLoadingScores ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
              {getTranslation(language, "scoreCVs")}
            </Button>
          </CardFooter>
        </Card>

        {(isLoadingScores || cvScores) && (
            <Card className="shadow-lg hover-lift animate-fade-in-up">
                <CardHeader className="pb-6"><CardTitle className="text-2xl font-bold primary-text">{getTranslation(language, "scoringResults")}</CardTitle></CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{getTranslation(language, "candidateNameHeader")}</TableHead>
                            <TableHead className="w-[100px] text-center">{getTranslation(language, "scoreHeader")}</TableHead>
                            <TableHead>{getTranslation(language, "justificationHeader")}</TableHead>
                            <TableHead className="w-[120px] text-right">{getTranslation(language, "actionHeader")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoadingScores ? (
                           Array.from({length:3}).map((_, i) => (
                             <TableRow key={i}>
                               <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                               <TableCell><Skeleton className="h-5 w-16 mx-auto" /></TableCell>
                               <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                               <TableCell><Skeleton className="h-9 w-24 float-right" /></TableCell>
                            </TableRow>
                           ))
                        ) : (
                            cvScores?.map((score, index) => (
                                <TableRow key={index} className={selectedCandidate?.candidateName === score.candidateName ? 'bg-primary/5' : ''}>
                                    <TableCell className="font-medium">{score.candidateName}</TableCell>
                                    <TableCell className="text-center font-bold text-lg">{score.score}</TableCell>
                                    <TableCell className="text-muted-foreground">{score.justification}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Button size="sm" onClick={() => setSelectedCandidate({...score, cvSummary: score.justification})}>
                                                {getTranslation(language, "select")}
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => addCandidateToPipeline(score)}>
                                                <Plus className="h-3 w-3 mr-1" />
                                                Add to Pipeline
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        )}

        {/* 3. Custom Interview Questions */}
        <Card className={`shadow-lg hover-lift animate-fade-in-up transition-all duration-300 ${!selectedCandidate ? 'opacity-50 pointer-events-none' : ''}`}>
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl accent-bg shadow-lg hover-glow">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold primary-text mb-2">{getTranslation(language, "customInterviewQuestions")}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{getTranslation(language, "customInterviewDescription", { candidateName: selectedCandidate?.candidateName || 'the candidate' })}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleGenerateQuestions({ focusSkills: (e.target as any).focusSkills.value }); }}>
            <CardContent className="space-y-4">
              <Input name="focusSkills" placeholder={getTranslation(language, "focusSkillsPlaceholder")} />
            </CardContent>
            <CardFooter className="flex justify-end pt-6">
              <Button type="submit" disabled={isLoadingQuestions} size="lg" className="min-w-[180px]">
                {isLoadingQuestions ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {getTranslation(language, "generateQuestions")}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {(isLoadingQuestions || interviewQuestions) && (
             <Card className="shadow-lg hover-lift animate-fade-in-up">
                <CardHeader className="pb-6">
                    <CardTitle className="text-2xl font-bold primary-text">{getTranslation(language, "generatedInterviewQuestions")}</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoadingQuestions ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : (
                        interviewQuestions && (
                            <Accordion type="multiple" className="w-full">
                                <AccordionItem value="technical">
                                    <AccordionTrigger>{getTranslation(language, "technicalQuestions")}</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                            {interviewQuestions.technicalQuestions.map((q, i) => <li key={`tech-${i}`}>{q}</li>)}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="behavioral">
                                    <AccordionTrigger>{getTranslation(language, "behavioralQuestions")}</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                            {interviewQuestions.behavioralQuestions.map((q, i) => <li key={`behav-${i}`}>{q}</li>)}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="situational">
                                    <AccordionTrigger>{getTranslation(language, "situationalQuestions")}</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                            {interviewQuestions.situationalQuestions.map((q, i) => <li key={`sit-${i}`}>{q}</li>)}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        )
                    )}
                </CardContent>
            </Card>
        )}

        {/* 4. Offer or Rejection Letter */}
        <Card className={`shadow-lg hover-lift animate-fade-in-up transition-all duration-300 ${!selectedCandidate ? 'opacity-50 pointer-events-none' : ''}`}>
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl primary-bg shadow-lg hover-glow">
                <Paperclip className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold primary-text mb-2">{getTranslation(language, "offerRejectionLetter")}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{getTranslation(language, "offerRejectionDescription", { candidateName: selectedCandidate?.candidateName || 'the candidate' })}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <Form {...letterForm}>
            <form onSubmit={letterForm.handleSubmit(handleGenerateLetter)}>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>{getTranslation(language, "candidateName")}</Label>
                    <Input disabled value={selectedCandidate?.candidateName || ''} />
                </div>
                <div className="space-y-2">
                    <Label>{getTranslation(language, "jobTitle")}</Label>
                    <Input disabled value={jdForm.watch('jobTitle') || ''} />
                </div>
                <FormField control={letterForm.control} name="decision" render={({ field }) => (
                  <FormItem>
                                      <FormLabel>{getTranslation(language, "decision")}</FormLabel>
                  <Select onValueChange={(value: 'Offer' | 'Reject') => { field.onChange(value); setLetterDecision(value); }} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder={getTranslation(language, "selectDecision")} /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Offer">{getTranslation(language, "offer")}</SelectItem>
                      <SelectItem value="Reject">{getTranslation(language, "reject")}</SelectItem>
                    </SelectContent>
                  </Select>
                  </FormItem>
                )} />
                <div className={`grid md:grid-cols-2 gap-6 transition-opacity ${letterDecision === 'Offer' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                   <FormField control={letterForm.control} name="salary" render={({ field }) => (
                     <FormItem>
                       <FormLabel>{getTranslation(language, "salary")}</FormLabel>
                       <FormControl><Input placeholder={getTranslation(language, "salaryPlaceholder")} {...field} /></FormControl>
                     </FormItem>
                   )} />
                    <FormField control={letterForm.control} name="startDate" render={({ field }) => (
                     <FormItem>
                       <FormLabel>{getTranslation(language, "startDate")}</FormLabel>
                       <FormControl><Input type="date" {...field} /></FormControl>
                     </FormItem>
                   )} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end pt-6">
                <Button type="submit" disabled={isLoadingLetter} size="lg" className="min-w-[180px]">
                  {isLoadingLetter ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  {getTranslation(language, "generateLetter")}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {(isLoadingLetter || letter) && (
            <Card className="shadow-lg hover-lift animate-fade-in-up">
                <CardHeader className="flex flex-row items-center justify-between pb-6">
                    <CardTitle className="text-2xl font-bold primary-text">{getTranslation(language, "generatedLetter")}</CardTitle>
                    {!isLoadingLetter && letter && (
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleCopy(letter)}><Clipboard className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={handleDownload}><Download className="h-4 w-4" /></Button>
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    {isLoadingLetter ? (
                         <div className="space-y-4">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="pt-4 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                         </div>
                    ) : (
                        <Textarea readOnly value={letter || ''} className="h-80 bg-secondary/50" />
                    )}
                </CardContent>
            </Card>
        )}

        {/* 5. Hiring Pipeline Tracker */}
        <Card className="shadow-lg hover-lift animate-fade-in-up">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl primary-bg shadow-lg hover-glow">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold primary-text mb-2">{getTranslation(language, "hiringPipelineTracker")}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{getTranslation(language, "hiringPipelineDescription")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {pipelineCandidates.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">No candidates in pipeline</h3>
                <p className="text-sm text-muted-foreground">Add candidates from the CV scoring results to start tracking your hiring pipeline.</p>
              </div>
            ) : (
              <div className="relative">
                {/* Pipeline Carousel */}
                <div className="flex items-center justify-center gap-8 mb-8">
                  {/* Previous Stage (if exists) */}
                  {getPreviousStage(currentPipelineStage) && (
                    <div className="flex flex-col items-center opacity-40 scale-90 transition-all duration-300">
                      <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                          {getTranslation(language, getPreviousStage(currentPipelineStage)!)}
                        </h4>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-muted-foreground">
                            {getCandidatesForStage(getPreviousStage(currentPipelineStage)!).length}
                          </div>
                          <div className="text-xs text-muted-foreground">candidates</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Current Stage - Centered */}
                  <div className="flex flex-col items-center">
                    <div className="p-6 rounded-xl primary-bg shadow-lg border-2 border-primary/20">
                      <h3 className="text-lg font-bold text-white mb-3 text-center">
                        {getTranslation(language, currentPipelineStage)}
                      </h3>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">
                          {getCandidatesForStage(currentPipelineStage).length}
                        </div>
                        <div className="text-sm text-white/80">
                          {getCandidatesForStage(currentPipelineStage).length === 1 ? 'candidate' : 'candidates'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Navigation Arrows */}
                    <div className="flex items-center gap-4 mt-4">
                      {getPreviousStage(currentPipelineStage) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateToStage(getPreviousStage(currentPipelineStage)!)}
                          className="flex items-center gap-2"
                        >
                          <ArrowRight className="h-4 w-4 rotate-180" />
                          Previous
                        </Button>
                      )}
                      
                      {getNextStage(currentPipelineStage) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateToStage(getNextStage(currentPipelineStage)!)}
                          className="flex items-center gap-2"
                        >
                          Next
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Next Stage (if exists) - Hidden but reserved space */}
                  {getNextStage(currentPipelineStage) && (
                    <div className="w-32 h-24 opacity-0">
                      {/* Reserved space for layout consistency */}
                    </div>
                  )}
                </div>

                {/* Current Stage Candidates */}
                <div className={`transition-all duration-500 ${pipelineAnimation ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}`}>
                  {getCandidatesForStage(currentPipelineStage).length === 0 ? (
                    <div className="text-center py-12 bg-secondary/30 rounded-lg border-2 border-dashed border-border">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                        No candidates in {getTranslation(language, currentPipelineStage)} stage
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {getPreviousStage(currentPipelineStage) 
                          ? `Move candidates from ${getTranslation(language, getPreviousStage(currentPipelineStage)!)} stage`
                          : 'Add candidates from CV scoring results'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h4 className="text-lg font-semibold primary-text mb-2">
                          Candidates in {getTranslation(language, currentPipelineStage)} Stage
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Manage candidates and move them to the next stage
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        {getCandidatesForStage(currentPipelineStage).map((candidate) => (
                          <Card key={candidate.id} className="p-4 border border-border hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                  <h4 className="font-semibold">{candidate.name}</h4>
                                  <p className="text-sm text-muted-foreground">{candidate.email}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {candidate.score && (
                                      <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                                        Score: {candidate.score}/10
                                      </span>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                      Applied: {candidate.appliedDate}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {editingNotes === candidate.id ? (
                                  <div className="flex items-center gap-2">
                                    <Input
                                      value={notesText}
                                      onChange={(e) => setNotesText(e.target.value)}
                                      placeholder="Add notes..."
                                      className="w-48"
                                    />
                                    <Button size="sm" onClick={() => updateCandidateNotes(candidate.id, notesText)}>
                                      Save
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => setEditingNotes(null)}>
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <>
                                    <Button size="sm" variant="ghost" onClick={() => {
                                      setEditingNotes(candidate.id);
                                      setNotesText(candidate.notes);
                                    }}>
                                      <Edit3 className="h-3 w-3 mr-1" />
                                      {getTranslation(language, "addNotes")}
                                    </Button>
                                    
                                    {getNextStage(candidate.stage) && (
                                      <Button size="sm" onClick={() => moveCandidateToStage(candidate.id, getNextStage(candidate.stage)!)}>
                                        <ArrowRight className="h-3 w-3 mr-1" />
                                        {getTranslation(language, "moveToNextStage")}
                                      </Button>
                                    )}
                                    
                                    {candidate.stage !== 'rejected' && candidate.stage !== 'hired' && (
                                      <Button size="sm" variant="destructive" onClick={() => rejectCandidate(candidate.id)}>
                                        <X className="h-3 w-3 mr-1" />
                                        {getTranslation(language, "rejectCandidate")}
                                      </Button>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {candidate.notes && (
                              <div className="mt-3 p-3 bg-secondary/30 rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">{getTranslation(language, "candidateNotes")}:</p>
                                <p className="text-sm">{candidate.notes}</p>
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <footer className="py-8 border-t mt-12 bg-card/50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg primary-bg flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold primary-text">TalentFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {getTranslation(language, "allRightsReserved", { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
         </div>
   );
 }

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeContent />
    </Suspense>
  );
}

    