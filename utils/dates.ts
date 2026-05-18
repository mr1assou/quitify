export function dayKey(ts: number = Date.now()): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function startOfLocalDay(ts: number = Date.now()): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function daysBetween(from: number, to: number = Date.now()): number {
  const ms = Math.max(0, to - from);
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function isSameDay(a: number, b: number): boolean {
  return dayKey(a) === dayKey(b);
}

export function lastNDayKeys(n: number, ref: number = Date.now()): string[] {
  const out: string[] = [];
  const ref0 = startOfLocalDay(ref);
  for (let i = n - 1; i >= 0; i--) {
    out.push(dayKey(ref0 - i * 24 * 60 * 60 * 1000));
  }
  return out;
}
