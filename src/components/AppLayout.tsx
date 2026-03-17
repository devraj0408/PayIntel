import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Home, Shield, QrCode, Link2, Globe, BarChart3, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Fraud Check", url: "/fraud-check", icon: Shield },
  { title: "QR Scanner", url: "/scanner", icon: QrCode },
  { title: "Payment Link", url: "/link-check", icon: Link2 },
  { title: "Website Safety", url: "/website-safety", icon: Globe },
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-card/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="relative">
                <Shield className="h-7 w-7 text-risk-high" />
                <div className="absolute inset-0 blur-lg bg-risk-high/20 rounded-full" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold tracking-tight text-foreground">PayIntel</span>
                <span className="block text-[10px] text-muted-foreground tracking-wider uppercase -mt-0.5">
                  Truecaller for Payments
                </span>
              </div>
            </Link>

            {/* Nav Tabs */}
            <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link
                    key={item.url}
                    to={item.url}
                    className={cn(
                      "relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden md:inline">{item.title}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-secondary rounded-lg -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
