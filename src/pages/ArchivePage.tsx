import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Archive } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { EmptyState } from "@/components/ui/EmptyState";
import { useWeaknessesStore } from "@/stores/weaknesses-store";
import { virtuesData } from "@/data/virtues-data";

export default function ArchivePage() {
  const { weaknesses, setWeaknessStatus } = useWeaknessesStore();
  const archived = weaknesses.filter((w) => w.status === "archived");

  return (
    <div className="min-h-screen bg-bg">
      <Header title="Archive" />

      <main className="max-w-3xl mx-auto px-5 lg:px-8 py-10 pb-24 lg:pb-12">
        <div className="mb-2">
          <h1 className="text-editorial-5xl text-text mb-2">Archive</h1>
          <p className="text-editorial-sm text-text-secondary">
            Archived weaknesses. Restore them anytime.
          </p>
        </div>

        <hr className="editorial-rule-thick my-6" />

        {archived.length === 0 ? (
          <EmptyState
            title="No archived weaknesses."
            description="When you archive a weakness, it will appear here."
          />
        ) : (
          <div className="space-y-0 bg-border">
            <AnimatePresence>
              {archived.map((w) => {
                const virtue = virtuesData.find((v) => v.id === w.virtue_id);
                return (
                  <motion.div
                    key={w.id}
                    className="bg-bg px-8 py-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-editorial-2xl text-text mb-1">
                          {w.title}
                        </h3>
                        {w.description && (
                          <p className="text-editorial-sm text-text-secondary leading-relaxed mb-3">
                            {w.description}
                          </p>
                        )}
                        {virtue && (
                          <span className="text-editorial-xs text-forest">
                            Virtue: {virtue.name}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setWeaknessStatus(w.id, "active")}
                        className="flex items-center gap-1.5 text-editorial-xs text-text-secondary hover:text-forest transition-colors shrink-0 mt-1"
                      >
                        <RotateCcw size={12} strokeWidth={1.5} />
                        Restore
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
