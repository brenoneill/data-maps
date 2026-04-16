import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { AlertItem } from "@/types";

interface AlertContextValue {
  alerts: AlertItem[];
  addAlert: (type: AlertItem["type"], message: string) => void;
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const addAlert = useCallback((type: AlertItem["type"], message: string) => {
    const id = crypto.randomUUID();
    setAlerts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 4000);
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts(): AlertContextValue {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlerts must be used within AlertProvider");
  return ctx;
}
