export const metadata = { title: 'Highlighting Blogs & Articles' };

export default function Highlights() {
  return (
    <main className="section shell empty-module">
      <h1 className="portal-title">Highlighting<br/><em>Blogs &amp; Articles.</em></h1>
      <div className="note-list" style={{ marginTop: '48px', maxWidth: '820px' }}>
        <a className="note-row" href="https://ai-2027.com/" target="_blank" rel="noopener noreferrer">
          <span>01</span>
          <strong>AI 2027</strong>
          <span className="note-status" aria-label="Opens in a new tab">↗</span>
        </a>
      </div>
    </main>
  );
}
