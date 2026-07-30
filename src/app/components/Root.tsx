import { Outlet, Link, useLocation, useNavigate } from "react-router";
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

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation Header */}
      {location.pathname !== "/" && location.pathname !== "/access" && (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl rounded-full px-6 py-4 flex items-center justify-between border border-white/20 bg-white/40 backdrop-blur-md shadow-lg text-[var(--color-moss)]">
          <Link to="/" className="group flex items-center gap-2 transition-all duration-300 hover:opacity-90">
            <MapPin className="size-6 text-[var(--color-moss)] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5" />
            <span className="font-semibold text-lg text-[var(--color-charcoal)] transition-colors duration-300 group-hover:text-[var(--color-moss)]">
              HijauLog
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {isDashboard ? (
              <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full bg-white/50 border-white/30 hover:bg-white text-[var(--color-charcoal)]">
                Keluar
              </Button>
            ) : (
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
      {location.pathname !== "/" && location.pathname !== "/access" && (
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