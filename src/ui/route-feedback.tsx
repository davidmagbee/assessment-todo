/** Do not echo server errors into the page; full navigation retries with fresh request context. */
export function Unavailable() {
  return <main className="intro"><div><h1>A small pause.</h1><p>We couldn’t load your list. Please try again.</p><a href="/">Try again</a></div></main>
}

/** Unknown paths have a direct recovery route rather than a dead end. */
export function MissingPage() {
  return <main className="intro"><div><h1>This page wandered off.</h1><a href="/">Back to your list</a></div></main>
}
