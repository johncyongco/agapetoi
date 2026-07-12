import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

export default function HomePage() {
  const [journalOpen, setJournalOpen] = useState(false);
  const navigate = useNavigate();

  const { weaknesses } = useWeaknessesStore();
  const { entries } = useJournalStore();
  const { customMappings } = useVirtuesStore();
  const { settings } = useUIStore();

  const activeWeaknesses = weaknesses.filter((w) => w.status !== "archived");
  const todayVirtues = getTodayVirtues(activeWeaknesses, customMappings);
  const primaryVirtue = todayVirtues[0] || null;
  const journalCount = entries.length;

  return (
    <div className="min-h-screen bg-bg">
      <Header title="Home" />

      <main className="max-w-2xl mx-auto px-5 lg:px-0 py-10 pb-24 lg:pb-12">
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

        {entries.length > 0 && (
          <>
            <hr className="editorial-rule my-10" />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="label-caps mb-4">Recent Reflection</p>
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
            </motion.div>
          </>
        )}
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
