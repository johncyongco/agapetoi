import { motion } from "framer-motion";
import type { VirtueWithMapping } from "@/types";

interface VirtueCardProps {
  virtue: VirtueWithMapping;
  isFocus?: boolean;
  onSetFocus?: (id: string) => void;
  index?: number;
  compact?: boolean;
}

export function VirtueCard({
  virtue,
  isFocus,
  onSetFocus,
  index = 0,
  compact = false,
}: VirtueCardProps) {
  if (compact) {
    return (
      <motion.div
        className="card-editorial-padded"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <h3 className="text-editorial-3xl text-text mb-2">{virtue.name}</h3>
        <p className="text-editorial-sm text-text-secondary leading-relaxed">
          {virtue.description}
        </p>
        {virtue.mapped_from.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {virtue.mapped_from.map((from) => (
              <span
                key={from}
                className="text-editorial-xs text-olive"
              >
                {from}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="card-editorial"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="px-6 py-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-editorial-2xl text-text flex-1">{virtue.name}</h3>
          {onSetFocus && (
            <button
              onClick={() => onSetFocus(virtue.id)}
              className={`shrink-0 text-editorial-xs transition-colors duration-200 ${
                isFocus
                  ? "text-forest font-medium"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              {isFocus ? "Focus ✓" : "Set Focus →"}
            </button>
          )}
        </div>

        <p className="text-editorial-sm text-text-secondary leading-relaxed mb-3">
          {virtue.daily_practice}
        </p>

        {virtue.mapped_from.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="label-caps">From</span>
            {virtue.mapped_from.map((from) => (
              <span
                key={from}
                className="text-editorial-xs text-olive"
              >
                {from}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
