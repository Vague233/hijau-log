import { Outlet, Link, useLocation, useNavigate, useOutlet } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../../lib/AuthContext";

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const isDashboard =
    location.pathname.startsWith("/dashboard");

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };
  
  // Clone the outlet so AnimatePresence can preserve it on exit
  const currentOutlet = useOutlet();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation Header */}
      {location.pathname !== "/" && location.pathname !== "/access" && location.pathname !== "/dashboard" && (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl rounded-full px-6 py-4 flex items-center justify-between border border-white/20 bg-white/40 backdrop-blur-md shadow-lg text-[var(--color-moss)]">
          <div className="group flex items-center gap-2 transition-all duration-300">
            <MapPin className="size-6 text-[var(--color-moss)] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5" />
            <span className="font-semibold text-lg text-[var(--color-charcoal)] transition-colors duration-300 group-hover:text-[var(--color-moss)]">
              HijauLog
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isDashboard ? (
              <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full bg-white/50 border-white/30 hover:bg-white text-[var(--color-charcoal)]">
                Keluar
              </Button>
            ) : location.pathname !== "/about" && location.pathname !== "/privacy" && (
              <Link to="/access">
                <Button size="sm" className="rounded-full bg-[var(--color-moss)] hover:bg-[var(--color-charcoal)] transition-colors">
                  {location.pathname === "/login" || location.pathname === "/register" ? "Kembali" : "Akses Sistem"}
                </Button>
              </Link>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 bg-noise relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, filter: "blur(8px)", scale: 0.98 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, filter: "blur(8px)", scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full"
          >
            {currentOutlet}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      {location.pathname !== "/" && location.pathname !== "/access" && location.pathname !== "/dashboard" && (
        <footer className="border-t border-white/10 bg-[var(--color-charcoal)] py-8">
          <div className="container mx-auto px-4 text-center text-sm font-mono text-[var(--color-cream)]/40">
            <p>
              © 2026 HijauLog - Sistem Traceability Geo-Tagging. All
              rights reserved.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}