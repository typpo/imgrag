export function log(...data: any[]) {
  if (!process.env.QUIET) {
    console.log(...data);
  }
}
