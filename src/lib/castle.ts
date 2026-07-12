import type { JournalEntry, Weakness } from "@/types";

export interface MansionLevel {
  mansion: number;
  name: string;
  description: string;
  guidance: string;
  virtue_focus: string;
}

export const mansions: MansionLevel[] = [
  {
    mansion: 1,
    name: "The Gate",
    description: "Beginning the journey. Becoming aware of recurring weaknesses.",
    guidance: "Focus on honest self-examination. Name what you see.",
    virtue_focus: "Humility",
  },
  {
    mansion: 2,
    name: "The Tug-of-War",
    description: "Feeling the pull between old habits and new virtues.",
    guidance: "Persist through dryness. Embrace the cross of effort.",
    virtue_focus: "Patience",
  },
  {
    mansion: 3,
    name: "The Practice",
    description: "Building consistent habits of reflection and virtue.",
    guidance: "Draw humility from aridities, not restlessness.",
    virtue_focus: "Diligence",
  },
  {
    mansion: 4,
    name: "The Quiet",
    description: "Less effort needed. Virtue begins to feel more natural.",
    guidance: "Be receptive. Let God work in you through stillness.",
    virtue_focus: "Trust",
  },
  {
    mansion: 5,
    name: "The Betrothal",
    description: "Deep self-knowledge. Detachment from what does not serve.",
    guidance: "Forget yourself. Focus only on love.",
    virtue_focus: "Charity",
  },
  {
    mansion: 6,
    name: "The Transforming",
    description: "Virtues are becoming second nature. Less inner conflict.",
    guidance: "Desire only God's will. Never seek consolations for their own sake.",
    virtue_focus: "Hope",
  },
  {
    mansion: 7,
    name: "The Union",
    description: "Complete self-forgetfulness. Pure awareness and love.",
    guidance: "Fix your eyes on Christ. Everything else follows.",
    virtue_focus: "Love",
  },
];

export interface WeeklyEntry {
  weekStart: string;
  weekEnd: string;
  entries: JournalEntry[];
  weaknessesAppeared: { name: string; count: number }[];
  virtuesPracticed: { name: string; count: number }[];
}

export interface CastleProgress {
  currentMansion: MansionLevel;
  entryCount: number;
  weekCount: number;
  strongestVirtue: string | null;
  mostFacedWeakness: string | null;
  trend: "growing" | "steady" | "beginning";
  weeklyData: WeeklyEntry[];
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function determineMansion(
  entryCount: number,
  weekCount: number,
  uniqueWeaknessCount: number,
  uniqueVirtueCount: number
): number {
  if (entryCount === 0) return 1;
  if (entryCount <= 3) return 1;
  if (entryCount <= 10) return 2;
  if (entryCount <= 20 && weekCount <= 4) return 2;
  if (entryCount <= 30) return 3;
  if (entryCount <= 50 && uniqueVirtueCount >= 3) return 4;
  if (entryCount <= 80) return 5;
  if (entryCount <= 120) return 6;
  return 7;
}

export function computeCastleProgress(
  entries: JournalEntry[],
  weaknesses: Weakness[],
  virtuesMap: Record<string, string>
): CastleProgress {
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const weeklyData: WeeklyEntry[] = [];
  const weekMap = new Map<string, JournalEntry[]>();

  sortedEntries.forEach((entry) => {
    const date = new Date(entry.created_at);
    const weekStart = getWeekStart(date);
    const key = weekStart.toISOString().split("T")[0];
    if (!weekMap.has(key)) {
      weekMap.set(key, []);
    }
    weekMap.get(key)!.push(entry);
  });

  const uniqueWeaknesses = new Set<string>();
  const uniqueVirtues = new Set<string>();
  const weaknessCounts: Record<string, number> = {};
  const virtueCounts: Record<string, number> = {};

  sortedEntries.forEach((entry) => {
    entry.weakness_ids.forEach((id) => {
      const w = weaknesses.find((x) => x.id === id);
      if (w) {
        uniqueWeaknesses.add(w.title);
        weaknessCounts[w.title] = (weaknessCounts[w.title] || 0) + 1;
      }
    });
    entry.virtue_ids.forEach((id) => {
      const name = virtuesMap[id] || id;
      uniqueVirtues.add(name);
      virtueCounts[name] = (virtueCounts[name] || 0) + 1;
    });
  });

  weekMap.forEach((weekEntries, key) => {
    const weekStartDate = new Date(key);
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);

    const wCounts: Record<string, number> = {};
    const vCounts: Record<string, number> = {};

    weekEntries.forEach((entry) => {
      entry.weakness_ids.forEach((id) => {
        const w = weaknesses.find((x) => x.id === id);
        if (w) wCounts[w.title] = (wCounts[w.title] || 0) + 1;
      });
      entry.virtue_ids.forEach((id) => {
        const name = virtuesMap[id] || id;
        vCounts[name] = (vCounts[name] || 0) + 1;
      });
    });

    weeklyData.push({
      weekStart: formatDateShort(weekStartDate),
      weekEnd: formatDateShort(weekEndDate),
      entries: weekEntries,
      weaknessesAppeared: Object.entries(wCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      virtuesPracticed: Object.entries(vCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
    });
  });

  const mansionNumber = determineMansion(
    entries.length,
    weekMap.size,
    uniqueWeaknesses.size,
    uniqueVirtues.size
  );

  const topWeakness = Object.entries(weaknessCounts).sort(
    ([, a], [, b]) => b - a
  )[0];
  const topVirtue = Object.entries(virtueCounts).sort(
    ([, a], [, b]) => b - a
  )[0];

  let trend: "growing" | "steady" | "beginning" = "beginning";
  if (entries.length > 30) trend = "growing";
  else if (entries.length > 10) trend = "steady";

  return {
    currentMansion: mansions[mansionNumber - 1],
    entryCount: entries.length,
    weekCount: weekMap.size,
    strongestVirtue: topVirtue ? topVirtue[0] : null,
    mostFacedWeakness: topWeakness ? topWeakness[0] : null,
    trend,
    weeklyData,
  };
}
