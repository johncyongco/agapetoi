import { motion } from "framer-motion";
import type { Weakness } from "@/types";
import { virtuesData } from "@/data/virtues-data";

interface WeaknessCardProps {
  weakness: Weakness;
  onEdit: (weakness: Weakness) => void;
  onArchive: (id: string) => void;
  index?: number;
}

const severityLabels = ["", "Mild", "Moderate", "Significant", "Strong", "Intense"];

export function WeaknessCard({
  weakness,
  onEdit,
  onArchive,
  index = 0,
}: WeaknessCardProps) {
  const virtue = virtuesData.find((v) => v.id === weakness.virtue_id);

  return (
    <motion.div
      className="card-editorial"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="px-6 py-5">
        <h3 className="text-editorial-2xl text-text mb-4">{weakness.title}</h3>

        {weakness.description && (
          <p className="text-editorial-sm text-text-secondary leading-relaxed mb-4">
            {weakness.description}
          </p>
        )}

        <div className="mb-4">
          <p className="label-caps mb-2">Severity</p>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-colors ${
                  s <= weakness.severity ? "bg-text" : "bg-border"
                }`}
              />
            ))}
            <span className="text-editorial-xs text-text-secondary ml-2">
              {severityLabels[weakness.severity]}
            </span>
          </div>
        </div>

        <div className="mb-5">
          <p className="label-caps mb-2">Virtue</p>
          <span className="text-editorial-xs text-forest">
            {virtue?.name || "Not assigned"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onEdit(weakness)}
            className="text-editorial-xs text-text hover:text-forest transition-colors"
          >
            Edit →
          </button>
          {weakness.status !== "archived" && (
            <button
              onClick={() => onArchive(weakness.id)}
              className="text-editorial-xs text-text-secondary hover:text-danger transition-colors"
            >
              Archive
            </button>
          )}
          <span className="text-editorial-xs text-text-secondary capitalize ml-auto">
            {weakness.status}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
