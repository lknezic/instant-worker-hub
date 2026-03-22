import { useNavigate } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.png";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <img src={logoIcon} alt="InstantWorker" className="w-10 h-10 mx-auto mb-4 invert" />
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-muted-foreground mb-6">Page not found</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-primary hover:underline font-medium"
          >
            Go to Login
          </button>
          <span className="text-muted-foreground">·</span>
          <button
            onClick={() => navigate("/app")}
            className="text-sm text-primary hover:underline font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
