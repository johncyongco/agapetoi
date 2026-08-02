import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { TodayFocus } from "@/components/home/TodayFocus";
import { StatsCard } from "@/components/home/StatsCard";
import { JournalWizard } from "@/components/journal/JournalWizard";
import { Modal } from "@/components/ui/Modal";
import { useWeaknessesStore } from "@/stores/weaknesses-store";
import { useJournalStore } from "@/stores/journal-store";
import { useVirtuesStore } from "@/stores/virtues-store";
import { useUIStore } from "@/stores/ui-store";
import { getTodayVirtues } from "@/lib/virtue-mappings";
import { getLocalDateKey, useExamenStore } from "@/stores/examen-store";

export default function HomePage() {
  const [journalOpen, setJournalOpen] = useState(false);
  const navigate = useNavigate();

  const { weaknesses } = useWeaknessesStore();
  const { entries } = useJournalStore();
  const { customMappings, focusId } = useVirtuesStore();
  const { settings } = useUIStore();
  const { entries: examenEntries } = useExamenStore();

  const activeWeaknesses = weaknesses.filter((w) => w.status !== "archived");
  const todayVirtues = getTodayVirtues(activeWeaknesses, customMappings, focusId);
  const primaryVirtue = todayVirtues[0] || null;
  const journalCount = entries.length;
  const examenComplete = examenEntries.some(
    (entry) => entry.date === getLocalDateKey()
  );

  return (
    <div className="app-background">
      <Header title="Home" />

      <main className="max-w-2xl mx-auto px-5 lg:px-0 py-10 pb-24 lg:pb-12 text-center">
        <TodayFocus
          virtue={primaryVirtue}
          userName={settings.name}
          onContinueReflection={() => setJournalOpen(true)}
        />

        <hr className="editorial-rule my-10" />

        <div className="grid grid-cols-3 gap-6 max-w-xs mx-auto">
          <StatsCard label="Weaknesses" value={activeWeaknesses.length} index={0} />
          <StatsCard label="Virtues" value={todayVirtues.length} index={1} />
          <StatsCard label="Entries" value={journalCount} index={2} />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3">
          <Link
            to="/examen"
            className="card-editorial-padded block transition-colors hover:border-text"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="label-caps mb-2">Daily Examen</p>
                <h2 className="text-editorial-3xl text-text mb-2">
                  {examenComplete ? "Today is complete." : "Review the day."}
                </h2>
                <p className="text-editorial-sm text-text-secondary leading-relaxed">
                  {examenComplete
                    ? "Your prayerful review is saved in the calendar."
                    : "Five quiet minutes with God, following the rhythm of St. Ignatius."}
                </p>
              </div>
              {examenComplete ? (
                <Check size={18} className="shrink-0 text-text" />
              ) : (
                <ArrowRight size={18} className="shrink-0 text-text" />
              )}
            </div>
            <p className="text-editorial-xs text-text-secondary mt-5">
              {examenComplete ? "Open today's Examen" : "Begin today's Examen"}
            </p>
          </Link>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="card-editorial-padded"
          >
            <p className="label-caps mb-4">Recent Reflection</p>
            {entries.length > 0 ? (
              <>
                <p className="text-editorial-lg text-text leading-relaxed mb-3 line-clamp-3">
                  {entries[0].reflection}
                </p>
                <p className="text-editorial-xs text-text-secondary mb-4">
                  {new Date(entries[0].created_at).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <button
                  onClick={() => navigate("/journal")}
                  className="group flex items-center gap-2 text-editorial-sm text-text hover:text-forest transition-colors"
                >
                  View all entries
                  <ArrowRight
                    size={14}
                    strokeWidth={1.5}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </button>
              </>
            ) : (
              <>
                <p className="text-editorial-lg text-text-secondary leading-relaxed mb-4">
                  No reflections yet.
                </p>
                <button
                  onClick={() => setJournalOpen(true)}
                  className="group flex items-center gap-2 text-editorial-sm text-text hover:text-forest transition-colors"
                >
                  Write your first reflection
                  <ArrowRight
                    size={14}
                    strokeWidth={1.5}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </button>
              </>
            )}
          </motion.div>
        </div>
      </main>

      <Modal
        isOpen={journalOpen}
        onClose={() => setJournalOpen(false)}
        title="Daily Reflection"
      >
        <JournalWizard onClose={() => setJournalOpen(false)} />
      </Modal>
    </div>
  );
}
