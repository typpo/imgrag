import wiki from 'wikipedia';

import { log } from './log';

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

async function main() {
  const query = process.argv[2] || 'purple frog';
  await fetchWiki(query);
}

if (require.main === module) {
  main();
}
