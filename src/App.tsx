import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import Pricing from "./pages/Pricing";
import Onboarding from "./pages/Onboarding";
import TodayWorkflow from "./pages/TodayWorkflow";
import Dashboard from "./pages/Dashboard";
import Workers from "./pages/Workers";
import Settings from "./pages/Settings";
import { Judge, Proof, Safety } from "./pages/Placeholders";
import AppLayout from "./components/AppLayout";
import { WorkflowProvider } from "./contexts/WorkflowContext";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WorkflowProvider>
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/verify" element={<Verify />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<TodayWorkflow />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="workers" element={<Workers />} />
            <Route path="judge" element={<Judge />} />
            <Route path="proof" element={<Proof />} />
            <Route path="safety" element={<Safety />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        </AuthProvider>
      </BrowserRouter>
      </WorkflowProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
