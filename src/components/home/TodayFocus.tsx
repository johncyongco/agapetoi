import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { VirtueWithMapping } from "@/types";
import { getGreeting, getEncouragingQuote } from "@/data/weaknesses-data";

interface TodayFocusProps {
  virtue: VirtueWithMapping | null;
  userName?: string;
  onContinueReflection?: () => void;
}

export function TodayFocus({
  virtue,
  userName,
  onContinueReflection,
}: TodayFocusProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-editorial-sm text-text-secondary tracking-wide">
        {getGreeting()}{userName ? `, ${userName}` : ""}
      </p>

      <h1 className="font-heading text-[51px] leading-none tracking-tight text-text mt-2 mb-8">
        Know Yourself.
      </h1>

      <hr className="editorial-rule-thick mb-8" />

      {virtue ? (
        <div className="mb-10">
          <p className="label-caps mb-3">Today's Virtue</p>
          <h2 className="text-editorial-5xl text-text mb-4">{virtue.name}</h2>

          <hr className="editorial-rule my-6" />

          <p className="label-caps mb-3">Today's Practice</p>
          <p className="text-editorial-lg text-text-secondary leading-relaxed">
            {virtue.daily_practice}
          </p>
        </div>
      ) : (
        <div className="mb-10">
          <p className="text-editorial-lg text-text-secondary italic">
            {getEncouragingQuote()}
          </p>
          <p className="text-editorial-sm text-text-secondary mt-4">
            Add weaknesses to receive daily virtue guidance.
          </p>
        </div>
      )}

      <hr className="editorial-rule mb-8" />

      <p className="text-editorial-sm text-text-secondary italic leading-relaxed max-w-md">
        "{getEncouragingQuote()}"
      </p>

      {onContinueReflection && (
        <div className="mt-8">
          <button
            onClick={onContinueReflection}
            className="group flex items-center gap-2 text-editorial-sm text-text hover:text-forest transition-colors duration-200"
          >
            Continue Reflection
            <ArrowRight
              size={14}
              strokeWidth={1.5}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </button>
        </div>
      )}
    </motion.div>
  );
}
