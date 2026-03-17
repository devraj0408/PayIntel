import { motion } from "framer-motion";

interface RiskGaugeProps {
  score: number; // 0-100
}

export function RiskGauge({ score }: RiskGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const needleAngle = -90 + (clampedScore / 100) * 180;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-48 h-auto">
        {/* Green arc 0-30 */}
        <path
          d="M 20 100 A 80 80 0 0 1 74 28"
          fill="none"
          stroke="hsl(var(--risk-low))"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Yellow arc 30-70 */}
        <path
          d="M 74 28 A 80 80 0 0 1 126 28"
          fill="none"
          stroke="hsl(var(--risk-medium))"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Red arc 70-100 */}
        <path
          d="M 126 28 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="hsl(var(--risk-high))"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Needle */}
        <motion.line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transformOrigin: "100px 100px" }}
          initial={{ rotate: -90 }}
          animate={{ rotate: needleAngle }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <circle cx="100" cy="100" r="4" fill="white" />
      </svg>
      <motion.span
        className="text-3xl font-bold font-mono mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {clampedScore}
      </motion.span>
      <span className="label-caps mt-1">Risk Score</span>
    </div>
  );
}
