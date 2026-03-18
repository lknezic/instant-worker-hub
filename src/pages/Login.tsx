import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.png";
import { Check } from "lucide-react";
import { auth as authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    setSending(true);
    try {
      await authApi.sendMagicLink(email);
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send magic link");
    } finally {
      setSending(false);
    }
  };

  const handleDevLogin = async () => {
    try {
      const res = await authApi.verify("dev@instantworker.com", "dev-token");
      if (res.ok && res.access_token) {
        login(res.access_token, res.user);
        navigate("/app");
        return;
      }
    } catch {
      // Backend not running — fall through to navigate without token
    }
    navigate("/app");
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
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-primary text-primary-foreground font-semibold text-sm rounded-lg py-2.5 hover:opacity-90 transition-all disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Magic Link"}
              </button>
            </form>
          ) : (
            <div className="text-center py-6 animate-scale-in">
              <div className="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-3 pulse-ring">
                <Check className="w-7 h-7 text-success" />
              </div>
              <p className="font-semibold">Check your email for a login link</p>
              <p className="text-sm text-muted-foreground mt-1">We sent it to <span className="text-foreground">{email}</span></p>
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-border/50">
            <button
              onClick={handleDevLogin}
              className="w-full border border-border/60 text-muted-foreground text-sm rounded-lg py-2 hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              Dev Login
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground mt-5 space-x-4">
          <span>
            Don't have an account?{" "}
            <button onClick={() => navigate("/onboarding")} className="text-primary hover:underline font-medium">
              Start free trial
            </button>
          </span>
          <span>·</span>
          <button onClick={() => navigate("/pricing")} className="text-primary hover:underline font-medium">
            View pricing
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
