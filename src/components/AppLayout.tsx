import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/app", label: "Home", icon: "⌂", end: true },
  { to: "/app/workers", label: "Workers", icon: "⚙" },
];

const intelligenceItems = [
  { to: "/app/judge", label: "Judge", icon: "⚖️" },
  { to: "/app/proof", label: "Proof", icon: "📊" },
  { to: "/app/safety", label: "Safety", icon: "🛡️" },
];

const AppLayout = () => {
  const [intelOpen, setIntelOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-border flex flex-col">
        <div className="p-5 border-b border-border">
          <button onClick={() => navigate("/app")} className="text-left">
            <h1 className="text-sm font-semibold tracking-tight">InstantWorker</h1>
            <p className="text-xs text-muted-foreground">AI workers that learn</p>
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          <button
            onClick={() => setIntelOpen(!intelOpen)}
            className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-card/50 transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <span className="text-base">🧠</span>
              Intelligence
            </span>
            <span className={`text-xs transition-transform ${intelOpen ? "rotate-90" : ""}`}>›</span>
          </button>
          {intelOpen && (
            <div className="ml-5 space-y-0.5">
              {intelligenceItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                      isActive ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`
                  }
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}

          <NavLink
            to="/app/settings"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              }`
            }
          >
            <span className="text-base">⚙</span>
            Settings
          </NavLink>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-medium">A</div>
            <div>
              <p className="text-xs font-medium">Alex Chen</p>
              <p className="text-xs text-primary">Growth Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
