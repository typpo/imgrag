import wiki from 'wikipedia';

export async function fetchWiki(query: string) {
  console.log('Searching for', query);
  const searchResults = await wiki.search(query);
  for (const result of searchResults.results) {
    console.log(result);
    const page = await wiki.page(result.title);
    const summary = await page.summary();
    console.log(summary.extract);
    return summary.extract;
  }
  return '';
}

async function main() {
  const query = process.argv[2] || 'purple frog';
  await fetchWiki(query);
}

main();