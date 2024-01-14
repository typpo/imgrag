import wiki from 'wikipedia';

export async function fetchWiki(query: string) {
  console.log('Searching for', query);
  const searchResults = await wiki.search(query);
  for (const result of searchResults.results) {
    console.log(result);
    const page = await wiki.page(result.title);
    /* Return short page summary */
    // const summary = await page.summary();
    // console.log(summary.extract);
    // return summary.extract;

    /* Return all page content. */
    const content = await page.content();
    console.log(content);
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
