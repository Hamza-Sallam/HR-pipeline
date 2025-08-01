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
import { Bot, Clipboard, Download, Loader2, Paperclip, Sparkles, FileText, Briefcase, UserCheck } from "lucide-react";

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
});

const letterSchema = z.object({
  decision: z.enum(['Offer', 'Reject']),
  salary: z.string().optional(),
  startDate: z.string().optional(),
});

type SelectedCandidate = CvScoringOutput[0] & { cvSummary: string };

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

  // Form hooks
  const jdForm = useForm<z.infer<typeof jdSchema>>({
    resolver: zodResolver(jdSchema),
    defaultValues: { jobTitle: "", companyName: "", department: "", experienceLevel: "Mid" },
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
      const input: CvScoringInput = { jobDescription, cvs: cvDataUris };
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
    try {
      const input: OfferRejectionLetterInput = {
        candidateName: selectedCandidate.candidateName,
        jobTitle: jdTitle,
        decision: values.decision,
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


  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 border-b bg-card">
        <div className="container mx-auto flex items-center justify-between">
          <Logo className="h-8 w-auto" />
          <LanguageSelector />
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 flex flex-col gap-8">
        {/* 1. Job Description Generator */}
        <Card className="shadow-md transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{getTranslation(language, "jobDescriptionGenerator")}</CardTitle>
                <CardDescription>{getTranslation(language, "jobDescriptionDescription")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <Form {...jdForm}>
            <form onSubmit={jdForm.handleSubmit(handleGenerateDescription)}>
              <CardContent className="grid md:grid-cols-2 gap-6">
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
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit" disabled={isLoadingJD}>
                  {isLoadingJD ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  {getTranslation(language, "generateJobDescription")}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {isLoadingJD && (
            <Card className="shadow-md transition-all">
                <CardHeader><CardTitle>{getTranslation(language, "generatedJobDescription")}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-16 w-full" />
                </CardContent>
            </Card>
        )}
        
        {jobDescription && !isLoadingJD && (
          <Card className="shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{getTranslation(language, "generatedJobDescription")}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => handleCopy(jobDescription)}><Clipboard className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent>
              <Textarea readOnly value={jobDescription} className="h-64 bg-secondary/50" />
            </CardContent>
          </Card>
        )}

        {/* 2. CV Upload & Scoring */}
        <Card className={`shadow-md transition-all ${!jobDescription ? 'opacity-50 pointer-events-none' : ''}`}>
          <CardHeader>
             <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                              <CardTitle className="text-xl">{getTranslation(language, "cvUploadScoring")}</CardTitle>
              <CardDescription>{getTranslation(language, "cvUploadDescription")}</CardDescription>
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
          <CardFooter className="justify-end">
            <Button onClick={handleScoreCVs} disabled={isLoadingScores || cvFiles.length === 0}>
              {isLoadingScores ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
              {getTranslation(language, "scoreCVs")}
            </Button>
          </CardFooter>
        </Card>

        {(isLoadingScores || cvScores) && (
            <Card className="shadow-md transition-all">
                <CardHeader><CardTitle>{getTranslation(language, "scoringResults")}</CardTitle></CardHeader>
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
                                        <Button size="sm" onClick={() => setSelectedCandidate({...score, cvSummary: score.justification})}>
                                            {getTranslation(language, "select")}
                                        </Button>
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
        <Card className={`shadow-md transition-all ${!selectedCandidate ? 'opacity-50 pointer-events-none' : ''}`}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                              <CardTitle className="text-xl">{getTranslation(language, "customInterviewQuestions")}</CardTitle>
              <CardDescription>{getTranslation(language, "customInterviewDescription", { candidateName: selectedCandidate?.candidateName || 'the candidate' })}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleGenerateQuestions({ focusSkills: (e.target as any).focusSkills.value }); }}>
            <CardContent className="space-y-4">
              <Input name="focusSkills" placeholder={getTranslation(language, "focusSkillsPlaceholder")} />
            </CardContent>
            <CardFooter className="justify-end">
              <Button type="submit" disabled={isLoadingQuestions}>
                {isLoadingQuestions ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {getTranslation(language, "generateQuestions")}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {(isLoadingQuestions || interviewQuestions) && (
             <Card className="shadow-md transition-all">
                <CardHeader>
                    <CardTitle>{getTranslation(language, "generatedInterviewQuestions")}</CardTitle>
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
        <Card className={`shadow-md transition-all ${!selectedCandidate ? 'opacity-50 pointer-events-none' : ''}`}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Paperclip className="h-6 w-6 text-primary" />
              </div>
              <div>
                              <CardTitle className="text-xl">{getTranslation(language, "offerRejectionLetter")}</CardTitle>
              <CardDescription>{getTranslation(language, "offerRejectionDescription", { candidateName: selectedCandidate?.candidateName || 'the candidate' })}</CardDescription>
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
              <CardFooter className="justify-end">
                <Button type="submit" disabled={isLoadingLetter}>
                  {isLoadingLetter ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  {getTranslation(language, "generateLetter")}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {(isLoadingLetter || letter) && (
            <Card className="shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{getTranslation(language, "generatedLetter")}</CardTitle>
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
      </main>
      <footer className="py-4 border-t mt-8">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
            {getTranslation(language, "allRightsReserved", { year: new Date().getFullYear() })}
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

    