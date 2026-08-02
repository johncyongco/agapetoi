import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [virtueOpen, setVirtueOpen] = useState(false);
  const navigate = useNavigate();

  const { weaknesses } = useWeaknessesStore();
  const { entries } = useJournalStore();
  const { customMappings, focusId } = useVirtuesStore();
  const { settings } = useUIStore();

  const activeWeaknesses = weaknesses.filter((w) => w.status !== "archived");
  const todayVirtues = getTodayVirtues(activeWeaknesses, customMappings, focusId);
  const primaryVirtue = todayVirtues[0] || null;
  const journalCount = entries.length;

  return (
    <div className="app-background">
      <Header title="Home" />

      <main className="max-w-2xl mx-auto px-5 lg:px-0 py-10 pb-24 lg:pb-12 text-center">
        <TodayFocus
          virtue={primaryVirtue}
          userName={settings.name}
          onContinueReflection={() => setJournalOpen(true)}
          onVirtueClick={() => setVirtueOpen(true)}
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
                <h2 className="text-editorial-3xl text-text">Begin today&apos;s Examen</h2>
              </div>
              <ArrowRight size={18} className="shrink-0 text-text" />
            </div>
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
                <p className="text-editorial-lg text-text-secondary leading-relaxed mb-4 text-center">
                  No reflections yet.
                </p>
                <button
                  onClick={() => setJournalOpen(true)}
                  className="group mx-auto flex items-center gap-2 text-editorial-sm text-text hover:text-forest transition-colors"
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

      <Modal
        isOpen={virtueOpen && primaryVirtue !== null}
        onClose={() => setVirtueOpen(false)}
        title={primaryVirtue?.name}
      >
        {primaryVirtue && (
          <div className="space-y-6 text-left">
            <div>
              <p className="label-caps mb-2">About this virtue</p>
              <p className="text-editorial-lg text-text-secondary leading-relaxed">
                {primaryVirtue.description}
              </p>
            </div>

            <div>
              <p className="label-caps mb-2">Daily practice</p>
              <p className="text-editorial-sm text-text leading-relaxed">
                {primaryVirtue.daily_practice}
              </p>
            </div>

            <div>
              <p className="label-caps mb-2">Reflection question</p>
              <p className="text-editorial-sm text-text-secondary leading-relaxed italic">
                {primaryVirtue.reflection_question}
              </p>
            </div>

            {primaryVirtue.mapped_from.length > 0 && (
              <div>
                <p className="label-caps mb-2">Cultivated from</p>
                <p className="text-editorial-xs text-forest">
                  {primaryVirtue.mapped_from.join(", ")}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
