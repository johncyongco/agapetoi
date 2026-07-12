import { motion } from "framer-motion";
import type { InsightData } from "@/types";
import { virtuesData } from "@/data/virtues-data";

interface InsightChartProps {
  data: InsightData;
}

export function InsightChart({ data }: InsightChartProps) {
  const hasData =
    data.topWeaknesses.length > 0 || data.topVirtues.length > 0;

  if (!hasData) {
    return (
      <div className="py-20">
        <h3 className="text-editorial-4xl text-text mb-3">
          Quiet so far.
        </h3>
        <p className="text-editorial-sm text-text-secondary leading-relaxed max-w-sm">
          Start journaling to see patterns in your self-knowledge. No
          rush. No pressure. Just awareness.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0 bg-border">
      {data.mostCommonWeakness && (
        <motion.div
          className="bg-bg px-8 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="label-caps mb-3">Most Common</p>
          <h3 className="text-editorial-4xl text-text mb-1">
            {data.mostCommonWeakness.name}
          </h3>
          <p className="text-editorial-sm text-text-secondary">
            {data.mostCommonWeakness.count} reflection
            {data.mostCommonWeakness.count !== 1 ? "s" : ""}
          </p>
        </motion.div>
      )}

      {data.mostPracticedVirtue && (
        <motion.div
          className="bg-bg px-8 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="label-caps mb-3">Growing Virtue</p>
          <h3 className="text-editorial-4xl text-text">
            {virtuesData.find((v) => v.id === data.mostPracticedVirtue!.name)
              ?.name || data.mostPracticedVirtue.name}
          </h3>
          <p className="text-editorial-sm text-text-secondary">
            {data.mostPracticedVirtue.count} practice
            {data.mostPracticedVirtue.count !== 1 ? "s" : ""}
          </p>
        </motion.div>
      )}

      {data.topWeaknesses.length > 0 && (
        <motion.div
          className="bg-bg px-8 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <p className="label-caps mb-5">Weaknesses</p>
          <div className="space-y-4">
            {data.topWeaknesses.map((w, i) => {
              const maxCount = data.topWeaknesses[0].count;
              const width = (w.count / maxCount) * 100;
              return (
                <div key={w.name}>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-editorial-sm text-text">
                      {w.name}
                    </span>
                    <span className="font-stat text-sm text-text-secondary">
                      {w.count}
                    </span>
                  </div>
                  <div className="h-px bg-border">
                    <motion.div
                      className="h-px bg-text"
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{
                        duration: 0.6,
                        delay: 0.2 + i * 0.08,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {data.topVirtues.length > 0 && (
        <motion.div
          className="bg-bg px-8 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="label-caps mb-5">Virtues Practiced</p>
          <div className="space-y-4">
            {data.topVirtues.map((v, i) => {
              const maxCount = data.topVirtues[0].count;
              const width = (v.count / maxCount) * 100;
              const virtue = virtuesData.find((vr) => vr.id === v.name);
              return (
                <div key={v.name}>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-editorial-sm text-text">
                      {virtue?.name || v.name}
                    </span>
                    <span className="font-stat text-sm text-text-secondary">
                      {v.count}
                    </span>
                  </div>
                  <div className="h-px bg-border">
                    <motion.div
                      className="h-px bg-forest"
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{
                        duration: 0.6,
                        delay: 0.25 + i * 0.08,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {data.monthlyEntries.length > 0 && (
        <motion.div
          className="bg-bg px-8 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <p className="label-caps mb-5">Monthly Reflections</p>
          <div className="flex items-end gap-3 h-20">
            {data.monthlyEntries.map((m, i) => {
              const maxCount = Math.max(
                ...data.monthlyEntries.map((e) => e.count)
              );
              const height =
                maxCount > 0 ? (m.count / maxCount) * 100 : 0;
              return (
                <div
                  key={m.month}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <motion.div
                    className="w-full bg-text/10"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{
                      duration: 0.5,
                      delay: 0.3 + i * 0.06,
                    }}
                  />
                  <span className="text-editorial-xs text-text-secondary">
                    {m.month.split("-")[1]}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
