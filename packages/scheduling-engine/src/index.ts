import { TimetableEvent } from '@planova/shared-types';

export interface ConflictResult {
  hasConflict: boolean;
  conflictingEventIds: string[];
}

export function detectConflicts(events: TimetableEvent[]): ConflictResult {
  // Simple check for overlapping times
  const sorted = [...events].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i+1];
    if (new Date(current.endTime).getTime() > new Date(next.startTime).getTime()) {
      return {
        hasConflict: true,
        conflictingEventIds: [current.id, next.id]
      };
    }
  }
  return { hasConflict: false, conflictingEventIds: [] };
}

export * from './solver';
