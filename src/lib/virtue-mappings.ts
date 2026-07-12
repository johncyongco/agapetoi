import type { Virtue, VirtueWithMapping, Weakness } from "@/types";
import { virtuesData } from "@/data/virtues-data";
import { defaultWeaknesses } from "@/data/weaknesses-data";

const weaknessVirtueMap: Record<string, string[]> = {};

defaultWeaknesses.forEach((w) => {
  weaknessVirtueMap[w.title.toLowerCase()] = [w.mapped_virtue];
});

function hashDate(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

export function getVirtuesForWeakness(weaknessTitle: string): string[] {
  return weaknessVirtueMap[weaknessTitle.toLowerCase()] || [];
}

export function getVirtuesByIds(ids: string[]): Virtue[] {
  return virtuesData.filter((v) => ids.includes(v.id));
}

export function getTodayVirtues(
  activeWeaknesses: Weakness[],
  customMappings?: Record<string, string[]>
): VirtueWithMapping[] {
  const today = new Date().toISOString().split("T")[0];
  const seed = hashDate(today);

  const virtueCount: Record<string, { virtue: Virtue; mappedFrom: string[] }> = {};

  activeWeaknesses.forEach((weakness) => {
    const mapping =
      customMappings?.[weakness.id] ||
      weaknessVirtueMap[weakness.title.toLowerCase()] ||
      [];

    mapping.forEach((virtueId) => {
      const virtue = virtuesData.find((v) => v.id === virtueId);
      if (virtue) {
        if (!virtueCount[virtueId]) {
          virtueCount[virtueId] = { virtue, mappedFrom: [] };
        }
        virtueCount[virtueId].mappedFrom.push(weakness.title);
      }
    });
  });

  const allVirtues = Object.values(virtueCount).map(({ virtue, mappedFrom }) => ({
    ...virtue,
    mapped_from: mappedFrom,
  }));

  if (allVirtues.length === 0) {
    const fallbackIndex = seed % virtuesData.length;
    const fallback = virtuesData[fallbackIndex];
    return [{ ...fallback, mapped_from: [] }];
  }

  const shuffled = [...allVirtues].sort((a, b) => {
    const hashA = hashDate(a.id + today);
    const hashB = hashDate(b.id + today);
    return hashA - hashB;
  });

  return shuffled;
}

export function getPrimaryVirtue(
  activeWeaknesses: Weakness[],
  customMappings?: Record<string, string[]>
): VirtueWithMapping | null {
  const virtues = getTodayVirtues(activeWeaknesses, customMappings);
  return virtues[0] || null;
}
