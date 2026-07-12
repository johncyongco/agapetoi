import type { Weakness, JournalEntry, InsightData } from "@/types";

export function computeInsights(
  weaknesses: Weakness[],
  journals: JournalEntry[]
): InsightData {
  const activeWeaknesses = weaknesses.filter((w) => w.status !== "archived");

  const weaknessCounts: Record<string, number> = {};
  const virtueCounts: Record<string, number> = {};

  journals.forEach((journal) => {
    journal.weakness_ids.forEach((id) => {
      const weakness = weaknesses.find((w) => w.id === id);
      if (weakness) {
        weaknessCounts[weakness.title] = (weaknessCounts[weakness.title] || 0) + 1;
      }
    });
    journal.virtue_ids.forEach((id) => {
      virtueCounts[id] = (virtueCounts[id] || 0) + 1;
    });
  });

  const topWeaknesses = Object.entries(weaknessCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topVirtues = Object.entries(virtueCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const monthlyEntries: { month: string; count: number }[] = [];
  const monthMap: Record<string, number> = {};

  journals.forEach((j) => {
    const date = new Date(j.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthMap[key] = (monthMap[key] || 0) + 1;
  });

  Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .forEach(([month, count]) => {
      monthlyEntries.push({ month, count });
    });

  return {
    mostCommonWeakness: topWeaknesses[0] || null,
    mostPracticedVirtue: topVirtues[0] || null,
    topWeaknesses,
    topVirtues,
    monthlyEntries,
  };
}

export function getTodayFocusId(
  activeWeaknesses: Weakness[],
  journals: JournalEntry[]
): string | null {
  if (activeWeaknesses.length === 0) return null;

  const counts: Record<string, number> = {};
  const now = new Date();

  journals.forEach((j) => {
    const created = new Date(j.created_at);
    const daysDiff = Math.floor((now.getTime() - created.getTime()) / 86400000);
    if (daysDiff <= 30) {
      j.weakness_ids.forEach((id) => {
        counts[id] = (counts[id] || 0) + 1;
      });
    }
  });

  let leastRecent = activeWeaknesses[0];
  let lowestCount = Infinity;

  activeWeaknesses.forEach((w) => {
    const count = counts[w.id] || 0;
    if (count < lowestCount) {
      lowestCount = count;
      leastRecent = w;
    }
  });

  return leastRecent?.id || null;
}
