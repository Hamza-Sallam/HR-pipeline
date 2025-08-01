// The offerRejectionLetterGenerator flow generates offer and rejection letters based on candidate details and job information.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OfferRejectionLetterInputSchema = z.object({
  candidateName: z.string().describe('The name of the candidate.'),
  companyName: z.string().describe('The name of the company.'),
  jobTitle: z.string().describe('The job title for the position.'),
  decision: z.enum(['Offer', 'Reject']).describe('The decision to offer or reject the candidate.'),
  salary: z.string().optional().describe('The optional salary for the offered position.'),
  startDate: z.string().optional().describe('The optional start date for the offered position.'),
  language: z.enum(['en', 'ar', 'tr']).describe('The language for the output.'),
});
export type OfferRejectionLetterInput = z.infer<typeof OfferRejectionLetterInputSchema>;

const OfferRejectionLetterOutputSchema = z.object({
  letter: z.string().describe('The generated offer or rejection letter.'),
});
export type OfferRejectionLetterOutput = z.infer<typeof OfferRejectionLetterOutputSchema>;

export async function offerRejectionLetterGenerator(input: OfferRejectionLetterInput): Promise<OfferRejectionLetterOutput> {
  return offerRejectionLetterGeneratorFlow(input);
}

const offerRejectionLetterPrompt = ai.definePrompt({
  name: 'offerRejectionLetterPrompt',
  input: {schema: OfferRejectionLetterInputSchema},
  output: {schema: OfferRejectionLetterOutputSchema},
  prompt: `You are an HR assistant tasked with generating offer and rejection letters.

TASK: Generate a formal letter in the specified language based on the provided information.

LANGUAGE: {{{language}}}
Candidate Name: {{{candidateName}}}
Company Name: {{{companyName}}}
Job Title: {{{jobTitle}}}
Decision: {{{decision}}}
{{#if salary}}
Salary: {{{salary}}}
{{/if}}
{{#if startDate}}
Start Date: {{{startDate}}}
{{/if}}

LANGUAGE REQUIREMENTS:
- Generate the entire letter in the specified language (English, Arabic, or Turkish)
- Use appropriate cultural and linguistic conventions for the target language
- For Arabic: Use right-to-left text direction and appropriate Arabic business terminology
- For Turkish: Use appropriate Turkish business terminology and formal language
- For English: Use standard professional English

LETTER REQUIREMENTS:
- Include the company name {{{companyName}}} prominently in the letter
- Use formal, professional tone appropriate for the target language and culture
- Structure the letter with proper greeting, body, and closing

INSTRUCTIONS:
- If the decision is "Offer": Generate an offer letter with a warm welcome, clear job title, company name, and include salary and start date if provided
- If the decision is "Reject": Generate a rejection letter expressing gratitude for their time and effort, mentioning the company name, and wishing them the best in their job search
- Ensure the company name is naturally integrated throughout the letter
- Use culturally appropriate business language and formatting

Remember to generate the entire letter in the specified language with appropriate cultural context and prominently feature the company name.`,
});

const offerRejectionLetterGeneratorFlow = ai.defineFlow(
  {
    name: 'offerRejectionLetterGeneratorFlow',
    inputSchema: OfferRejectionLetterInputSchema,
    outputSchema: OfferRejectionLetterOutputSchema,
  },
  async input => {
    const {output} = await offerRejectionLetterPrompt(input);
    return output!;
  }
);
