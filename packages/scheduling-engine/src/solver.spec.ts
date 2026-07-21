import { CspSolver, SolverTask, SolverRoutine, SolverPreferences } from './solver';

describe('CspSolver', () => {
  let solver: CspSolver;

  beforeEach(() => {
    solver = new CspSolver();
  });

  it('should generate a basic timetable successfully', () => {
    const tasks: SolverTask[] = [
      { id: 'task-1', title: 'Study Math', durationMin: 60, priority: 'HIGH' },
      { id: 'task-2', title: 'Exercise', durationMin: 30, priority: 'MEDIUM' },
    ];

    const routines: SolverRoutine[] = [
      { id: 'routine-1', name: 'Work Hour', durationMin: 60, daysOfWeek: [1], startHour: 9, startMinute: 0 },
    ];

    const prefs: SolverPreferences = {
      wakeTime: '07:00',
      sleepTime: '22:00',
    };

    const result = solver.solve(tasks, routines, prefs);

    expect(result.success).toBe(true);
    expect(result.schedule.length).toBe(3); // 1 routine + 2 tasks
    expect(result.logs.length).toBeGreaterThan(0);
    expect(result.executionTimeMs).toBeLessThan(100);
  });

  it('should protect sleep period and not place tasks during sleep hours', () => {
    const tasks: SolverTask[] = [
      { id: 'task-1', title: 'Late Study', durationMin: 120, priority: 'HIGH' },
    ];

    // Wake 08:00, Sleep 09:00 -> Only 1 hour of awake time!
    // But task needs 2 hours (120 mins) -> Should fail because sleep is protected!
    const prefs: SolverPreferences = {
      wakeTime: '08:00',
      sleepTime: '09:00',
    };

    const result = solver.solve(tasks, [], prefs);

    expect(result.success).toBe(false);
    expect(result.schedule.length).toBe(0);
  });

  it('should detect overlaps and backtrack early', () => {
    const tasks: SolverTask[] = [
      { id: 'task-1', title: 'Coding 1', durationMin: 60, priority: 'HIGH' },
      { id: 'task-2', title: 'Coding 2', durationMin: 60, priority: 'HIGH' },
    ];

    // 08:00 to 09:00 awake window = Only 1 hour (4 slots)
    // But both tasks need 1 hour each (2 hours total) -> Should fail to place both!
    const prefs: SolverPreferences = {
      wakeTime: '08:00',
      sleepTime: '09:00',
    };

    const result = solver.solve(tasks, [], prefs);

    expect(result.success).toBe(false);
  });
});
