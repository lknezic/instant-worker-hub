import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import logoIcon from "@/assets/logo-icon.png";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      setError("Invalid magic link — missing email or token.");
      setVerifying(false);
      return;
    }

    (async () => {
      try {
        const res = await import("@/lib/api").then(m => m.auth.verify(email, token));
        login(res.access_token, res.user);
        navigate("/app", { replace: true });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Verification failed. The link may have expired.");
        setVerifying(false);
      }
    })();
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <img src={logoIcon} alt="InstantWorker" className="w-10 h-10 mx-auto mb-4 invert" />
        {verifying ? (
          <>
            <h2 className="text-lg font-bold mb-2">Logging you in...</h2>
            <p className="text-sm text-muted-foreground">Verifying your magic link</p>
          </>
        ) : error ? (
          <>
            <h2 className="text-lg font-bold mb-2 text-destructive">Login Failed</h2>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-primary hover:underline"
            >
              Back to login →
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Verify;
