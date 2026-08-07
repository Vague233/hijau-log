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
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

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
    <div className="min-h-screen bg-[#050505] text-white font-sans flex relative overflow-x-hidden">
      {/* Background Nature Image Overlay - Neutral Glassmorphism */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000&auto=format&fit=crop" 
          alt="Forest Canopy" 
          className="w-full h-full object-cover opacity-60"
        />
        {/* Pure neutral gradient, no green */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen bg-white/[0.02] backdrop-blur-[40px] border-r border-white/10 flex flex-col justify-between transition-all duration-300 ease-in-out shadow-2xl shadow-black/50
        ${isMobileSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"}
        ${isDesktopSidebarCollapsed ? "md:w-20" : "md:w-64"}
        w-64
      `}>
        <div>
          {/* Sidebar Header / Logo */}
          <div className={`p-6 border-b border-white/5 flex items-center justify-between ${isDesktopSidebarCollapsed ? "md:justify-center md:px-0" : ""}`}>
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2.5 bg-white/10 rounded-xl border border-white/20 group-hover:bg-white/20 transition-all flex-shrink-0">
                <MapPin className="size-5 text-white" />
              </div>
              <div className={`${isDesktopSidebarCollapsed ? "md:hidden block" : "block"}`}>
                <span className="font-bold text-xl text-white font-sans tracking-wide block leading-tight">
                  HijauLog
                </span>
                <span className="text-[10px] text-white/50 font-mono uppercase tracking-[0.15em] block mt-0.5">
                  SaaS Traceability
                </span>
              </div>
            </Link>
            <button 
              className="md:hidden text-white/50 hover:text-white transition-colors flex-shrink-0"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 group
                    ${isDesktopSidebarCollapsed ? "md:justify-center md:px-0" : ""}
                    ${active 
                      ? "bg-white/10 text-white border border-white/20 shadow-lg backdrop-blur-xl" 
                      : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"}
                  `}
                  title={isDesktopSidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={`size-[18px] flex-shrink-0 transition-colors ${active ? "text-white" : "text-white/40 group-hover:text-white/80"}`} />
                  <span className={`font-outfit tracking-wide ${isDesktopSidebarCollapsed ? "md:hidden block" : "block"}`}>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info & Logout */}
        <div className={`p-4 border-t border-white/5 bg-black/20 ${isDesktopSidebarCollapsed ? "md:flex md:flex-col md:items-center" : ""}`}>
          <div className={`p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 mb-3 flex items-center gap-3 ${isDesktopSidebarCollapsed ? "md:justify-center md:p-2" : ""}`}>
            <div className="p-2 bg-white/10 rounded-xl text-white border border-white/5 flex-shrink-0">
              <UserCheck className="size-4" />
            </div>
            <div className={`overflow-hidden ${isDesktopSidebarCollapsed ? "md:hidden block" : "block"}`}>
              <p className="text-xs font-medium text-white truncate font-outfit">
                {session?.user?.email || "User Active"}
              </p>
              <p className="text-[9px] text-white/50 font-mono uppercase tracking-wider mt-0.5">EUDR Operator</p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setIsLogoutModalOpen(true)}
            className={`justify-start text-xs border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all bg-transparent rounded-2xl py-2.5 font-outfit ${isDesktopSidebarCollapsed ? "md:w-10 md:h-10 md:p-0 md:justify-center w-full" : "w-full"}`}
            title={isDesktopSidebarCollapsed ? "Keluar Akun" : undefined}
          >
            <LogOut className={`size-4 ${isDesktopSidebarCollapsed ? "md:mr-0 mr-2" : "mr-2"}`} />
            <span className={`${isDesktopSidebarCollapsed ? "md:hidden block" : "block"}`}>Keluar Akun</span>
          </Button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-white/[0.02] backdrop-blur-[40px] border-b border-white/10 px-4 md:px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu className="size-5" />
            </button>
            
            {/* Desktop Sidebar Toggle Button */}
            <button 
              className="hidden md:block p-2 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:text-white transition-colors"
              onClick={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
            >
              <Menu className="size-5" />
            </button>

            <h2 className="text-sm font-medium text-white/60 hidden sm:block font-outfit tracking-wide ml-2">
              <span className="text-white/30">Workspace</span>
              <span className="mx-2 text-white/10">/</span>
              <span className="text-white/90 drop-shadow-sm">{navItems.find(n => isActive(n.path, n.exact))?.label || "Dashboard"}</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-widest bg-white/10 border border-white/20 text-white shadow-lg backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              EUDR ACTIVE
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
