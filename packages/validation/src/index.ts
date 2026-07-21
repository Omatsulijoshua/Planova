export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function isValidEventDuration(start: Date, end: Date): boolean {
  return end.getTime() > start.getTime();
}
