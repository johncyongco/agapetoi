import { motion } from "framer-motion";
import type { JournalEntry } from "@/types";
import { useWeaknessesStore } from "@/stores/weaknesses-store";
import { virtuesData } from "@/data/virtues-data";

interface ReflectionCardProps {
  entry: JournalEntry;
  index?: number;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export function ReflectionCard({ entry, index = 0, onEdit, onDelete }: ReflectionCardProps) {
  const { weaknesses } = useWeaknessesStore();

  const date = new Date(entry.created_at);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const entryWeaknesses = weaknesses.filter((w) =>
    entry.weakness_ids.includes(w.id)
  );
  const entryVirtues = virtuesData.filter((v) =>
    entry.virtue_ids.includes(v.id)
  );

  return (
    <motion.div
      className="card-editorial"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="px-6 py-5">
        <div className="flex items-start justify-between mb-4">
          <p className="label-caps">{formattedDate}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onEdit(entry)}
              className="text-editorial-xs text-text-secondary hover:text-text transition-colors"
            >
              Edit →
            </button>
            <button
              onClick={() => onDelete(entry.id)}
              className="text-editorial-xs text-text-secondary hover:text-danger transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        <p className="text-editorial-lg text-text leading-relaxed mb-5">
          {entry.reflection}
        </p>

        {(entryWeaknesses.length > 0 || entryVirtues.length > 0) && (
          <>
            <hr className="editorial-rule" />
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
              {entryWeaknesses.length > 0 && (
                <div>
                  <p className="label-caps mb-1.5">Weaknesses</p>
                  <div className="flex flex-wrap gap-2">
                    {entryWeaknesses.map((w) => (
                      <span
                        key={w.id}
                        className="text-editorial-xs text-gold"
                      >
                        {w.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {entryVirtues.length > 0 && (
                <div>
                  <p className="label-caps mb-1.5">Virtues</p>
                  <div className="flex flex-wrap gap-2">
                    {entryVirtues.map((v) => (
                      <span
                        key={v.id}
                        className="text-editorial-xs text-forest"
                      >
                        {v.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {entry.lesson && (
          <>
            <hr className="editorial-rule mt-4" />
            <div className="mt-4">
              <p className="label-caps mb-1.5">Lesson</p>
              <p className="text-editorial-sm text-text-secondary leading-relaxed">
                {entry.lesson}
              </p>
            </div>
          </>
        )}

        {entry.tomorrow_practice && (
          <>
            <hr className="editorial-rule mt-4" />
            <div className="mt-4">
              <p className="label-caps mb-1.5">Tomorrow</p>
              <p className="text-editorial-sm text-text-secondary italic">
                {entry.tomorrow_practice}
              </p>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
