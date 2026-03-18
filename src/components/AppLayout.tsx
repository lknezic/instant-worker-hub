import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.png";
import StrategistPanel from "@/components/strategist/StrategistPanel";
import NotificationBell from "@/components/NotificationBell";
import { LayoutDashboard, Users, Brain, Shield, BookCheck, Settings, ClipboardList, Check, Sun, Moon, Menu, X, Clock } from "lucide-react";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { insights } from "@/lib/api";

const navItems = [
  { to: "/app", label: "Today", icon: ClipboardList, end: true },
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/workers", label: "Workers", icon: Users },
];

const intelligenceItems = [
  { to: "/app/judge", label: "Judge", icon: Brain },
  { to: "/app/proof", label: "Proof", icon: BookCheck },
  { to: "/app/safety", label: "Safety", icon: Shield },
];

const AppLayout = () => {
  const [intelOpen, setIntelOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { todayComplete } = useWorkflow();
  const isMobile = useIsMobile();

  const [timeSaved, setTimeSaved] = useState<string | null>(null);

  useEffect(() => {
    insights.timeSaved()
      .then((d) => setTimeSaved(d.human_readable))
      .catch(() => setTimeSaved("47.2 hours saved"));
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("light-mode");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-foreground hover:bg-card/60"
    }`;

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <button onClick={() => { navigate("/app"); setMobileMenuOpen(false); }} className="text-left flex items-center gap-2">
            <img src={logoIcon} alt="InstantWorker" className="w-6 h-6 invert" />
            <div>
              <h1 className="text-sm font-bold tracking-tight leading-none">
                Instant<span className="text-primary">Worker</span>
              </h1>
            </div>
          </button>
          <div className="flex items-center gap-1">
            <NotificationBell />
            {isMobile && (
              <button onClick={() => setMobileMenuOpen(false)} className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1 leading-snug">The demand for more customers is infinite.</p>
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
            <item.icon className="w-4 h-4" />
            <span className="flex-1">{item.label}</span>
            {item.label === "Today" && todayComplete && (
              <span className="w-4 h-4 rounded-full bg-success/20 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-success" />
              </span>
            )}
          </NavLink>
        ))}

        <button
          onClick={() => setIntelOpen(!intelOpen)}
          className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card/60 transition-all"
        >
          <span className="flex items-center gap-2.5">
            <Brain className="w-4 h-4" />
            Intelligence
          </span>
          <span className={`text-xs transition-transform duration-150 ${intelOpen ? "rotate-90" : ""}`}>›</span>
        </button>
        {intelOpen && (
          <div className="ml-3 space-y-0.5 border-l border-border pl-2">
            {intelligenceItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        <NavLink to="/app/settings" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
          <Settings className="w-4 h-4" />
          Settings
        </NavLink>
      </nav>

      {/* Time Saved */}
      {timeSaved && (
        <div className="px-3 py-2 mx-3 mb-2 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            <Clock className="w-3 h-3 text-primary" />
            Time Saved
          </div>
          <div className="text-sm font-bold text-primary mt-0.5">{timeSaved}</div>
        </div>
      )}

      {/* User + Theme toggle */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary/15 flex items-center justify-center text-xs text-primary font-semibold">
            L
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium leading-none">Luka Knezic</p>
            <p className="text-[10px] text-primary mt-0.5 font-medium uppercase tracking-wider">Growth Plan</p>
          </div>
          <button onClick={toggleTheme} className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card/60 transition-all">
            {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile hamburger */}
      {isMobile && !mobileMenuOpen && (
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="fixed top-3 left-3 z-50 w-9 h-9 rounded-lg glass-card flex items-center justify-center text-foreground"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar — desktop: always visible, mobile: overlay */}
      {isMobile ? (
        mobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={() => setMobileMenuOpen(false)} />
            <aside className="fixed left-0 top-0 bottom-0 w-[240px] z-50 border-r border-border bg-sidebar flex flex-col animate-slide-in-right" style={{ animationName: "slide-in-left" }}>
              {sidebarContent}
            </aside>
          </>
        )
      ) : (
        <aside className="w-[200px] shrink-0 border-r border-border bg-sidebar flex flex-col">
          {sidebarContent}
        </aside>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-background">
        <Outlet />
      </main>

      {/* Strategist Panel — always visible on desktop */}
      {!isMobile && <StrategistPanel tier={2} />}
    </div>
  );
};

export default AppLayout;
