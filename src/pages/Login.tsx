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
    <div className="min-h-screen flex items-center justify-center px-4 bg-grid bg-radial-top relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <img src={logoIcon} alt="InstantWorker" className="w-12 h-12 mx-auto mb-4 invert" />
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Instant<span className="text-primary">Worker</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-xs mx-auto">
            One click to employ AI. Your marketing team is ready.
          </p>
        </div>

        <div className="glass-card-strong rounded-xl p-6 gradient-border">
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
                className="w-full bg-primary text-primary-foreground font-display font-semibold text-sm rounded-lg py-2.5 btn-glow hover:opacity-90 transition-all"
              >
                Send Magic Link
              </button>
            </form>
          ) : (
            <div className="text-center py-6 animate-scale-in">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-primary text-xl">✉</span>
              </div>
              <p className="font-display font-semibold">Check your email</p>
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
            View pricing
          </button>
        </p>

        <p className="text-center text-xs text-muted-foreground/60 mt-8">
          No training needed · Works instantly · Your AI team, ready to go
        </p>
      </div>
    </div>
  );
};

export default Login;
