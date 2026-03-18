import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.png";
import StrategistPanel from "@/components/strategist/StrategistPanel";
import { LayoutDashboard, Users, Brain, Shield, BookCheck, Settings, ClipboardList } from "lucide-react";

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
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-foreground hover:bg-card/60"
    }`;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar — 200px */}
      <aside className="w-[200px] shrink-0 border-r border-border bg-sidebar flex flex-col">
        {/* Brand */}
        <div className="p-4 border-b border-border">
          <button onClick={() => navigate("/app")} className="text-left flex items-center gap-2">
            <img src={logoIcon} alt="InstantWorker" className="w-6 h-6 invert" />
            <div>
              <h1 className="text-sm font-bold tracking-tight leading-none">
                Instant<span className="text-primary">Worker</span>
              </h1>
            </div>
          </button>
          <p className="text-[10px] text-muted-foreground mt-1 leading-snug">The demand for more customers is infinite.</p>
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
              <item.icon className="w-4 h-4" />
              {item.label}
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
                <NavLink key={item.to} to={item.to} className={navLinkClass}>
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}

          <NavLink to="/app/settings" className={navLinkClass}>
            <Settings className="w-4 h-4" />
            Settings
          </NavLink>
        </nav>

        {/* User */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/15 flex items-center justify-center text-xs text-primary font-semibold">
              L
            </div>
            <div>
              <p className="text-xs font-medium leading-none">Luka Knezic</p>
              <p className="text-[10px] text-primary mt-0.5 font-medium uppercase tracking-wider">Growth Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-background">
        <Outlet />
      </main>

      {/* Strategist Panel — always visible */}
      <StrategistPanel tier={2} />
    </div>
  );
};

export default AppLayout;
