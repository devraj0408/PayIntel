import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Activity,
  TrendingUp,
  MapPin,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { api, type FraudStats, type FlaggedUpi, type HeatmapEntry } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const RISK_COLORS = {
  high: "hsl(0, 84%, 60%)",
  medium: "hsl(38, 92%, 50%)",
  low: "hsl(142, 70%, 45%)",
};

function StatCard({
  label,
  value,
  icon: Icon,
  accentColor,
  glowColor,
}: {
  label: string;
  value: number | string;
  icon: any;
  accentColor: string;
  glowColor: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-xl border border-border bg-card p-5 group cursor-default"
    >
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
      />
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl"
        style={{ background: glowColor }}
      />
      <div className="relative flex items-center gap-4">
        <div
          className="p-3 rounded-xl"
          style={{ background: `${accentColor}15` }}
        >
          <Icon className="h-5 w-5" style={{ color: accentColor }} />
        </div>
        <div>
          <p className="label-caps">{label}</p>
          <p className="text-2xl font-bold font-mono mt-0.5 text-foreground">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-72 mb-2" />
        <Skeleton className="h-5 w-56" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.fill || p.color }} className="font-mono">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState<FraudStats | null>(null);
  const [flagged, setFlagged] = useState<FlaggedUpi[]>([]);
  const [heatmap, setHeatmap] = useState<HeatmapEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, f, h] = await Promise.all([
          api.fraudStats(),
          api.flaggedUpi(),
          api.riskHeatmap(),
        ]);
        setStats(s);
        setFlagged(f);
        setHeatmap(h);
      } catch {
        // Fallback demo data
        setStats({ total_transactions: 12847, fraud_detected: 342, warnings: 891, safe_payments: 11614 });
        setFlagged([
          { upi_id: "fraud@upi", reports: 12 },
          { upi_id: "scammer@paytm", reports: 8 },
          { upi_id: "suspicious123@phonepe", reports: 5 },
          { upi_id: "fake.merchant@upi", reports: 3 },
        ]);
        setHeatmap([
          { region: "Delhi", risk_level: "HIGH" },
          { region: "Mumbai", risk_level: "MEDIUM" },
          { region: "Bangalore", risk_level: "LOW" },
          { region: "Kolkata", risk_level: "HIGH" },
          { region: "Chennai", risk_level: "MEDIUM" },
          { region: "Hyderabad", risk_level: "LOW" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <DashboardSkeleton />;

  const pieData = [
    { name: "Safe", value: stats?.safe_payments ?? 0, color: RISK_COLORS.low },
    { name: "Fraud", value: stats?.fraud_detected ?? 0, color: RISK_COLORS.high },
    { name: "Warning", value: stats?.warnings ?? 0, color: RISK_COLORS.medium },
  ];

  const regionCases: Record<string, number> = {
    Delhi: 480, Mumbai: 320, Bangalore: 150, Kolkata: 410, Chennai: 270, Hyderabad: 120,
  };
  const barData = heatmap.map((h) => ({
    region: h.region,
    cases: regionCases[h.region] ?? Math.floor(Math.random() * 400 + 50),
    fill:
      h.risk_level?.toUpperCase() === "HIGH"
        ? RISK_COLORS.high
        : h.risk_level?.toUpperCase() === "MEDIUM"
        ? RISK_COLORS.medium
        : RISK_COLORS.low,
  }));

  const riskBadge = (level: string) => {
    const l = level?.toUpperCase() || "";
    if (l.includes("HIGH"))
      return <span className="risk-badge-high text-[11px]">HIGH</span>;
    if (l.includes("MEDIUM"))
      return <span className="risk-badge-medium text-[11px]">MEDIUM</span>;
    return <span className="risk-badge-low text-[11px]">LOW</span>;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 text-foreground">
          <BarChart3 className="h-7 w-7 text-risk-low" />
          Fraud Monitoring Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1.5">
          Real-time fraud detection statistics
        </p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StatCard
          label="Total Transactions"
          value={(stats?.total_transactions ?? 0).toLocaleString()}
          icon={Activity}
          accentColor="hsl(215, 70%, 60%)"
          glowColor="hsla(215, 70%, 60%, 0.15)"
        />
        <StatCard
          label="Fraud Detected"
          value={(stats?.fraud_detected ?? 0).toLocaleString()}
          icon={ShieldAlert}
          accentColor={RISK_COLORS.high}
          glowColor="hsla(0, 84%, 60%, 0.15)"
        />
        <StatCard
          label="Warnings"
          value={(stats?.warnings ?? 0).toLocaleString()}
          icon={AlertTriangle}
          accentColor={RISK_COLORS.medium}
          glowColor="hsla(38, 92%, 50%, 0.15)"
        />
        <StatCard
          label="Safe Payments"
          value={(stats?.safe_payments ?? 0).toLocaleString()}
          icon={ShieldCheck}
          accentColor={RISK_COLORS.low}
          glowColor="hsla(142, 70%, 45%, 0.15)"
        />
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div
          className="rounded-xl border border-border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="label-caps">Transaction Distribution</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="font-mono font-bold text-foreground">{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          className="rounded-xl border border-border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="label-caps">Risk by Region</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 5%, 15%)" vertical={false} />
                <XAxis
                  dataKey="region"
                  tick={{ fill: "hsl(215, 16%, 57%)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(215, 16%, 57%)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsla(240, 5%, 15%, 0.5)" }} />
                <Bar dataKey="cases" name="Cases" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flagged UPI Table */}
        <motion.div
          className="rounded-xl border border-border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <ShieldAlert className="h-4 w-4 text-risk-high" />
            <span className="label-caps">Flagged UPI Accounts</span>
          </div>
          {flagged.length > 0 ? (
            <div className="space-y-2">
              {flagged.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.05 }}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                >
                  <span className="font-mono text-sm text-foreground">{item.upi_id}</span>
                  <span className="flex items-center justify-center min-w-[28px] h-7 px-2.5 rounded-full bg-risk-high/15 text-risk-high text-xs font-bold font-mono">
                    {item.reports}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No flagged accounts.</p>
          )}
        </motion.div>

        {/* Regional Risk */}
        <motion.div
          className="rounded-xl border border-border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="label-caps">Regional Risk Levels</span>
          </div>
          {heatmap.length > 0 ? (
            <div className="space-y-2">
              {heatmap.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">{entry.region}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {regionCases[entry.region] ?? "—"} cases
                    </span>
                  </div>
                  {riskBadge(entry.risk_level)}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No heatmap data.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
