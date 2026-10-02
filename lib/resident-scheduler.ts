export type ResidentSchedule = {
  local: boolean; busy: boolean; paused: boolean; collapsed: boolean;
  hidden: boolean; pending: boolean; nextAmbientAt: number; lastTypedAt: number;
};
export function residentAction(state: ResidentSchedule, now: number): 'visitor' | 'ambient' | null {
  if (!state.local || state.busy || state.paused || state.collapsed || state.hidden) return null;
  if (state.pending) return 'visitor';
  if (now - state.lastTypedAt < 10_000 || now < state.nextAmbientAt) return null;
  return 'ambient';
}
