'use server';
/**
 * @fileOverview A flow that provides spoken performance reports and insights.
 *
 * - getSpokenPerformanceReport - A function that generates a spoken performance report.
 * - SpokenPerformanceReportInput - The input type for the getSpokenPerformanceReport function.
 * - SpokenPerformanceReportOutput - The return type for the getSpokenPerformanceReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const SpokenPerformanceReportInputSchema = z.object({
  reportRequest: z
    .string()
    .describe('The request for the spoken performance report.'),
});
export type SpokenPerformanceReportInput = z.infer<typeof SpokenPerformanceReportInputSchema>;

const SpokenPerformanceReportOutputSchema = z.object({
  reportAudio: z
    .string()
    .describe('The spoken performance report in audio format (WAV data URI).'),
});
export type SpokenPerformanceReportOutput = z.infer<typeof SpokenPerformanceReportOutputSchema>;

export async function getSpokenPerformanceReport(
  input: SpokenPerformanceReportInput
): Promise<SpokenPerformanceReportOutput> {
  return spokenPerformanceReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'spokenPerformanceReportPrompt',
  input: {schema: SpokenPerformanceReportInputSchema},
  output: {schema: z.string().describe('The spoken performance report.')},
  prompt: `You are an AI assistant that generates spoken performance reports and insights from the provided request.\n  Generate a spoken report based on the following request: {{{reportRequest}}}.\n  Keep it brief and to the point.`,
});

const spokenPerformanceReportFlow = ai.defineFlow(
  {
    name: 'spokenPerformanceReportFlow',
    inputSchema: SpokenPerformanceReportInputSchema,
    outputSchema: SpokenPerformanceReportOutputSchema,
  },
  async input => {
    const {output: reportText} = await prompt(input);

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt: reportText,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    return {
      reportAudio: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
