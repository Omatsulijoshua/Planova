export interface User {
  id: string;
  email: string;
  role: string;
  status: string;
}

export interface TimetableEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  flexibility: 'FIXED' | 'SEMI_FLEXIBLE' | 'FLEXIBLE' | 'LOCKED';
}
