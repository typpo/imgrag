import readline from 'readline';

import 'dotenv/config'
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = () => {
    return new Promise<string>(resolve => {
      rl.question('What do you want to visualize? ', (answer) => {
        resolve(answer);
      });
    });
  };

  while (true) {
    const query = await askQuestion();
    if (query.toLowerCase() === 'exit') {
      rl.close();
      break;
    }
    await generateImagePrompt(query);
  }
}

main();
