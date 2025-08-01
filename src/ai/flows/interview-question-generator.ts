// The `use server` directive indicates that this code will be executed on the server.
'use server';

/**
 * @fileOverview Generates a curated list of interview questions based on a selected CV and job description.
 *
 * - generateInterviewQuestions - A function that generates interview questions.
 * - GenerateInterviewQuestionsInput - The input type for the generateInterviewQuestions function.
 * - GenerateInterviewQuestionsOutput - The return type for the generateInterviewQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInterviewQuestionsInputSchema = z.object({
  cvSummary: z.string().describe('Summary of the candidate\'s CV.'),
  jobDescription: z.string().describe('The job description for the role.'),
  focusSkills: z.string().optional().describe('Optional: Focus skills or evaluation goals.'),
  language: z.enum(['en', 'ar', 'tr']).describe('The language for the output.'),
});
export type GenerateInterviewQuestionsInput = z.infer<typeof GenerateInterviewQuestionsInputSchema>;

const GenerateInterviewQuestionsOutputSchema = z.object({
  technicalQuestions: z.array(z.string()).describe('List of technical interview questions.'),
  behavioralQuestions: z.array(z.string()).describe('List of behavioral interview questions.'),
  situationalQuestions: z.array(z.string()).describe('List of situational interview questions.'),
});
export type GenerateInterviewQuestionsOutput = z.infer<typeof GenerateInterviewQuestionsOutputSchema>;

export async function generateInterviewQuestions(input: GenerateInterviewQuestionsInput): Promise<GenerateInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const interviewQuestionsPrompt = ai.definePrompt({
  name: 'interviewQuestionsPrompt',
  input: {schema: GenerateInterviewQuestionsInputSchema},
  output: {schema: GenerateInterviewQuestionsOutputSchema},
  prompt: `You are an expert HR assistant specializing in generating interview questions.

TASK: Generate interview questions in the specified language based on the candidate's CV summary and job description.

LANGUAGE: {{{language}}}
CV Summary: {{{cvSummary}}}
Job Description: {{{jobDescription}}}
Focus Skills/Goals: {{{focusSkills}}}

LANGUAGE REQUIREMENTS:
- Generate all questions in the specified language (English, Arabic, or Turkish)
- Use appropriate cultural and linguistic conventions for the target language
- For Arabic: Use right-to-left text direction and appropriate Arabic business terminology
- For Turkish: Use appropriate Turkish business terminology and formal language
- For English: Use standard professional English

INSTRUCTIONS:
- Generate a diverse set of questions covering technical, behavioral, and situational aspects
- Ensure questions are relevant to both the CV and job description
- Create questions that will effectively evaluate the candidate's qualifications and fit
- Use culturally appropriate language and business terminology
- Generate 5-8 questions for each category (technical, behavioral, situational)

Remember to generate all questions in the specified language with appropriate cultural context.`,
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async input => {
    const {output} = await interviewQuestionsPrompt(input);
    return output!;
  }
);
