import { Outlet, Link, useLocation } from "react-router";
import { MapPin, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";

export function Root() {
  const location = useLocation();
  const isDashboard =
    location.pathname.startsWith("/dashboard");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="size-6 text-blue-600" />
            <span className="font-semibold text-lg">
              HijauLog
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {isDashboard ? (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm ${location.pathname === "/dashboard" ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/lands"
                  className={`text-sm ${location.pathname.includes("/lands") || location.pathname.includes("/land/") ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Lahan
                </Link>
                <Link
                  to="/dashboard/export"
                  className={`text-sm ${location.pathname === "/dashboard/export" ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Ekspor
                </Link>
                <Link to="/">
                  <Button variant="outline" size="sm">
                    Keluar
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`text-sm ${location.pathname === "/" ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Tentang Kami
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="sm">
                    <LayoutDashboard className="size-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
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

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>
            © 2026 HijauLog - Sistem Traceability Geo-Tagging. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}