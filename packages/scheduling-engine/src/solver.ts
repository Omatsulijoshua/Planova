export interface SolverTask {
  id: string;
  title: string;
  durationMin: number; // e.g. 60 min
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dependencies?: string[];
}

export interface SolverRoutine {
  id: string;
  name: string;
  durationMin: number;
  daysOfWeek: number[];
  startHour: number;
  startMinute: number;
}

export interface SolverPreferences {
  wakeTime: string; // "07:00"
  sleepTime: string; // "23:00"
}

export interface ScheduledBlock {
  id: string;
  title: string;
  type: 'routine' | 'task';
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
}

export interface SolverResult {
  success: boolean;
  schedule: ScheduledBlock[];
  logs: string[];
  conflicts: string[];
  executionTimeMs: number;
}

export class CspSolver {
  private totalSlots = 96; // 24 hours * 4 slots/hour
  private slotsPerHour = 4;

  solve(tasks: SolverTask[], routines: SolverRoutine[], prefs: SolverPreferences): SolverResult {
    const startTime = Date.now();
    const logs: string[] = ['Initializing CSP solver...'];
    const conflicts: string[] = [];
    const schedule: ScheduledBlock[] = [];

    // 1. Initialize slot grid (false = free, true = blocked)
    const grid = new Array<boolean>(this.totalSlots).fill(false);

    // 2. Parse wake/sleep times
    const wakeSlot = this.timeToSlot(prefs.wakeTime);
    const sleepSlot = this.timeToSlot(prefs.sleepTime);

    logs.push(`Sleep period configured: ${prefs.sleepTime} to ${prefs.wakeTime}`);

    // Block sleep slots (from sleepSlot to wakeSlot across midnight)
    let sleepSlotCount = 0;
    let s = sleepSlot;
    while (s !== wakeSlot) {
      grid[s] = true;
      s = (s + 1) % this.totalSlots;
      sleepSlotCount++;
    }
    logs.push(`Protected sleep period: blocked ${sleepSlotCount} slots`);

    // 3. Pre-allocate routines (Hard Constraint)
    for (const routine of routines) {
      const startSlot = routine.startHour * this.slotsPerHour + Math.floor(routine.startMinute / 15);
      const slotsNeeded = Math.ceil(routine.durationMin / 15);
      
      logs.push(`Allocating routine '${routine.name}' starting at slot ${startSlot} (${slotsNeeded} slots)`);

      for (let i = 0; i < slotsNeeded; i++) {
        const slotIdx = (startSlot + i) % this.totalSlots;
        if (grid[slotIdx]) {
          conflicts.push(`Routine '${routine.name}' overlaps with another routine or sleep block`);
        }
        grid[slotIdx] = true;
      }

      // Add to schedule output
      const endSlot = (startSlot + slotsNeeded) % this.totalSlots;
      schedule.push({
        id: routine.id,
        title: routine.name,
        type: 'routine',
        start: this.slotToTime(startSlot),
        end: this.slotToTime(endSlot),
      });
    }

    // 4. Backtracking search to place tasks
    const unassignedTasks = [...tasks];
    const taskAssignments = new Map<string, number>(); // taskId -> startSlot

    const searchSuccess = this.backtrack(unassignedTasks, taskAssignments, grid, logs);

    if (searchSuccess) {
      logs.push('Backtracking search completed successfully');
      for (const [taskId, startSlot] of taskAssignments.entries()) {
        const task = tasks.find((t) => t.id === taskId)!;
        const slotsNeeded = Math.ceil(task.durationMin / 15);
        schedule.push({
          id: task.id,
          title: task.title,
          type: 'task',
          start: this.slotToTime(startSlot),
          end: this.slotToTime(startSlot + slotsNeeded),
        });
      }
    } else {
      logs.push('Backtracking search failed to find a valid solution under hard constraints');
    }

    return {
      success: searchSuccess,
      schedule,
      logs,
      conflicts,
      executionTimeMs: Date.now() - startTime,
    };
  }

  private backtrack(
    unassigned: SolverTask[],
    assignments: Map<string, number>,
    grid: boolean[],
    logs: string[]
  ): boolean {
    if (unassigned.length === 0) return true;

    // HEURISTIC: Minimum Remaining Values (MRV)
    // Select the task with the fewest valid placement starting positions first
    let bestTaskIdx = 0;
    let minValidPositions = Infinity;
    const taskValidDomains = new Map<string, number[]>();

    for (let i = 0; i < unassigned.length; i++) {
      const task = unassigned[i];
      const validSlots = this.getValidSlotsForTask(task, grid);
      taskValidDomains.set(task.id, validSlots);

      if (validSlots.length < minValidPositions) {
        minValidPositions = validSlots.length;
        bestTaskIdx = i;
      }
    }

    const task = unassigned[bestTaskIdx];
    const validPositions = taskValidDomains.get(task.id) || [];

    logs.push(`MRV: Selecting task '${task.title}' (valid slots count: ${validPositions.length})`);

    // If no valid positions exist for this task, backtrack
    if (validPositions.length === 0) {
      logs.push(`Backtrack: No valid slots left for task '${task.title}'`);
      return false;
    }

    // Try placing the task at each valid slot position
    const slotsNeeded = Math.ceil(task.durationMin / 15);
    const nextUnassigned = unassigned.filter((_, idx) => idx !== bestTaskIdx);

    for (const startSlot of validPositions) {
      // Apply assignment (mark grid)
      for (let i = 0; i < slotsNeeded; i++) {
        grid[startSlot + i] = true;
      }
      assignments.set(task.id, startSlot);

      // HEURISTIC: Forward Checking
      // Verify that this placement doesn't leave any other unassigned task with 0 valid domains
      let forwardCheckOk = true;
      for (const remainingTask of nextUnassigned) {
        const remainingValid = this.getValidSlotsForTask(remainingTask, grid);
        if (remainingValid.length === 0) {
          forwardCheckOk = false;
          break;
        }
      }

      if (forwardCheckOk) {
        const success = this.backtrack(nextUnassigned, assignments, grid, logs);
        if (success) return true;
      }

      // Revert assignment (backtrack)
      for (let i = 0; i < slotsNeeded; i++) {
        grid[startSlot + i] = false;
      }
      assignments.delete(task.id);
    }

    return false;
  }

  private getValidSlotsForTask(task: SolverTask, grid: boolean[]): number[] {
    const validSlots: number[] = [];
    const slotsNeeded = Math.ceil(task.durationMin / 15);

    // Scan slots (must fit contiguously within 24h day boundary)
    for (let start = 0; start <= this.totalSlots - slotsNeeded; start++) {
      let fits = true;
      for (let i = 0; i < slotsNeeded; i++) {
        if (grid[start + i]) {
          fits = false;
          break;
        }
      }
      if (fits) {
        validSlots.push(start);
      }
    }
    return validSlots;
  }

  private timeToSlot(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * this.slotsPerHour + Math.floor(minutes / 15);
  }

  private slotToTime(slot: number): string {
    const normalizedSlot = slot % this.totalSlots;
    const hours = Math.floor(normalizedSlot / this.slotsPerHour);
    const minutes = (normalizedSlot % this.slotsPerHour) * 15;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}
