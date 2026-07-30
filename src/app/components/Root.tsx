import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { MapPin, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../../lib/AuthContext";
import { useEffect, useState } from "react";

function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = window.getComputedStyle(target).cursor === 'pointer' || target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button';
      setIsHovering(isClickable);
    };

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mouseover", updateHoverState);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mouseover", updateHoverState);
    };
  }, []);

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-3 h-3 bg-[var(--color-clay)] rounded-full pointer-events-none z-[9999] transition-transform duration-75 ease-out mix-blend-difference"
        style={{ transform: `translate3d(${position.x - 6}px, ${position.y - 6}px, 0) scale(${isHovering ? 0 : 1})` }}
      />
      <div 
        className="fixed top-0 left-0 w-8 h-8 border-2 border-[var(--color-clay)] rounded-full pointer-events-none z-[9998] transition-transform duration-300 ease-out mix-blend-difference"
        style={{ transform: `translate3d(${position.x - 16}px, ${position.y - 16}px, 0) scale(${isHovering ? 1.5 : 1})` }}
      />
    </>
  );
}

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
    <div className="min-h-screen flex flex-col font-sans cursor-none">
      <CustomCursor />
      {/* Navigation Header */}
      {location.pathname !== "/" && (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl rounded-full px-6 py-4 flex items-center justify-between border border-white/20 bg-white/40 backdrop-blur-md shadow-lg text-[var(--color-moss)]">
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="size-6 text-[var(--color-moss)]" />
            <span className="font-semibold text-lg text-[var(--color-charcoal)]">
              HijauLog
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {isDashboard ? (
              <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full bg-white/50 border-white/30 hover:bg-white text-[var(--color-charcoal)]">
                Keluar
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="rounded-full bg-white/50 border-white/30 hover:bg-white text-[var(--color-charcoal)]">
                    Masuk
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="rounded-full">Daftar</Button>
                </Link>
              </>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 bg-noise ${location.pathname !== "/" ? "pt-24" : ""}`}>
        <Outlet />
      </main>

      {/* Footer */}
      {location.pathname !== "/" && (
        <footer className="border-t bg-[var(--color-cream)] py-8">
          <div className="container mx-auto px-4 text-center text-sm text-[var(--color-charcoal)]">
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