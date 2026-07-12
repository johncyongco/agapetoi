import { motion } from "framer-motion";

interface StatsCardProps {
  label: string;
  value: number;
  index?: number;
}

export function StatsCard({ label, value, index = 0 }: StatsCardProps) {
  return (
    <motion.div
      className="py-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
    >
      <p className="font-stat text-[28px] leading-none tracking-tight font-semibold text-text">
        {value}
      </p>
      <p className="label-caps mt-2">{label}</p>
    </motion.div>
  );
}
