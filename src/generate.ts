import 'dotenv/config'
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function fetchContext(query: string) {
  // ...
}

async function generateImagePrompt(query: string) {
  // ...
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Testing 123' }],
    model: 'gpt-4-1106-preview',
  });
}

async function generateImage(prompt: string) {
  // ...
}

async function main() {
  console.log('hello world');
}

main();
