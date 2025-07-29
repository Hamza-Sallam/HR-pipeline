// The offerRejectionLetterGenerator flow generates offer and rejection letters based on candidate details and job information.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OfferRejectionLetterInputSchema = z.object({
  candidateName: z.string().describe('The name of the candidate.'),
  jobTitle: z.string().describe('The job title for the position.'),
  decision: z.enum(['Offer', 'Reject']).describe('The decision to offer or reject the candidate.'),
  salary: z.string().optional().describe('The optional salary for the offered position.'),
  startDate: z.string().optional().describe('The optional start date for the offered position.'),
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

  Generate a formal letter based on the following information:

  Candidate Name: {{{candidateName}}}
  Job Title: {{{jobTitle}}}
  Decision: {{{decision}}}
  {{#if salary}}
  Salary: {{{salary}}}
  {{/if}}
  {{#if startDate}}
  Start Date: {{{startDate}}}
  {{/if}}

  Instructions:
  - If the decision is "Offer", generate an offer letter with a warm welcome, clear job title, and include salary and start date if provided.
  - If the decision is "Reject", generate a rejection letter expressing gratitude for their time and effort and wishing them the best in their job search.
  `,
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
