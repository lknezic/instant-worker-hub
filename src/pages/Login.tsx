import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <img src={logoIcon} alt="InstantWorker" className="w-10 h-10 mx-auto mb-4 invert" />
          <h1 className="text-2xl font-bold tracking-tight">
            Instant<span className="text-primary">Worker</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Your AI marketing team
          </p>
        </div>

        <div className="glass-card-strong rounded-xl p-6">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-background/50 border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 placeholder:text-muted-foreground transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-semibold text-sm rounded-lg py-2.5 hover:opacity-90 transition-all"
              >
                Send Magic Link
              </button>
            </form>
          ) : (
            <div className="text-center py-6 animate-scale-in">
              <p className="text-2xl mb-2">✉️</p>
              <p className="font-semibold">Check your email</p>
              <p className="text-sm text-muted-foreground mt-1">We sent a login link to <span className="text-foreground">{email}</span></p>
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-border/50">
            <button
              onClick={() => navigate("/app")}
              className="w-full border border-border/60 text-muted-foreground text-sm rounded-lg py-2 hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              Dev Login →
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-5">
          Don't have an account?{" "}
          <button onClick={() => navigate("/pricing")} className="text-primary hover:underline font-medium">
            View pricing →
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
