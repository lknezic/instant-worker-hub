import { createContext, useContext, useState, type ReactNode } from "react";

interface WorkflowContextType {
  todayComplete: boolean;
  setTodayComplete: (v: boolean) => void;
}

const WorkflowContext = createContext<WorkflowContextType>({ todayComplete: false, setTodayComplete: () => {} });

export const useWorkflow = () => useContext(WorkflowContext);

export const WorkflowProvider = ({ children }: { children: ReactNode }) => {
  const [todayComplete, setTodayComplete] = useState(false);
  return (
    <WorkflowContext.Provider value={{ todayComplete, setTodayComplete }}>
      {children}
    </WorkflowContext.Provider>
  );
};
