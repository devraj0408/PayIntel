import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  QrCode,
  Shield,
  Link2,
  Globe,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Github,
  Zap,
  BrainCircuit,
  MousePointerClick,
  ShieldAlert,
  Upload,
  FileSearch,
  Cpu,
  Activity,
  Bell,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    icon: QrCode,
    title: "QR Scanner",
    desc: "Upload QR code image and analyze payment safety",
    to: "/scanner",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
    glowColor: "group-hover:shadow-blue-500/10",
  },
  {
    icon: Shield,
    title: "Fraud Check",
    desc: "Enter transaction details and get instant fraud prediction",
    to: "/fraud-check",
    gradient: "from-red-500/20 to-orange-500/20",
    iconColor: "text-risk-high",
    glowColor: "group-hover:shadow-red-500/10",
  },
  {
    icon: Link2,
    title: "Payment Link Checker",
    desc: "Input payment URL to detect phishing or fraud links",
    to: "/link-check",
    gradient: "from-amber-500/20 to-yellow-500/20",
    iconColor: "text-risk-medium",
    glowColor: "group-hover:shadow-amber-500/10",
  },
  {
    icon: Globe,
    title: "Website Safety",
    desc: "Enter website URL and check if it's malicious",
    to: "/website-safety",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400",
    glowColor: "group-hover:shadow-purple-500/10",
  },
  {
    icon: BarChart3,
    title: "Dashboard",
    desc: "View real-time analytics, reports, and fraud trends",
    to: "/dashboard",
    gradient: "from-emerald-500/20 to-green-500/20",
    iconColor: "text-risk-low",
    glowColor: "group-hover:shadow-emerald-500/10",
  },
];

const steps = [
  { icon: Upload, label: "Upload QR Code" },
  { icon: FileSearch, label: "Extract Payment Data" },
  { icon: Cpu, label: "AI Model Analysis" },
  { icon: Activity, label: "Risk Score Generation" },
  { icon: Bell, label: "Fraud Alert Display" },
];

const whyUs = [
  { icon: Zap, text: "Real-time fraud detection" },
  { icon: BrainCircuit, text: "AI + Quantum powered analysis" },
  { icon: MousePointerClick, text: "Easy to use interface" },
  { icon: ShieldAlert, text: "Prevent financial scams" },
  { icon: ShieldCheck, text: "Smart risk alerts" },
];

export default function Homepage() {
  return (
    <div className="space-y-24 pb-16">
      {/* ───── Hero ───── */}
      <section className="relative pt-8 sm:pt-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-risk-high/5 blur-[120px] pointer-events-none" />

        <div className="relative text-center max-w-3xl mx-auto space-y-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-risk-low bg-risk-low/10 border border-risk-low/20 rounded-full px-4 py-1.5"
          >
            <ShieldCheck className="h-3.5 w-3.5" /> AI-Powered Security
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-foreground"
          >
            Scan Before{" "}
            <span className="bg-gradient-to-r from-risk-low via-blue-400 to-purple-400 bg-clip-text text-transparent">
              You Pay
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
          >
            AI-powered fraud detection system for secure digital payments.
            Analyze QR codes and transactions in real-time to prevent fraud before it happens.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 pt-2"
          >
            <Button
              asChild
              size="lg"
              className="h-12 px-7 bg-gradient-to-r from-risk-low to-emerald-600 hover:brightness-110 text-white border-0 shadow-lg shadow-risk-low/20"
            >
              <Link to="/scanner">
                <QrCode className="h-4 w-4 mr-2" /> Scan QR Code
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-7 border-border hover:bg-secondary"
            >
              <Link to="/dashboard">
                <BarChart3 className="h-4 w-4 mr-2" /> View Dashboard
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ───── Feature Cards ───── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div variants={fadeUp} className="text-center mb-12">
          <span className="label-caps text-muted-foreground">Core Features</span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3 text-foreground">
            Everything You Need to Stay Safe
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeUp}>
              <Link
                to={f.to}
                className={`group relative block overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${f.glowColor}`}
              >
                <div
                  className={`absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl bg-gradient-to-br ${f.gradient}`}
                />
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${f.gradient}`}
                  >
                    <f.icon className={`h-5 w-5 ${f.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1.5 flex items-center gap-2">
                    {f.title}
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-muted-foreground" />
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ───── How It Works ───── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div variants={fadeUp} className="text-center mb-12">
          <span className="label-caps text-muted-foreground">How It Works</span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3 text-foreground">
            From Upload to Alert in Seconds
          </h2>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2">
          {steps.map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} className="flex items-center gap-2 sm:gap-3">
              <div className="flex flex-col items-center gap-2 min-w-[100px]">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center border border-border group hover:border-risk-low/40 transition-colors">
                  <s.icon className="h-6 w-6 text-muted-foreground group-hover:text-risk-low transition-colors" />
                </div>
                <span className="text-xs text-muted-foreground text-center font-medium leading-tight">
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 hidden sm:block shrink-0" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ───── Why Choose Us ───── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div variants={fadeUp} className="text-center mb-12">
          <span className="label-caps text-muted-foreground">Why PayIntel</span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3 text-foreground">
            Built for Security, Designed for Speed
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {whyUs.map((w) => (
            <motion.div
              key={w.text}
              variants={fadeUp}
              className="flex items-center gap-3 rounded-xl border border-border bg-card/40 backdrop-blur-sm px-5 py-4"
            >
              <w.icon className="h-5 w-5 text-risk-low shrink-0" />
              <span className="text-sm text-foreground font-medium">{w.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ───── Live Demo Preview ───── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div variants={fadeUp} className="text-center mb-10">
          <span className="label-caps text-muted-foreground">Live Preview</span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3 text-foreground">See It in Action</h2>
        </motion.div>

        <motion.div variants={fadeUp} className="max-w-md mx-auto">
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="label-caps">Analysis Result</span>
              <span className="risk-badge-medium !text-[10px]">Suspicious</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Merchant</span>
                <span className="font-mono text-foreground">xyz@upi</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Risk Score</span>
                <span className="font-mono font-bold text-risk-medium">78%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="font-mono text-risk-medium">Suspicious</span>
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-risk-medium to-risk-high"
                initial={{ width: 0 }}
                whileInView={{ width: "78%" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                viewport={{ once: true }}
              />
            </div>
            <Button
              asChild
              className="w-full h-10 bg-gradient-to-r from-risk-low to-emerald-600 hover:brightness-110 text-white border-0"
            >
              <Link to="/fraud-check">
                Try Fraud Check <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </motion.section>

      {/* ───── Footer ───── */}
      <footer className="border-t border-border pt-10 mt-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-risk-low" />
            <span className="font-bold text-foreground">PayIntel</span>
            <span className="text-xs">— Truecaller for Payments</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              About
            </Link>
            <a href="mailto:contact@payintel.ai" className="hover:text-foreground transition-colors">
              Contact
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          </div>
          <span className="text-xs text-muted-foreground/60">Built for Hackathon 🚀</span>
        </div>
      </footer>
    </div>
  );
}
