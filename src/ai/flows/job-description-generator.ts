'use server';

/**
 * @fileOverview A job description generator AI agent.
 *
 * - generateJobDescription - A function that handles the job description generation process.
 * - GenerateJobDescriptionInput - The input type for the generateJobDescription function.
 * - GenerateJobDescriptionOutput - The return type for the generateJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateJobDescriptionInputSchema = z.object({
  jobTitle: z.string().describe('The title of the job.'),
  companyName: z.string().describe('The name of the company.'),
  department: z.string().describe('The department for the job.'),
  experienceLevel: z
    .enum(['Entry', 'Mid', 'Senior'])
    .describe('The experience level for the job.'),
  language: z.enum(['en', 'ar', 'tr']).describe('The language for the output.'),
});
export type GenerateJobDescriptionInput = z.infer<
  typeof GenerateJobDescriptionInputSchema
>;

const GenerateJobDescriptionOutputSchema = z.object({
  jobDescription: z.string().describe('The generated job description.'),
});
export type GenerateJobDescriptionOutput = z.infer<
  typeof GenerateJobDescriptionOutputSchema
>;

export async function generateJobDescription(
  input: GenerateJobDescriptionInput
): Promise<GenerateJobDescriptionOutput> {
  return generateJobDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJobDescriptionPrompt',
  input: {schema: GenerateJobDescriptionInputSchema},
  output: {schema: GenerateJobDescriptionOutputSchema},
  prompt: `You are an expert HR professional and recruitment specialist with over 10 years of experience in creating compelling, detailed, and professional job descriptions. Your expertise spans across various industries and you understand the nuances of different experience levels and departments.

TASK: Create a comprehensive, professional job description for the specified position in the requested language.

CONTEXT:
- Job Title: {{{jobTitle}}}
- Company Name: {{{companyName}}}
- Department: {{{department}}}
- Experience Level: {{{experienceLevel}}}
- Language: {{{language}}}

GUIDELINES FOR CREATING THE JOB DESCRIPTION:

1. LANGUAGE REQUIREMENTS:
   - Generate the entire job description in the specified language (English, Arabic, or Turkish)
   - Use appropriate cultural and linguistic conventions for the target language
   - For Arabic: Use right-to-left text direction and appropriate Arabic business terminology
   - For Turkish: Use appropriate Turkish business terminology and formal language
   - For English: Use standard professional English

2. STRUCTURE (Follow this exact format):
   - Company Overview (2-3 sentences about {{{companyName}}} culture and mission)
   - Job Summary (2-3 sentences overview of the role)
   - Key Responsibilities (8-12 bullet points with specific, actionable tasks)
   - Required Qualifications (6-8 bullet points covering education, experience, skills)
   - Preferred Qualifications (4-6 bullet points for nice-to-have skills/experience)
   - Benefits & Perks (4-6 bullet points highlighting company benefits)
   - Equal Opportunity Statement (1 sentence about diversity and inclusion)

3. TONE & STYLE:
   - Professional yet engaging
   - Clear and concise language
   - Action-oriented verbs for responsibilities
   - Inclusive and welcoming language
   - Avoid jargon unless industry-specific
   - Culturally appropriate for the target language

4. EXPERIENCE LEVEL ADAPTATIONS:
   - Entry Level: Focus on learning opportunities, mentorship, growth potential
   - Mid Level: Emphasize leadership opportunities, project ownership, skill development
   - Senior Level: Highlight strategic impact, team leadership, decision-making authority

5. DEPARTMENT-SPECIFIC CONSIDERATIONS:
   - Tailor responsibilities to the specific department's needs
   - Include relevant industry standards and best practices
   - Consider department-specific tools, technologies, or methodologies

6. CONTENT REQUIREMENTS:
   - Make it specific enough to attract qualified candidates
   - Include both technical and soft skills where applicable
   - Mention collaboration and teamwork aspects
   - Include growth and development opportunities
   - Be realistic about expectations while being attractive
   - Incorporate the company name {{{companyName}}} naturally throughout the description

7. LENGTH: The job description should be comprehensive but not overwhelming (approximately 300-500 words total).

Remember to create a job description that not only attracts qualified candidates but also accurately represents the role and company culture. Focus on creating a compelling narrative that makes candidates excited about the opportunity while being transparent about expectations and requirements.`,
});

const generateJobDescriptionFlow = ai.defineFlow(
  {
    name: 'generateJobDescriptionFlow',
    inputSchema: GenerateJobDescriptionInputSchema,
    outputSchema: GenerateJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
