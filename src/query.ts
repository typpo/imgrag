import wiki from 'wikipedia';

async function fetchWiki(query: string) {
  console.log('Searching for', query);
  const searchResults = await wiki.search('Batma');
  for (const result of searchResults.results) {
    console.log(result);
  }
}

async function main() {
  const query = process.argv[2] || 'purple frog';
  await fetchWiki(query);
}

main();