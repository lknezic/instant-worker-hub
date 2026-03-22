import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.png";
import { Check, Loader2 } from "lucide-react";
import { auth as authApi, setToken } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isProduction = () => {
  const host = window.location.hostname;
  return host !== "localhost" && !host.startsWith("127.0.0.1") && !host.startsWith("192.168.");
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const planFromUrl = searchParams.get("plan");
  const showDevLogin = !isProduction() || searchParams.get("dev") === "true";

  const validateEmail = (value: string): boolean => {
    if (!value) {
      setEmailError("Email is required");
      return false;
    }
    if (!EMAIL_REGEX.test(value)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
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

  const handleResend = async () => {
    setResending(true);
    try {
      await authApi.sendMagicLink(email);
    } catch {
      // Silently fail — user can try again
    } finally {
      setResending(false);
    }
  };

  const handleDevLogin = async () => {
    setSending(true);
    try {
      const res = await authApi.verify("dev@instantworker.com", "dev-token");
      if (res.ok && res.access_token) {
        login(res.access_token, res.user);
        navigate("/app");
        return;
      }
      setError("Dev login failed — backend may not be in dev mode");
    } catch {
      // Verify failed — try dev mode bypass
      setToken("dev-mode-token");
      window.location.href = "/app";
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <img src={logoIcon} alt="InstantWorker" className="w-10 h-10 mx-auto mb-4 invert" />
          <h1 className="text-2xl font-bold tracking-tight">
            Instant<span className="text-primary">Worker</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            AI agents that write, post, and optimize your content — automatically
          </p>
        </div>

        {planFromUrl && (
          <div className="text-center mb-4">
            <span className="inline-block text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
              Selected plan: {planFromUrl.charAt(0).toUpperCase() + planFromUrl.slice(1)}
            </span>
          </div>
        )}

        <div className="glass-card-strong rounded-xl p-6">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                  }}
                  onBlur={() => { if (email) validateEmail(email); }}
                  placeholder="you@company.com"
                  className={`w-full bg-background/50 border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 placeholder:text-muted-foreground transition-all ${
                    emailError ? "border-destructive" : "border-border"
                  }`}
                  required
                />
                {emailError && <p className="text-xs text-destructive mt-1">{emailError}</p>}
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-primary text-primary-foreground font-semibold text-sm rounded-lg py-2.5 hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Magic Link"
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-6 animate-scale-in">
              <div className="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-3 pulse-ring">
                <Check className="w-7 h-7 text-success" />
              </div>
              <p className="font-semibold">Check your email for a login link</p>
              <p className="text-sm text-muted-foreground mt-1">We sent it to <span className="text-foreground">{email}</span></p>
              <p className="text-xs text-muted-foreground mt-2">Link expires in 15 minutes</p>

              <div className="mt-4 flex flex-col items-center gap-2">
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-sm text-primary hover:underline font-medium disabled:opacity-50 flex items-center gap-1.5"
                >
                  {resending ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    "Resend link"
                  )}
                </button>
                <button
                  onClick={() => { setSent(false); setEmail(""); setError(""); }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Use a different email
                </button>
              </div>
            </div>
          )}

          {showDevLogin && (
            <div className="mt-5 pt-4 border-t border-border/50">
              <button
                onClick={handleDevLogin}
                disabled={sending}
                className="w-full border border-border/60 text-muted-foreground text-sm rounded-lg py-2 hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all disabled:opacity-50"
              >
                Dev Login
              </button>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-muted-foreground mt-5 space-x-4">
          <span>
            Don't have an account?{" "}
            <button onClick={() => navigate("/pricing")} className="text-primary hover:underline font-medium">
              Start free trial
            </button>
          </span>
          <span>·</span>
          <button onClick={() => navigate("/pricing")} className="text-primary hover:underline font-medium">
            View pricing
          </button>
        </div>

        <div className="text-center text-xs text-muted-foreground/60 mt-8 space-x-3">
          <a href="https://instantworker.ai/terms" className="hover:text-muted-foreground transition-colors">Terms of Service</a>
          <span>·</span>
          <a href="https://instantworker.ai/privacy" className="hover:text-muted-foreground transition-colors">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
