import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RiskBadge } from "@/components/RiskBadge";
import { ScanningAnimation } from "@/components/ScanningAnimation";
import { api } from "@/lib/api";

export default function WebsiteCheck() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await api.checkWebsite(domain.trim());
      setResult(res);
    } catch (e: any) {
      setError(e.message || "Failed to check website");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold flex items-center gap-3">
          <Globe className="h-6 w-6 text-risk-medium" />
          Website Safety Check
        </h1>
        <p className="text-muted-foreground text-[15px] mt-1">
          Verify if a payment website is safe before entering your details.
        </p>
      </motion.div>

      <div className="card-surface space-y-4">
        <span className="label-caps">Website Domain</span>
        <Input
          className="font-mono h-11 bg-secondary/50"
          placeholder="fakepay.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <Button
          onClick={handleCheck}
          disabled={loading || !domain.trim()}
          className="h-11 px-8 bg-foreground text-background hover:bg-foreground/90"
        >
          {loading ? "Checking..." : "Check Website"}
        </Button>
      </div>

      {loading && <ScanningAnimation />}
      {error && (
        <div className="card-surface border-risk-high/30 text-risk-high text-sm">{error}</div>
      )}

      {result && (
        <motion.div
          className="card-surface space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="label-caps">Domain Analysis</span>
              <p className="font-mono text-sm text-muted-foreground mt-1">{domain}</p>
            </div>
            <RiskBadge level={result.risk_level || "UNKNOWN"} />
          </div>
          <div className="p-3 rounded-lg bg-secondary/50 text-sm">
            {result.message || result.decision || "Analysis complete."}
          </div>
        </motion.div>
      )}
    </div>
  );
}
