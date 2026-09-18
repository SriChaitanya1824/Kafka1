const counters: Record<string, number> = {};
const timings: Record<string, number[]> = {};
export const metrics = {
  inc(name: string) { counters[name] = (counters[name] ?? 0) + 1; },
  observe(name: string, value: number) { timings[name] = [...(timings[name] ?? []), value].slice(-1000); },
  snapshot() { return { counters, timings: Object.fromEntries(Object.entries(timings).map(([k, v]) => [k, { count: v.length, avg: v.reduce((a, b) => a + b, 0) / (v.length || 1) }])) }; }
};
