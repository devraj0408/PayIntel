import { motion } from "framer-motion";

export function ScanningAnimation() {
  return (
    <div className="card-surface relative overflow-hidden h-32 flex items-center justify-center">
      <div className="scan-line" />
      <div className="flex flex-col items-center gap-2 z-10">
        <motion.div
          className="h-1 w-16 bg-foreground/20 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-foreground rounded-full"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            style={{ width: "50%" }}
          />
        </motion.div>
        <span className="label-caps">Analyzing Payment Data</span>
      </div>
    </div>
  );
}
