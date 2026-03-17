import { motion } from "framer-motion";
import { RiskBadge } from "./RiskBadge";
import { RiskGauge } from "./RiskGauge";
import { AlertCircle } from "lucide-react";
import type { DetectResponse } from "@/lib/api";

interface AnalysisResultProps {
  result: DetectResponse;
  upiId?: string;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export function AnalysisResult({ result, upiId }: AnalysisResultProps) {
  const riskLevel = result.risk_level?.toUpperCase() || "";
  const isHigh = riskLevel.includes("HIGH");
  const score = result.risk_score ?? (isHigh ? 85 : riskLevel.includes("MEDIUM") ? 50 : 15);

  const borderColor = isHigh
    ? "border-risk-high/30"
    : riskLevel.includes("MEDIUM")
    ? "border-risk-medium/30"
    : "border-risk-low/30";

  return (
    <motion.div
      className={`card-surface ${borderColor} transition-colors duration-300`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <RiskGauge score={score} />
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="label-caps">Analysis Complete</span>
              {upiId && (
                <p className="font-mono text-sm text-muted-foreground mt-1">{upiId}</p>
              )}
            </div>
            <RiskBadge level={result.risk_level} />
          </div>

          <div className="p-3 rounded-lg bg-secondary/50">
            <p className="text-sm font-semibold">{result.decision}</p>
          </div>

          {result.reasons && result.reasons.length > 0 && (
            <div className="space-y-2">
              <span className="label-caps">Risk Signals</span>
              {result.reasons.map((reason, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex items-start gap-2 text-sm"
                >
                  <AlertCircle className="h-4 w-4 text-risk-high mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{reason}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isHigh && (
        <motion.div
          className="mt-4 p-3 rounded-lg bg-risk-high/10 border border-risk-high/20 text-sm text-risk-high"
          animate={{ scale: [1, 1.01, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          ⚠ Proceed with extreme caution. Multiple high-risk signals detected.
        </motion.div>
      )}
    </motion.div>
  );
}
