'use server';
/**
 * @fileOverview CV Scoring AI agent.
 *
 * - cvScoring - A function that handles the CV scoring process.
 * - CvScoringInput - The input type for the cvScoring function.
 * - CvScoringOutput - The return type for the cvScoring function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CvScoringInputSchema = z.object({
  jobDescription: z.string().describe('The job description to match CVs against.'),
  cvs: z.array(z.string().describe("The candidate's CV as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.")).describe('A list of CVs to score.'),
});
export type CvScoringInput = z.infer<typeof CvScoringInputSchema>;

const CvScoringOutputSchema = z.array(
  z.object({
    candidateName: z.string().describe('The name of the candidate.'),
    score: z.number().describe('The AI-generated score (0-100) for the candidate.'),
    justification: z.string().describe('The justification for the score.'),
  })
);
export type CvScoringOutput = z.infer<typeof CvScoringOutputSchema>;

export async function cvScoring(input: CvScoringInput): Promise<CvScoringOutput> {
  return cvScoringFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cvScoringPrompt',
  input: {schema: CvScoringInputSchema},
  output: {schema: CvScoringOutputSchema},
  prompt: `You are a senior HR professional and recruitment expert for 180Degree company with over 15 years of experience in talent acquisition, CV evaluation, and candidate assessment. You specialize in matching candidate profiles to job requirements using comprehensive evaluation methodologies.

TASK: Evaluate and score each CV against the provided job description using a structured, objective scoring system.

JOB DESCRIPTION:
{{{jobDescription}}}

EVALUATION FRAMEWORK:

1. SCORING CRITERIA (Total 100 points):
   - **Skills Match (25 points)**: Technical skills, tools, technologies, and methodologies
   - **Experience Relevance (25 points)**: Relevant work experience, industry knowledge, and project scope
   - **Education & Certifications (15 points)**: Academic background, certifications, and continuous learning
   - **Achievements & Impact (20 points)**: Quantifiable accomplishments, leadership, and measurable results
   - **Cultural Fit Indicators (15 points)**: Soft skills, teamwork, communication, and values alignment

2. SCORING GUIDELINES:
   - **90-100**: Exceptional match - Candidate exceeds requirements with outstanding qualifications
   - **80-89**: Excellent match - Candidate meets all requirements with strong qualifications
   - **70-79**: Good match - Candidate meets most requirements with solid qualifications
   - **60-69**: Fair match - Candidate meets some requirements but has gaps
   - **50-59**: Limited match - Candidate has some relevant experience but significant gaps
   - **40-49**: Poor match - Candidate has minimal relevant experience
   - **30-39**: Very poor match - Candidate lacks most required qualifications
   - **0-29**: No match - Candidate is not suitable for the position

3. EVALUATION PROCESS:
   - Analyze each CV systematically against the job requirements
   - Consider both explicit qualifications and transferable skills
   - Evaluate the progression and growth in the candidate's career
   - Assess the quality and relevance of achievements
   - Consider industry context and market standards

4. JUSTIFICATION REQUIREMENTS:
   - Keep justifications brief and concise (2-3 sentences maximum)
   - Highlight only the most relevant strengths or concerns
   - Focus on key qualifications that directly impact the score
   - Be objective and evidence-based in your assessment

5. SPECIAL CONSIDERATIONS:
   - Look for potential beyond current qualifications
   - Consider career transitions and transferable skills
   - Evaluate cultural fit indicators from experience and interests
   - Assess communication quality and attention to detail in the CV
   - Consider industry trends and emerging skill requirements

CVs TO EVALUATE:
{{#each cvs}}
  CV: {{media url=this}}
{{/each}}

For each candidate, provide:
1. A numerical score (0-100) based on the evaluation framework
2. A brief justification (2-3 sentences maximum) highlighting key strengths or concerns
3. Focus on the most relevant qualifications that directly impact the score

Remember to be fair, objective, and concise in your evaluation.`,
});

const cvScoringFlow = ai.defineFlow(
  {
    name: 'cvScoringFlow',
    inputSchema: CvScoringInputSchema,
    outputSchema: CvScoringOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
