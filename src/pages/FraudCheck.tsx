import { useState } from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnalysisResult } from "@/components/AnalysisResult";
import { ScanningAnimation } from "@/components/ScanningAnimation";
import { api, type DetectRequest, type DetectResponse } from "@/lib/api";

export default function FraudCheck() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectResponse | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState<DetectRequest>({
    upi_id: "",
    amount: 0,
    time_of_day: new Date().getHours(),
    receiver_age_days: 30,
    receiver_report_count: 0,
    location_risk: 0.5,
    device_trust_score: 0.5,
  });

  const update = (key: keyof DetectRequest, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleCheck = async () => {
    if (!form.upi_id.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await api.detect(form);
      setResult(res);
    } catch (e: any) {
      setError(e.message || "Failed to connect to API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-semibold flex items-center gap-3">
          <Shield className="h-6 w-6 text-risk-high" />
          Fraud Check
        </h1>
        <p className="text-muted-foreground text-[15px] mt-1">
          Analyze a UPI payment for fraud risk before sending money.
        </p>
      </motion.div>

      <div className="card-surface space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="label-caps">UPI ID</Label>
            <Input
              className="font-mono h-11 bg-secondary/50"
              placeholder="example@upi"
              value={form.upi_id}
              onChange={(e) => update("upi_id", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="label-caps">Amount (₹)</Label>
            <Input
              className="font-mono h-11 bg-secondary/50"
              type="number"
              placeholder="0"
              value={form.amount || ""}
              onChange={(e) => update("amount", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label className="label-caps">Receiver Age (days)</Label>
            <Input
              className="font-mono h-11 bg-secondary/50"
              type="number"
              value={form.receiver_age_days}
              onChange={(e) => update("receiver_age_days", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label className="label-caps">Report Count</Label>
            <Input
              className="font-mono h-11 bg-secondary/50"
              type="number"
              value={form.receiver_report_count}
              onChange={(e) => update("receiver_report_count", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label className="label-caps">Location Risk (0-1)</Label>
            <Input
              className="font-mono h-11 bg-secondary/50"
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={form.location_risk}
              onChange={(e) => update("location_risk", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label className="label-caps">Device Trust (0-1)</Label>
            <Input
              className="font-mono h-11 bg-secondary/50"
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={form.device_trust_score}
              onChange={(e) => update("device_trust_score", Number(e.target.value))}
            />
          </div>
        </div>

        <Button
          onClick={handleCheck}
          disabled={loading || !form.upi_id.trim()}
          className="h-11 px-8 bg-foreground text-background hover:bg-foreground/90"
        >
          {loading ? "Analyzing..." : "Check Payment Risk"}
        </Button>
      </div>

      {loading && <ScanningAnimation />}
      {error && (
        <div className="card-surface border-risk-high/30 text-risk-high text-sm">
          {error}
        </div>
      )}
      {result && <AnalysisResult result={result} upiId={form.upi_id} />}
    </div>
  );
}
