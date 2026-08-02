import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center text-center py-20 px-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-editorial-4xl text-text mb-3">{title}</h3>
      <p className="text-editorial-sm text-text-secondary leading-relaxed max-w-sm mb-8 mx-auto">
        {description}
      </p>
      {action}
    </motion.div>
  );
}
