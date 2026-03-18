import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/app", label: "Home", end: true },
  { to: "/app/workers", label: "Workers" },
];

const intelligenceItems = [
  { to: "/app/judge", label: "Judge" },
  { to: "/app/proof", label: "Proof" },
  { to: "/app/safety", label: "Safety" },
];

const AppLayout = () => {
  const [intelOpen, setIntelOpen] = useState(false);
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "bg-primary/10 text-primary border border-primary/10"
        : "text-muted-foreground hover:text-foreground hover:bg-card/60"
    }`;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-border bg-sidebar flex flex-col">
        {/* Brand */}
        <div className="p-5 border-b border-border">
          <button onClick={() => navigate("/app")} className="text-left flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-display font-bold text-xs">IW</span>
            </div>
            <div>
              <h1 className="font-display text-sm font-semibold tracking-tight leading-none">
                Instant<span className="text-primary">Worker</span>
              </h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">one click to employ AI</p>
            </div>
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}

          <button
            onClick={() => setIntelOpen(!intelOpen)}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card/60 transition-all"
          >
            <span>Intelligence</span>
            <span className={`text-xs transition-transform duration-150 ${intelOpen ? "rotate-90" : ""}`}>›</span>
          </button>
          {intelOpen && (
            <div className="ml-3 space-y-0.5 border-l border-border pl-3">
              {intelligenceItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={navLinkClass}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}

          <NavLink to="/app/settings" className={navLinkClass}>
            Settings
          </NavLink>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary/15 flex items-center justify-center text-xs text-primary font-display font-semibold">
              A
            </div>
            <div>
              <p className="text-xs font-medium leading-none">Alex Chen</p>
              <p className="text-[10px] text-primary mt-0.5 font-medium">Growth Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
