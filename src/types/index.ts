export type WeaknessStatus = "active" | "improving" | "archived";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface Weakness {
  id: string;
  user_id: string;
  title: string;
  description: string;
  severity: 1 | 2 | 3 | 4 | 5;
  status: WeaknessStatus;
  virtue_id: string | null;
  category: string;
  symptoms: string[];
  reflection_questions: string[];
  practice: string;
  scripture: string;
  saints_wisdom: string;
  related_weaknesses: string[];
  created_at: string;
  updated_at: string;
}

export interface Virtue {
  id: string;
  name: string;
  description: string;
  daily_practice: string;
  reflection_question: string;
}

export interface WeaknessVirtue {
  id: string;
  weakness_id: string;
  virtue_id: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  reflection: string;
  weakness_ids: string[];
  virtue_ids: string[];
  lesson: string;
  tomorrow_practice: string;
  created_at: string;
}

export interface JournalWeakness {
  id: string;
  journal_id: string;
  weakness_id: string;
}

export interface JournalVirtue {
  id: string;
  journal_id: string;
  virtue_id: string;
}

export interface ExamenResponse {
  step: string;
  prompt: string;
  response: string;
}

export interface ExamenEntry {
  id: string;
  date: string;
  created_at: string;
  responses: ExamenResponse[];
  archived: boolean;
}

export interface VirtueWithMapping extends Virtue {
  mapped_from: string[];
}

export interface DailyVirtues {
  date: string;
  virtues: VirtueWithMapping[];
  focus_id: string | null;
}

export interface InsightData {
  mostCommonWeakness: { name: string; count: number } | null;
  mostPracticedVirtue: { name: string; count: number } | null;
  topWeaknesses: { name: string; count: number }[];
  topVirtues: { name: string; count: number }[];
  monthlyEntries: { month: string; count: number }[];
}

export type Theme = "light" | "dark" | "system";

export interface UserSettings {
  name: string;
  theme: Theme;
}
