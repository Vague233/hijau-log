import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { MapPin, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../../lib/AuthContext";
import { useState, useEffect } from "react";
import { LogoutConfirmModal } from "./LogoutConfirmModal";

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const isDashboard =
    location.pathname.startsWith("/dashboard");

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await signOut();
    navigate("/");
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLandDetail = Boolean(location.pathname.match(/^\/dashboard\/land\/[^/]+$/));

  const headerClass = isLandDetail
    ? `fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl rounded-full px-6 py-4 flex items-center justify-between transition-all duration-500 ${
        isScrolled 
          ? "bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]" 
          : "bg-transparent border border-transparent text-white"
      }`
    : "fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl rounded-full px-6 py-4 flex items-center justify-between border border-white/20 bg-white/40 backdrop-blur-md shadow-lg text-[var(--color-moss)]";

  const mapPinClass = isLandDetail 
    ? "size-6 text-white transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5"
    : "size-6 text-[var(--color-moss)] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5";

  const titleClass = isLandDetail
    ? "font-semibold text-lg text-white transition-colors duration-300 group-hover:text-emerald-400"
    : "font-semibold text-lg text-[var(--color-charcoal)] transition-colors duration-300 group-hover:text-[var(--color-moss)]";

  const actionBtnClass = isLandDetail
    ? "rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all"
    : "rounded-full bg-white/50 border-white/30 hover:bg-white text-[var(--color-charcoal)]";

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation Header */}
      {location.pathname !== "/" && location.pathname !== "/access" && location.pathname !== "/dashboard" && (
        <header className={headerClass}>
          <div className="group flex items-center gap-2 transition-all duration-300">
            <MapPin className={mapPinClass} />
            <span className={titleClass}>
              HijauLog
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isDashboard ? (
              isLandDetail ? (
                <Link to="/database" state={{ view: 'list' }}>
                  <Button variant="outline" size="sm" className={actionBtnClass}>
                    Kembali
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsLogoutModalOpen(true)} className={actionBtnClass}>
                  Keluar
                </Button>
              )
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
      <main className="flex-1 bg-noise">
        <Outlet />
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

      <LogoutConfirmModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}