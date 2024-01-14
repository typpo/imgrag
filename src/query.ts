import 'dotenv/config';

import fetch from 'node-fetch';
import OpenAI from 'openai';
import { createFlickr } from 'flickr-sdk';

import wiki from 'wikipedia';

import { log } from './log';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function imageUrlToText(url: string) {
  const resp = await openai.chat.completions.create({
    temperature: 0,
    seed: 0,
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          {
          type: 'text',
          text: 'Caption this image. Focus on the visual details of the organism in the foreground. Be as detailed as possible.',
          },
          {
            type: 'image_url',
            image_url: {url},
          },
        ],
      },
    ],
  });
  
  const description = resp.choices[0].message.content;
  log(description);
  return description;
}

export async function fetchGbif(query: string) {
  const searchResp = fetch(`https://api.gbif.org/v1/species/search?q=${query}&limit=1`);
  const searchJson = await (await searchResp).json();
  const species = searchJson?.results?.[0];
  
  log(species);

  const descriptions = [];
  const descriptionResp = fetch(`https://api.gbif.org/v1/species/${species.key}/descriptions`);
  const descriptionJson = await (await descriptionResp).json();
  for (const description of descriptionJson.results) {
    descriptions.push(description.description);
  }
  
  const mediaResp = fetch(`https://api.gbif.org/v1/species/${species.key}/media`);
  const mediaJson = await (await mediaResp).json();
  for (const media of mediaJson.results) {
    if (media.type === 'StillImage') {
      const description = await imageUrlToText(media.identifier);
      descriptions.push(description);
    }
  }

  const finalDescription = descriptions.filter(Boolean).join('\n\n');
  log(finalDescription);
  return finalDescription;
}

export async function fetchWiki(query: string) {
  log('Searching for', query);
  const searchResults = await wiki.search(query);
  for (const result of searchResults.results) {
    log(result);
    const page = await wiki.page(result.title);
    /* Return short page summary */
    // const summary = await page.summary();
    // log(summary.extract);
    // return summary.extract;

    /* Return all page content. */
    const content = await page.content();
    log(content);
    return content;
  }
  return '';
}

export async function fetchFlickr(query: string) {
  if (!process.env.FLICKR_API_KEY) {
    throw new Error('FLICKR_API_KEY environment variable not set');
  }
  const { flickr } = createFlickr(process.env.FLICKR_API_KEY);
  const res = await flickr('flickr.photos.search', {
    text: query,
    sort: 'relevance',
  });
  const photo = res.photos?.photo?.[0];
  if (!photo) {
    return null;
  }

  const res2 = await flickr('flickr.photos.getInfo', {
    photo_id: photo.id,
  });
  
  const url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
  return imageUrlToText(url);
}

async function main() {
  const query = process.argv[2] || 'purple frog';
  //await fetchWiki(query);
  //await fetchFlickr(query);
  await fetchGbif(query);
}

if (require.main === module) {
  main();
}
