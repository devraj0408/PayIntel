import { ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";

interface RiskBadgeProps {
  level: string;
}

export function RiskBadge({ level }: RiskBadgeProps) {
  const normalized = level?.toUpperCase() || "";

  if (normalized.includes("HIGH")) {
    return (
      <span className="risk-badge-high inline-flex items-center gap-1.5">
        <ShieldAlert className="h-3.5 w-3.5" />
        High Risk
      </span>
    );
  }

  if (normalized.includes("MEDIUM")) {
    return (
      <span className="risk-badge-medium inline-flex items-center gap-1.5">
        <AlertTriangle className="h-3.5 w-3.5" />
        Medium Risk
      </span>
    );
  }

  return (
    <span className="risk-badge-low inline-flex items-center gap-1.5">
      <ShieldCheck className="h-3.5 w-3.5" />
      Low Risk
    </span>
  );
}
