import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "./pages/Login";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WorkflowProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<TodayWorkflow />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="workers" element={<Workers />} />
            <Route path="judge" element={<Judge />} />
            <Route path="proof" element={<Proof />} />
            <Route path="safety" element={<Safety />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </WorkflowProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
