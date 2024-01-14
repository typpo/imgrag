import readline from 'readline';

import 'dotenv/config';
import OpenAI from 'openai';

import { fetchWiki } from './query';
import { log } from './log';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateImagePrompt(query: string, research: string[] = []) {
  const descriptions: string[] = [];
  for (const result of research) {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Based on the following research, describe the biological specimen "${query}" to an artist. Include details such as shape, size, bodily features, color, and habitat:\n\n${research}`,
        },
      ],
      model: 'gpt-4-1106-preview',
    });
    descriptions.push(chatCompletion.choices[0].message.content!);
  }

  // TODO: Generate a final description from all the description

  return descriptions[0];
}

async function generateImage(prompt: string, rewritePrompt = false) {
  const finalPrompt = rewritePrompt
    ? prompt
    : `I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS:\n\n${prompt}`;
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: finalPrompt,
    n: 1,
    size: '1024x1024',
  });
  return response.data[0].url;
}

async function main() {
  const query = process.argv[2];
  log('Researching...');
  const wikiResearch = await fetchWiki(query);
  log('Constructing prompt...');
  const prompt = await generateImagePrompt(query, [wikiResearch]);
  log('Prompt:', prompt);
  log('Generating image...');
  const imageUrl = await generateImage(prompt);
  console.log('[IMAGE]', imageUrl);
}

if (require.main === module) {
  main();
}