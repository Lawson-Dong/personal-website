import type { ReactNode } from "react";
import styles from "./context-kernel-chapter.module.css";

function Figure({ title, children, caption }: { title: string; children: ReactNode; caption: string }) {
  return <figure className={styles.figure}><p className={styles.label}>{title}</p>{children}<figcaption>{caption}</figcaption></figure>;
}
function Messages({ ids, protectedIds = [], consumed = false }: { ids: number[]; protectedIds?: number[]; consumed?: boolean }) {
  return <div className={styles.messages}>{ids.map(id => <span key={id} className={protectedIds.includes(id) ? styles.protected : consumed ? styles.consumed : undefined}><code>m{id}</code>{protectedIds.includes(id) && <small>protected</small>}</span>)}</div>;
}
function Arrow({ label }: { label?: string }) { return <div className={styles.arrow}><span aria-hidden="true">↓</span>{label && <small>{label}</small>}</div>; }
const all = [1,2,3,4,5,6,7,8];
const steps = [
  ["Model writes summary", "compress(m1 → m5, summary)", "The model supplies both the requested range and the digest."],
  ["Resolve refs", "m1 → m5 ⇒ positions 0–4", "Use the reference map to locate the actual messages."],
  ["Protection check", "m1, m2, m5", "Exclude the protected m3/m4 pair from legal coverage."],
  ["Create block b1", "summary + source IDs + tier", "Give the supplied text an identity and explicit source relationships."],
  ["Update state", "b1 covers m1, m2, m5", "Record coverage; preserve lineage when existing blocks are consumed."],
  ["Render next view", "b1 + protected pair + remaining raw", "processTurn uses active coverage to build the next working context."],
];
export function ContextKernelChapter() {
  return <article className={styles.chapter}>
    <p className={styles.lead}>The useful question is: <strong>which transformations does the kernel execute?</strong> Follow the messages, references and blocks through one compression decision.</p>
    <section><h2>STEP A — Give raw messages a stable identity</h2>
      <p>An API supplies actual conversation messages: a user message, an assistant message, a tool call, its result, and a follow-up. The kernel maps each message’s raw ID to its own reference, such as <code>m00001</code>.</p>
      <Figure title="RAW MESSAGES → ADDRESSABLE MESSAGES" caption="References are the anchors the model uses to specify a compression range.">
        <div className={styles.tableWrap}><table><thead><tr><th>Incoming message</th><th>Kernel reference map</th><th>Reference</th></tr></thead><tbody>{["user message","assistant","tool call","tool result","user follow-up"].map((label,i)=><tr key={label}><td>{label}<small>raw ID {i+1}</small></td><td>mapped to →</td><td><code>m0000{i+1}</code></td></tr>)}</tbody></table></div>
        <Arrow label="The model can now address a range"/><div className={styles.call}><code>compress m00001 → m00004</code></div>
      </Figure>
      <p>The model can name the range using these refs instead of long provider or host IDs. Reference assignment and visible reference tags are separate: the map exists even when the host chooses not to inject tags into message text.</p>
      <p className={styles.note}>From here on, m1–m8 are short teaching labels for m00001–m00008. State coverage arrays contain the corresponding raw IDs; the reference map connects them.</p>
    </section>
    <section><h2>STEP B — Compression Doctrine → model-written summary</h2>
      <p>Guided by the compression doctrine, the model judges that the work in m1–m5 is consumed and writes a summary.</p>
      <div className={styles.call}><code>Compression Doctrine → choose m1–m5 → model writes summary</code></div>
    </section>
    <section><h2>STEP C — Resolve the range</h2>
      <p>The kernel resolves the boundary refs through its reference map to locate the actual messages and their positions. For m1–m4, that means positions 0, 1, 2 and 3. Our m1–m5 request initially selects positions 0–4.</p>
      <Figure title="REFS → POSITIONS → REQUESTED MESSAGES" caption="Resolving the interval identifies candidate coverage. It does not yet authorize consuming every message."><div className={styles.call}><code>startRef: m1 · endRef: m5</code></div><Arrow label="Resolve through the reference map"/><div className={styles.positions}>{[0,1,2,3,4].map(i=><div key={i}><small>index {i}</small><code>m{i+1}</code></div>)}</div></Figure>
      <p>This step depends on the identities established earlier. Block references can also identify existing blocks for higher-tier compression. Unknown or unavailable boundaries cannot simply be treated as a valid interval.</p>
    </section>
    <section><h2>STEP D — Check what must remain visible</h2>
      <p>Suppose m3 is a <code>skill</code> tool call and m4 is its paired result. If <code>skill</code> is configured as a protected tool, both messages are hard-excluded from compression.</p>
      <Figure title="REQUESTED RANGE → LEGAL COVERAGE" caption="Protected tool messages leave both the compressible set and the new block’s effectiveMessageIds."><p className={styles.rowLabel}>Requested: m1–m5</p><Messages ids={[1,2,3,4,5]} protectedIds={[3,4]}/><Arrow label="Protected-content filtering"/><div className={styles.columns}><div className={styles.card}><strong>Effective compression</strong><Messages ids={[1,2,5]}/><p>Only these messages enter b1’s coverage.</p></div><div className={`${styles.card} ${styles.preserved}`}><strong>Preserved in full</strong><Messages ids={[3,4]} protectedIds={[3,4]}/><p>skill call + paired skill result</p></div></div></Figure>
      <p><strong>Resolve A–B into the subset that is actually legal to consume.</strong> A requested continuous interval can therefore produce non-contiguous effective coverage.</p>
      <p>Recent-message protection and tool/reasoning integrity are also checked. This example assumes m1–m5 are outside the recent protected zone and that filtering leaves valid message boundaries. An entirely protected range has no compressible content and fails with an error.</p>
    </section>
    <section><h2>STEP E — Create an identified compression block</h2>
      <p>The legal set is now m1, m2 and m5. The kernel allocates b1 and stores the model-written summary alongside its coverage and tier.</p>
      <Figure title="SUMMARY TEXT → BLOCK b1" caption="Shown with refs for readability. directMessageIds and effectiveMessageIds actually store raw IDs."><Messages ids={[1,2,5]}/><Arrow label="Attach the supplied summary to a new block"/><div className={styles.block}><strong>b1 · CompressionBlock</strong><pre><code>{`{\n  blockId: "b1",\n  summary: "Authentication was implemented; tests passed.",\n  directMessageIds: [rawId(m1), rawId(m2), rawId(m5)],\n  effectiveMessageIds: [rawId(m1), rawId(m2), rawId(m5)],\n  directBlockIds: [],\n  tier: 1,\n  active: true\n}`}</code></pre></div></Figure>
      <p><strong>The summary changes from a piece of text into an object with identity.</strong> b1 can be looked up, found through block search or referenced alongside other blocks in a later compression operation.</p>
      <p>For this first fold, direct and effective coverage coincide. A parent block records its consumed children in <code>directBlockIds</code> and carries their original-message coverage into <code>effectiveMessageIds</code>. Selected children become inactive but remain recorded. These links form lineage.</p>
      <p className={styles.note}>The kernel’s <code>decompress("b1", state)</code> primitive looks up block metadata. Returning original text requires the host’s recovery integration and retained sources.</p>
    </section>
    <section><h2>STEP F — Synchronize the compression state</h2>
      <p>Each turn arrives with messages and a <code>CompressionState</code>. Suppose m1–m3 were previously folded into b1. The state remembers more than the summary text: it records the block’s identity, covered originals, tier and active status.</p>
      <Figure title="COMPRESSIONSTATE / SOURCE RELATIONSHIPS" caption="This first-fold example shows b1 covering m1–m3. The later example starts afresh with a protected pair.">
        <Messages ids={all}/><Arrow label="Previously folded m1–m3"/>
        <div className={styles.columns}><div className={styles.block}><strong>Block b1</strong><dl><dt>summary</dt><dd>Completed work, in the model’s words</dd><dt>covered messages</dt><dd><Messages ids={[1,2,3]}/></dd><dt>tier</dt><dd>1</dd><dt>active</dt><dd>true</dd></dl></div><div className={styles.card}><strong>Relationships maintained in state</strong><p>Raw message IDs ↔ message refs</p><p>Blocks → covered message IDs</p><p>Parent blocks → child blocks → originals</p><p>Tier + active status → working-view placement</p></div></div>
      </Figure>
      <p><strong>The kernel maintains a graph between raw messages and compressed blocks.</strong> It reconciles live identities, assigns refs and synchronizes existing blocks so their coverage can be used on the next turn.</p>
      <p>Those relationships support hierarchical compression and source lookup. The host passes state in, receives updated state and persists it between turns; the kernel itself does not own storage.</p>
    </section>
    <section><h2>STEP G — Record consumption, then render the next view</h2>
      <p>Creating b1 records that its active coverage consumes m1, m2 and m5. This relationship is the basis for hiding their raw content from the working view. It does not require physically deleting the originals.</p>
      <Figure title="CONSUMED COVERAGE / STATE" caption="“Consumed by b1” is a relationship derived from active block coverage, not a per-message flag required by the schema."><div className={styles.columns}><div className={styles.card}><strong>Raw source history</strong><Messages ids={all} protectedIds={[3,4]}/><p>The host can retain these originals.</p></div><div className={styles.block}><strong>Compression state</strong><dl><dt>consumed by b1</dt><dd><Messages ids={[1,2,5]} consumed/></dd><dt>protected</dt><dd><Messages ids={[3,4]} protectedIds={[3,4]}/></dd><dt>remaining raw</dt><dd><Messages ids={[6,7,8]}/></dd></dl></div></div></Figure>
      <p><code>applyCompression()</code> returns the updated state. On the next turn, <code>processTurn()</code> uses that state to synchronize blocks, prune covered raw content and render active summaries with the remaining messages.</p>
      <Figure title="NEXT WORKING CONTEXT" caption="Conceptual composition. Actual summary insertion uses safe anchors and preserves tool/reasoning integrity."><div className={styles.view}><div className={styles.digest}><strong>b1 summary</strong><p>Authentication was implemented; tests passed.</p></div><Messages ids={[3,4]} protectedIds={[3,4]}/><Messages ids={[6,7,8]}/></div></Figure>
      <p>The protected pair remains fully visible. The consumed raw messages disappear from this view because b1 represents them. Historical compress tool calls can also be hidden according to their blocks’ state.</p>
      <p>This is <strong>prune / hide consumed ranges</strong>: a smaller rendered working context backed by explicit coverage. Exact source recovery still depends on the host retaining the original content.</p>
    </section>
    <section><h2>Summary</h2>
      <p>Compression has a visible result—a summary in place of earlier detail—and a state transition underneath it. The kernel resolves references, enforces protections, allocates a block, records coverage and uses the result to render the next view.</p>
      <Figure title="THE KERNEL EXECUTION CHAIN" caption="The model writes the summary. applyCompression records the legal operation. processTurn builds the next model-facing view."><ol className={styles.pipeline}>{steps.map(([title,code,description],i)=><li key={title}><span className={styles.number}>{String.fromCharCode(66+i)}</span><div><h3>{title}</h3><code>{code}</code><p>{description}</p></div></li>)}</ol><div className={styles.view}><div className={styles.digest}><strong>b1 summary</strong></div><Messages ids={[3,4]} protectedIds={[3,4]}/><Messages ids={[6,7,8]}/></div></Figure>
      <p><strong>This is where model-written language becomes context infrastructure state.</strong> The doctrine guides the model’s judgment about what to compress and what meaning to preserve. The kernel executes the structural transformations that make that decision addressable, protected and reflected in the next working context.</p>
    </section>
  </article>;
}
