import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { 
  LayoutDashboard, 
  Trees, 
  PlusCircle, 
  FileSpreadsheet, 
  LogOut, 
  MapPin,
  Menu,
  X,
  UserCheck
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../../lib/AuthContext";
import { LogoutConfirmModal } from "./LogoutConfirmModal";

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await signOut();
    navigate("/");
  };

  const navItems = [
    {
      label: "Overview",
      path: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Database Lahan",
      path: "/dashboard/lands",
      icon: Trees,
      exact: false,
    },
    {
      label: "Tambah Lahan",
      path: "/dashboard/add-land",
      icon: PlusCircle,
      exact: false,
    },
    {
      label: "Ekspor Data EUDR",
      path: "/dashboard/export",
      icon: FileSpreadsheet,
      exact: false,
    },
  ];

  const isActive = (path: string, exact: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex relative overflow-x-hidden">
      {/* Background Nature Image Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000&auto=format&fit=crop" 
          alt="Forest Canopy" 
          className="w-full h-full object-cover opacity-40 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-slate-950/75 to-black/90 backdrop-blur-[4px]"></div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-black/70 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div>
          {/* Sidebar Header / Logo */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30 group-hover:scale-105 transition-transform">
                <MapPin className="size-5 text-emerald-400" />
              </div>
              <div>
                <span className="font-bold text-lg text-white font-serif tracking-wide block leading-tight">
                  HijauLog
                </span>
                <span className="text-[10px] text-emerald-400/80 font-mono uppercase tracking-widest block">
                  SaaS Traceability
                </span>
              </div>
            </Link>
            <button 
              className="md:hidden text-white/70 hover:text-white"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                    ${active 
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-950/50 backdrop-blur-md" 
                      : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent"}
                  `}
                >
                  <Icon className={`size-[18px] ${active ? "text-emerald-400" : "text-white/50"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info & Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 mb-3 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <UserCheck className="size-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-white truncate">
                {session?.user?.email || "User Active"}
              </p>
              <p className="text-[10px] text-white/50 font-mono uppercase">EUDR Operator</p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full justify-start text-xs border-rose-500/30 text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 bg-transparent rounded-xl py-2.5"
          >
            <LogOut className="size-4 mr-2 text-rose-400" />
            Keluar Akun
          </Button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-black/40 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:text-white"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu className="size-5" />
            </button>
            <h2 className="text-sm font-medium text-white/60 hidden sm:block font-outfit">
              <span className="text-white/40">Workspace</span>
              <span className="mx-2 text-white/20">/</span>
              <span className="text-white font-semibold">{navItems.find(n => isActive(n.path, n.exact))?.label || "Dashboard"}</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
              EUDR Active
            </span>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Logout Modal */}
      <LogoutConfirmModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
