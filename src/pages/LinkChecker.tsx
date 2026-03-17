import { useState } from "react";
import { motion } from "framer-motion";
import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnalysisResult } from "@/components/AnalysisResult";
import { ScanningAnimation } from "@/components/ScanningAnimation";
import { api, type DetectResponse } from "@/lib/api";

export default function LinkChecker() {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectResponse | null>(null);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!link.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await api.checkLink(link.trim());
      setResult(res);
    } catch (e: any) {
      setError(e.message || "Failed to check link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold flex items-center gap-3">
          <Link2 className="h-6 w-6 text-risk-medium" />
          Payment Link Checker
        </h1>
        <p className="text-muted-foreground text-[15px] mt-1">
          Paste a payment link to verify it before making a transaction.
        </p>
      </motion.div>

      <div className="card-surface space-y-4">
        <span className="label-caps">Payment Link</span>
        <Input
          className="font-mono h-11 bg-secondary/50"
          placeholder="upi://pay?pa=user@upi&am=9000"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <Button
          onClick={handleCheck}
          disabled={loading || !link.trim()}
          className="h-11 px-8 bg-foreground text-background hover:bg-foreground/90"
        >
          {loading ? "Checking..." : "Check Link"}
        </Button>
      </div>

      {loading && <ScanningAnimation />}
      {error && (
        <div className="card-surface border-risk-high/30 text-risk-high text-sm">{error}</div>
      )}
      {result && <AnalysisResult result={result} />}
    </div>
  );
}
