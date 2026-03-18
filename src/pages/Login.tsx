import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">InstantWorker</h1>
          <p className="text-muted-foreground text-sm mt-1">AI workers that learn & grow</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-medium text-sm rounded-md py-2 hover:opacity-90 transition-opacity"
              >
                Send Magic Link
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="text-2xl mb-3">✉️</div>
              <p className="font-medium">Check your email</p>
              <p className="text-sm text-muted-foreground mt-1">We sent a login link to {email}</p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-border">
            <button
              onClick={() => navigate("/app")}
              className="w-full border border-border text-muted-foreground text-sm rounded-md py-2 hover:text-foreground hover:border-muted-foreground transition-colors"
            >
              Dev Login →
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Don't have an account?{" "}
          <button onClick={() => navigate("/pricing")} className="text-primary hover:underline">
            View pricing
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
