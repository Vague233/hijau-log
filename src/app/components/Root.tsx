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
        <header className="border-b bg-white sticky top-0 z-50">
          <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <MapPin className="size-6 text-[var(--color-moss)]" />
              <span className="font-semibold text-lg text-[var(--color-charcoal)]">
                HijauLog
              </span>
            </Link>

            <div className="flex items-center gap-4">
              {isDashboard ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`text-sm ${location.pathname === "/dashboard" ? "text-[var(--color-clay)] font-medium" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/lands"
                    className={`text-sm ${location.pathname.includes("/lands") || location.pathname.includes("/land/") ? "text-[var(--color-clay)] font-medium" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    Lahan
                  </Link>
                  <Link
                    to="/dashboard/export"
                    className={`text-sm ${location.pathname === "/dashboard/export" ? "text-[var(--color-clay)] font-medium" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    Ekspor
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Keluar
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Masuk
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Daftar</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 bg-noise">
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