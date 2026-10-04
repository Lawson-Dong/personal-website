export type RecoveryItem = { id: string; title: string; text: string };
export type RecoveryMode = "retrieve" | "one" | "full";
export const recoveryMessages: RecoveryItem[] = [
  { id: "m00412", title: "Migration goal", text: "Move auth middleware to the new API adapter; preserve the retry policy." },
  { id: "m00425", title: "Timeout decision", text: "Set AUTH_TIMEOUT_MS=30000. The old 10-second timeout cut off the migration probe." },
  { id: "m00437", title: "Exact error", text: "Error: ECONNRESET during auth migration\nrequest_id=auth-probe-07\nendpoint=/v2/session; elapsed_ms=10012" },
  { id: "m00468", title: "Test command", text: "npm run test:auth -- --runInBand\nResult: 18 passed, 0 failed. Retry policy: 2 retries." },
  { id: "m00469", title: "Documentation", text: "Document the migration in docs/auth-migration.md; link the timeout decision." },
  { id: "m00480", title: "Review complete", text: "Migration notes reviewed. Keep the rollback command in the runbook." },
];
export const recoveryBlocks = [
  { id: "b017", title: "API migration", span: "m00412–m00468", summary: "Moved auth middleware; timeout changed to 30s; retry policy retained; migration tests passed.", sourceIds: ["m00412", "m00425", "m00437", "m00468"] },
  { id: "b018", title: "Documentation", span: "m00469–m00480", summary: "Updated the migration runbook and completed review.", sourceIds: ["m00469", "m00480"] },
];
export const recoveryRoot: RecoveryItem = { id: "b021", title: "Migration phase · tier 2", text: "API migration completed, validated and documented." };
export function searchRecovery(query: string) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return terms.length ? recoveryBlocks.filter(b => terms.some(t => `${b.title} ${b.summary}`.toLowerCase().includes(t))) : [];
}
export function recoverItems(target: string, mode: RecoveryMode): RecoveryItem[] {
  if (mode === "retrieve") return recoveryMessages.filter(m => m.id === target);
  if (target === recoveryRoot.id) return mode === "one"
    ? recoveryBlocks.map(b => ({ id: b.id, title: b.title, text: b.summary }))
    : recoveryMessages;
  const block = recoveryBlocks.find(b => b.id === target);
  return block ? recoveryMessages.filter(m => block.sourceIds.includes(m.id)) : [];
}
